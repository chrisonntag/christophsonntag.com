# Personal website

This is the my personal website running on the [Slimframework](http://www.slimframework.com/). It includes a controller for fetching starred links from [Pocket](https://getpocket.com) as well as a simple Blog engine. 

## Blog
Articles can be Markdown files with an additional meta header with the following structure

```
{
      "title" : "Convolutional Neural Networks",
      "date"  : "18-05-2020",
      "slug"  : "convolutional-neural-networks",
      "author": "Max Mustermannm"
}

This is the content.
```

The meta block must be separated by a ```\n``` character from the content. LaTeX equations (```$$x=42$$```) and inline code (```$x=42$```) will be rendered by [MathJax](https://www.mathjax.org/).
