# Personal website

This is the my personal website running on the [Slimframework](http://www.slimframework.com/). It includes a controller for fetching starred links from [Pocket](https://getpocket.com) as well as a simple Blog engine.

## Run
Install dependencies with ```composer install``` and run a local dev server with ```/usr/bin/php -S localhost:8080 -t ./public``` pointing to the public dir.

## Blog
Articles can be Markdown files (in ```/blog``` by default) with an additional meta header with the following structure

```
{
      "title" : "Title of the article",
      "date"  : "dd-mm-yyyy",
      "slug"  : "find-a-good-slug-for-it",
      "author": "Christoph Sonntag",
      "tags": ["comma", "separated", "tags", "list"],
      "image": "the_name_of_the_header_image.jpg"
}

This is the content.
```

The meta block must be separated by a ```\n``` character from the content. LaTeX equations (```$$x=42$$```) and inline code (```$x=42$```) will be rendered by [MathJax](https://www.mathjax.org/).
