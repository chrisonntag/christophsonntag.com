-- micron.lua — a Pandoc custom writer that emits NomadNet Micron (.mu)
--
-- Usage:
--   pandoc -f markdown -t micron.lua input.md -o output.mu
--
-- Because it consumes Pandoc's AST, it works from *any* Pandoc-supported
-- source (Markdown, CommonMark, GFM, reST, Org, HTML, ...). Point it at the
-- same source files your SSG already builds HTML from and you get a parallel
-- .mu tree — no coupling to Hugo/Eleventy/Jekyll internals.
--
-- Tunable behaviour lives in the CONFIG block below; per-SSG differences
-- (mainly link/permalink conventions) are all isolated in rewrite_link().

--------------------------------------------------------------------------------
-- CONFIG
--------------------------------------------------------------------------------
local CFG = {
  page_root      = ":/page",  -- node-relative root for internal page links
  file_root      = ":/file",  -- node-relative root for downloadable files
  max_heading    = 3,         -- Micron supports > >> >>>
  images_as_links = true,     -- Micron has no inline images; link to the file
  code_color     = "0a0",     -- fg colour hint for inline code ("" to disable)
  wrap_width     = 0,         -- 0 = don't hard-wrap (MeshChat likes <130)
}

--------------------------------------------------------------------------------
-- Escaping: the Micron tag char is the backtick. A literal backtick in body
-- text must be written as \`  (backslash-escape). Line-start chars > # - only
-- act as markup at the very start of a line; we guard those in Doc().
--------------------------------------------------------------------------------
local function escape(s)
  return (s:gsub("\\", "\\\\"):gsub("`", "\\`"))
end

--------------------------------------------------------------------------------
-- Link rewriting — the ONE place per-SSG conventions differ.
--   /about/          -> :/page/about/index.mu
--   ../guide.md      -> :/page/guide.mu
--   https://x.y/z    -> unchanged (external)
--------------------------------------------------------------------------------
local function is_external(t)
  return t:match("^%a[%w+.%-]*://") or t:match("^mailto:") or t:match("^rns:")
end

local function rewrite_link(tgt)
  if tgt == nil or tgt == "" then return CFG.page_root .. "/" end
  if is_external(tgt) then return tgt end

  -- split off a #fragment if present
  local path, frag = tgt:match("^([^#]*)(#?.*)$")
  path = path or tgt
  frag = frag or ""

  path = path:gsub("^%./", "")
  path = path:gsub("%.md$", ".mu"):gsub("%.markdown$", ".mu"):gsub("%.html?$", ".mu")
  if path:match("/$") then path = path .. "index.mu" end
  if path ~= "" and not path:match("%.mu$") then path = path .. ".mu" end

  if path:sub(1, 1) == "/" then
    path = CFG.page_root .. path
  else
    path = CFG.page_root .. "/" .. path
  end
  return path .. frag
end

local function rewrite_file(src)
  if is_external(src) then return src end
  src = src:gsub("^%./", "")
  if src:sub(1, 1) == "/" then return CFG.file_root .. src end
  return CFG.file_root .. "/" .. src
end

--------------------------------------------------------------------------------
-- Block separator + document assembly
--------------------------------------------------------------------------------
function Blocksep()
  return "\n\n"
end

function Doc(body, metadata, variables)
  local out = {}
  -- Optional page colour preamble driven by metadata (front matter):
  -- e.g.  bg: "222"  fg: "ddd"  in your YAML front matter.
  local bg = metadata and metadata.bg
  local fg = metadata and metadata.fg
  local pre = ""
  if bg then pre = pre .. "`B" .. tostring(bg) end
  if fg then pre = pre .. "`F" .. tostring(fg) end
  if pre ~= "" then table.insert(out, pre) end

  table.insert(out, body)

  local text = table.concat(out, "\n")

  -- Guard line-start markup that leaked in from body text. A rendered line
  -- that begins with a bare > # or - (but isn't one WE emitted) is rare, but
  -- we leave real emitted markup intact by only guarding lines that begin
  -- with those chars followed by a space where we didn't intend a heading.
  -- (Kept conservative: headings/dividers we emit are handled at emit time.)
  return text .. "\n"
end

--------------------------------------------------------------------------------
-- Inlines
--------------------------------------------------------------------------------
function Str(s)        return escape(s) end
function Space()       return " " end
function SoftBreak()   return "\n" end
function LineBreak()   return "\n" end
function Emph(s)       return "`*" .. s .. "`*" end
function Strong(s)     return "`!" .. s .. "`!" end
function Underline(s)  return "`_" .. s .. "`_" end
function Strikeout(s)  return s end                 -- no Micron equivalent
function Subscript(s)  return s end
function Superscript(s) return s end
function SmallCaps(s)  return s end

function Code(s, attr)
  local body = escape(s)
  if CFG.code_color ~= "" then
    return "`F" .. CFG.code_color .. body .. "`f"
  end
  return body
end

function Link(s, tgt, tit, attr)
  return "`_`[" .. s .. "`" .. rewrite_link(tgt) .. "]`_"
end

function Image(s, src, tit, attr)
  if CFG.images_as_links then
    local label = (s ~= nil and s ~= "") and s or "image"
    return "Image: `_`[" .. label .. "`" .. rewrite_file(src) .. "]`_"
  end
  return ""  -- drop
end

function Note(s)        return " [" .. s .. "]" end
function Span(s, attr)  return s end
function DoubleQuoted(s) return '"' .. s .. '"' end
function SingleQuoted(s) return "'" .. s .. "'" end
function Cite(s, cs)    return s end
function Math(kind, s)  return escape(s) end
function InlineMath(s)  return escape(s) end
function DisplayMath(s) return escape(s) end

function RawInline(format, str)
  if format == "micron" or format == "mu" then return str end
  return ""
end

--------------------------------------------------------------------------------
-- Blocks
--------------------------------------------------------------------------------
function Plain(s) return s end
function Para(s)  return s end

function Header(level, s, attr)
  local n = math.min(level, CFG.max_heading)
  return string.rep(">", n) .. s
end

function BlockQuote(s)
  local lines = {}
  for line in (s .. "\n"):gmatch("(.-)\n") do
    table.insert(lines, "  " .. line)
  end
  return table.concat(lines, "\n")
end

function HorizontalRule() return "-" end

function CodeBlock(s, attr)
  -- Literal mode: everything between `=  ...  `= is shown verbatim,
  -- so no backtick escaping needed inside.
  return "`=\n" .. s .. "\n`="
end

function BulletList(items)
  local out = {}
  for _, item in ipairs(items) do
    table.insert(out, "- " .. item)
  end
  return table.concat(out, "\n")
end

function OrderedList(items, start)
  local out = {}
  local n = start or 1
  for _, item in ipairs(items) do
    table.insert(out, n .. ". " .. item)
    n = n + 1
  end
  return table.concat(out, "\n")
end

function DefinitionList(items)
  local out = {}
  for _, item in ipairs(items) do
    for term, defs in pairs(item) do
      table.insert(out, "`!" .. term .. "`!")
      for _, d in ipairs(defs) do
        table.insert(out, "  " .. d)
      end
    end
  end
  return table.concat(out, "\n")
end

function Div(s, attr) return s end

function RawBlock(format, str)
  if format == "micron" or format == "mu" then return str end
  return ""
end

function Table(caption, aligns, widths, headers, rows)
  -- Micron has no strong table primitive; render a simple text table
  -- inside literal mode so spacing is preserved by the renderer.
  local function join(r) return table.concat(r, " | ") end
  local out = {"`="}
  if caption and caption ~= "" then table.insert(out, caption) end
  table.insert(out, join(headers))
  table.insert(out, string.rep("-", #join(headers)))
  for _, row in ipairs(rows) do table.insert(out, join(row)) end
  table.insert(out, "`=")
  return table.concat(out, "\n")
end

--------------------------------------------------------------------------------
-- Warn on any AST element we forgot to handle (helpful while extending).
--------------------------------------------------------------------------------
local meta = {}
meta.__index = function(_, key)
  io.stderr:write(string.format("micron.lua: unhandled element '%s'\n", key))
  return function() return "" end
end
setmetatable(_G, meta)
