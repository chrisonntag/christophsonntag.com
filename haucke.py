#!/usr/bin/env python3
"""haucke — a tiny static site generator for outputting NomadNet Micron pages.

Content (Markdown + YAML front matter) is converted to Micron via Pandoc and a 
custom micron.lua writer. Structural pages (home, section indexes) are rendered from
Jinja2 templates in adaptable themes. 

Templates come from themes/<theme>/ where <theme> is the `theme` key in the
config.
"""
import argparse
import shutil
import subprocess
from pathlib import Path

import frontmatter
from jinja2 import Environment, FileSystemLoader

try:
    import tomllib                     
except ModuleNotFoundError:            
    import tomli as tomllib


DEFAULT_CONFIG_NAME = "haucke"
DEFAULT_THEME = "haucke"


def convert_body(md: str, writer: Path) -> str:
    """Markdown body -> Micron, via Pandoc + the micron.lua writer."""
    if not md.strip():
        return ""
    r = subprocess.run(
        ["pandoc", "-f", "markdown", "-t", str(writer)],
        input=md, capture_output=True, text=True,
    )
    if r.returncode != 0:
        raise RuntimeError(f"pandoc failed:\n{r.stderr}")
    return r.stdout.strip("\n")


def url_for(rel: Path) -> str:
    """content/posts/hello.md -> posts/hello.mu ; _index.md -> index.mu"""
    p = rel.with_suffix(".mu")
    if p.name == "_index.mu":
        p = p.parent / "index.mu"
    return str(p).replace("\\", "/")


class Page:
    def __init__(self, rel: Path, meta: dict, body: str):
        self.rel = rel
        self.meta = meta or {}
        self.body = body
        self.url = url_for(rel)
        self.title = self.meta.get("title") or rel.stem
        self.date = str(self.meta.get("date", ""))[:10]
        self.tags = self.meta.get("tags") or []
        self.section = rel.parts[0] if len(rel.parts) > 1 else ""
        self.is_index = rel.name == "_index.md"
        self.is_about = rel.name == "_about.md"


def load_pages(content: Path, writer: Path):
    pages = []
    for md in sorted(content.rglob("*.md")):
        post = frontmatter.load(md)
        if post.get("draft"):
            continue
        rel = md.relative_to(content)
        pages.append(Page(rel, post.metadata, convert_body(post.content, writer)))
    return pages


def discover_config(root: Path) -> Path:
    """Find a single *.toml config in `root` when --config isn't given."""
    default_config = root / f"{DEFAULT_CONFIG_NAME}.toml"
    if default_config.exists():
        return default_config

    ignore = {"pyproject.toml", "hugo.toml"} 
    candidates = sorted(p for p in root.glob("*.toml") if p.name not in ignore)
    if not candidates:
        raise SystemExit(
            f"no *.toml config found in {root}/ — create one (e.g. {DEFAULT_CONFIG_NAME}.toml) "
            f"or pass --config")
    if len(candidates) > 1:
        names = ", ".join(p.name for p in candidates)
        raise SystemExit(
            f"multiple TOML configs in {root}/ ({names}) — pick one with --config")
    return candidates[0]


def main():
    ap = argparse.ArgumentParser(description="Static Micron site generator")
    ap.add_argument("-c", "--content", default="content")
    ap.add_argument("-o", "--output", default="public-micron")
    ap.add_argument("--themes", default="themes",
                    help="themes root; the active theme is set by 'theme' in the config")
    ap.add_argument("--config", default=None,
                    help="TOML config path; if omitted, auto-discovers a single "
                         "*.toml in --root")
    ap.add_argument("--root", default=".",
                    help="directory searched for a config when --config is omitted")
    ap.add_argument("--writer", default="micron.lua")
    args = ap.parse_args()

    content, out = Path(args.content), Path(args.output)
    writer = Path(args.writer)
    cfg_path = Path(args.config) if args.config else discover_config(Path(args.root))
    if not cfg_path.exists():
        raise SystemExit(f"config not found: {cfg_path}")
    with cfg_path.open("rb") as fh:            # tomllib requires binary mode
        site = tomllib.load(fh)
    print(f"  config {cfg_path}")

    theme = site.get("theme", DEFAULT_THEME)
    theme_dir = Path(args.themes) / theme
    if not theme_dir.is_dir():
        raise SystemExit(f"theme folder not found: {theme_dir}")

    env = Environment(
        loader=FileSystemLoader(str(theme_dir)),
        trim_blocks=True, 
        lstrip_blocks=True,
        autoescape=False,  # Micron is NOT html — never escape
        keep_trailing_newline=True,
    )

    pages = load_pages(content, writer)
    posts = sorted(
        [p for p in pages if p.section == "posts" and not p.is_index],
        key=lambda p: p.date, reverse=True,
    )

    def link(url, label=None):
        return f"`[{label or url}`:/page/{url}]"

    env.globals.update(site=site, link=link, posts=posts, pages=pages)

    # TODO: Create theme/template structure
    page_tpl = env.get_template("page.mu.j2")
    index_tpl = env.get_template("index.mu.j2")

    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)

    home_body = ""
    about_body = ""
    for p in pages:
        if p.is_index and p.section == "":
            home_body = p.body
            continue
        if p.is_about and p.section == "":
            about_body = p.body
            continue
        target = out / p.url
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page_tpl.render(page=p, body=p.body))
        print(f"  page   {p.rel} -> {p.url}")

    (out / "index.mu").write_text(index_tpl.render(intro=home_body or about_body))
    print("  index  _index.md + template -> index.mu")
    print(f"Built {len(pages)} page(s) with theme '{theme}' into {out}/")


if __name__ == "__main__":
    main()
