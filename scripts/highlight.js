// Using require
const hljs = require('highlight.js/lib/core');

hljs.registerLanguage('scala', require('highlight.js/lib/languages/scala'));
hljs.registerLanguage('python', require('highlight.js/lib/languages/python'));
hljs.registerLanguage('python-repl', require('highlight.js/lib/languages/python-repl'));
hljs.highlightAll();
