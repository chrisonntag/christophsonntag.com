!function(){var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},t={},i=e.parcelRequire8280;null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in t){var i=t[e];delete t[e];var r={id:e,exports:{}};return n[e]=r,i.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,n){t[e]=n},e.parcelRequire8280=i);var r=i.register;r("72R40",function(e,n){e.exports=function(e){let n=e.regex,t={className:"subst",variants:[{begin:"\\$[A-Za-z0-9_]+"},{begin:/\$\{/,end:/\}/}]},i={className:"string",variants:[{begin:'"""',end:'"""'},{begin:'"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:'[a-z]+"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE,t]},{className:"string",begin:'[a-z]+"""',end:'"""',contains:[t],relevance:10}]},r={className:"type",begin:"\\b[A-Z][A-Za-z0-9_]*",relevance:0},a={className:"title",begin:/[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,relevance:0},s={className:"class",beginKeywords:"class object trait type",end:/[:={\[\n;]/,excludeEnd:!0,contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{beginKeywords:"extends with",relevance:10},{begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0,relevance:0,contains:[r,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"params",begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,relevance:0,contains:[r,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},a]},o={className:"function",beginKeywords:"def",end:n.lookahead(/[:={\[(\n;]/),contains:[a]};return{name:"Scala",keywords:{literal:"true false null",keyword:"type yield lazy override def with val var sealed abstract private trait object if then forSome for while do throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit export enum given transparent"},contains:[{begin:["//>",/\s+/,/using/,/\s+/,/\S+/],beginScope:{1:"comment",3:"keyword",5:"type"},end:/$/,contains:[{className:"string",begin:/\S+/}]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,i,r,o,s,e.C_NUMBER_MODE,{begin:[/^\s*/,"extension",/\s+(?=[[(])/],beginScope:{2:"keyword"}},{begin:[/^\s*/,/end/,/\s+/,/(extension\b)?/],beginScope:{2:"keyword",4:"keyword"}},{match:/\.inline\b/},{begin:/\binline(?=\s)/,keywords:"inline"},{begin:[/\(\s*/,/using/,/\s+(?!\))/],beginScope:{2:"keyword"}},{className:"meta",begin:"@[A-Za-z]+"}]}}}),r("5QYYR",function(e,n){e.exports=function(e){let n=e.regex,t=/[\p{XID_Start}_]\p{XID_Continue}*/u,i=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],r={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:i,built_in:["__import__","abs","all","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},a={className:"meta",begin:/^(>>>|\.\.\.) /},s={className:"subst",begin:/\{/,end:/\}/,keywords:r,illegal:/#/},o={begin:/\{\{/,relevance:0},l={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,a],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,a],relevance:10},{begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,a,o,s]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,a,o,s]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,contains:[e.BACKSLASH_ESCAPE,o,s]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,o,s]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},c="[0-9](_?[0-9])*",g=`(\\b(${c}))?\\.(${c})|\\b(${c})\\.`,u=`\\b|${i.join("|")}`,d={className:"number",relevance:0,variants:[{begin:`(\\b(${c})|(${g}))[eE][+-]?(${c})[jJ]?(?=${u})`},{begin:`(${g})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${u})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${u})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${u})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${u})`},{begin:`\\b(${c})[jJ](?=${u})`}]},h={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:r,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},f={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:["self",a,d,l,e.HASH_COMMENT_MODE]}]};return s.contains=[l,d,a],{name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:r,illegal:/(<\/|\?)|=>/,contains:[a,d,{begin:/\bself\b/},{beginKeywords:"if",relevance:0},l,h,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[f]},{variants:[{match:[/\bclass/,/\s+/,t,/\s*/,/\(\s*/,t,/\s*\)/]},{match:[/\bclass/,/\s+/,t]}],scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[d,f,l]}]}}}),r("lc7e8",function(e,n){e.exports=function(e){return{aliases:["pycon"],contains:[{className:"meta.prompt",starts:{end:/ |$/,starts:{end:"$",subLanguage:"python"}},variants:[{begin:/^>>>(?=[ ]|$)/},{begin:/^\.\.\.(?=[ ]|$)/}]}]}}});var a={};class s{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function o(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function l(e,...n){let t=Object.create(null);for(let n in e)t[n]=e[n];return n.forEach(function(e){for(let n in e)t[n]=e[n]}),t}let c=e=>!!e.scope,g=(e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let t=e.split(".");return[`${n}${t.shift()}`,...t.map((e,n)=>`${e}${"_".repeat(n+1)}`)].join(" ")}return`${n}${e}`};class u{constructor(e,n){this.buffer="",this.classPrefix=n.classPrefix,e.walk(this)}addText(e){this.buffer+=o(e)}openNode(e){if(!c(e))return;let n=g(e.scope,{prefix:this.classPrefix});this.span(n)}closeNode(e){c(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){this.buffer+=`<span class="${e}">`}}let d=(e={})=>{let n={children:[]};return Object.assign(n,e),n};class h{constructor(){this.rootNode=d(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){this.top.children.push(e)}openNode(e){let n=d({scope:e});this.add(n),this.stack.push(n)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,n){return"string"==typeof n?e.addText(n):n.children&&(e.openNode(n),n.children.forEach(n=>this._walk(e,n)),e.closeNode(n)),e}static _collapse(e){"string"!=typeof e&&e.children&&(e.children.every(e=>"string"==typeof e)?e.children=[e.children.join("")]:e.children.forEach(e=>{h._collapse(e)}))}}class f extends h{constructor(e){super(),this.options=e}addText(e){""!==e&&this.add(e)}startScope(e){this.openNode(e)}endScope(){this.closeNode()}__addSublanguage(e,n){let t=e.root;n&&(t.scope=`language:${n}`),this.add(t)}toHTML(){return new u(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function p(e){return e?"string"==typeof e?e:e.source:null}function b(e){return _("(?=",e,")")}function m(e){return _("(?:",e,")*")}function E(e){return _("(?:",e,")?")}function _(...e){return e.map(e=>p(e)).join("")}function y(...e){return"("+(function(e){let n=e[e.length-1];return"object"==typeof n&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}(e).capture?"":"?:")+e.map(e=>p(e)).join("|")+")"}function x(e){return RegExp(e.toString()+"|").exec("").length-1}let w=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function S(e,{joinWith:n}){let t=0;return e.map(e=>{let n=t+=1,i=p(e),r="";for(;i.length>0;){let e=w.exec(i);if(!e){r+=i;break}r+=i.substring(0,e.index),i=i.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?r+="\\"+String(Number(e[1])+n):(r+=e[0],"("===e[0]&&t++)}return r}).map(e=>`(${e})`).join(n)}let N="[a-zA-Z]\\w*",O="[a-zA-Z_]\\w*",v="\\b\\d+(\\.\\d+)?",M="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",A="\\b(0b[01]+)",R={begin:"\\\\[\\s\\S]",relevance:0},k=function(e,n,t={}){let i=l({scope:"comment",begin:e,end:n,contains:[]},t);i.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let r=y("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return i.contains.push({begin:_(/[ ]+/,"(",r,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),i},B=k("//","$"),L=k("/\\*","\\*/"),C=k("#","$");var T=Object.freeze({__proto__:null,APOS_STRING_MODE:{scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[R]},BACKSLASH_ESCAPE:R,BINARY_NUMBER_MODE:{scope:"number",begin:A,relevance:0},BINARY_NUMBER_RE:A,COMMENT:k,C_BLOCK_COMMENT_MODE:L,C_LINE_COMMENT_MODE:B,C_NUMBER_MODE:{scope:"number",begin:M,relevance:0},C_NUMBER_RE:M,END_SAME_AS_BEGIN:function(e){return Object.assign(e,{"on:begin":(e,n)=>{n.data._beginMatch=e[1]},"on:end":(e,n)=>{n.data._beginMatch!==e[1]&&n.ignoreMatch()}})},HASH_COMMENT_MODE:C,IDENT_RE:N,MATCH_NOTHING_RE:/\b\B/,METHOD_GUARD:{begin:"\\.\\s*"+O,relevance:0},NUMBER_MODE:{scope:"number",begin:v,relevance:0},NUMBER_RE:v,PHRASAL_WORDS_MODE:{begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},QUOTE_STRING_MODE:{scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[R]},REGEXP_MODE:{scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[R,{begin:/\[/,end:/\]/,relevance:0,contains:[R]}]},RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",SHEBANG:(e={})=>{let n=/^#![ ]*\//;return e.binary&&(e.begin=_(n,/.*\b/,e.binary,/\b.*/)),l({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(e,n)=>{0!==e.index&&n.ignoreMatch()}},e)},TITLE_MODE:{scope:"title",begin:N,relevance:0},UNDERSCORE_IDENT_RE:O,UNDERSCORE_TITLE_MODE:{scope:"title",begin:O,relevance:0}});function j(e,n){"."===e.input[e.index-1]&&n.ignoreMatch()}function I(e,n){void 0!==e.className&&(e.scope=e.className,delete e.className)}function $(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=j,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,void 0===e.relevance&&(e.relevance=0))}function D(e,n){Array.isArray(e.illegal)&&(e.illegal=y(...e.illegal))}function H(e,n){if(e.match){if(e.begin||e.end)throw Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function P(e,n){void 0===e.relevance&&(e.relevance=1)}let U=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw Error("beforeMatch cannot be used with starts");let t=Object.assign({},e);Object.keys(e).forEach(n=>{delete e[n]}),e.keywords=t.keywords,e.begin=_(t.beforeMatch,b(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},K=["of","and","for","in","not","or","if","then","parent","list","value"],z={},F=e=>{console.error(e)},W=(e,...n)=>{console.log(`WARN: ${e}`,...n)},X=(e,n)=>{z[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),z[`${e}/${n}`]=!0)},G=Error();function Z(e,n,{key:t}){let i=0,r=e[t],a={},s={};for(let e=1;e<=n.length;e++)s[e+i]=r[e],a[e+i]=!0,i+=x(n[e-1]);e[t]=s,e[t]._emit=a,e[t]._multi=!0}function J(e){e.scope&&"object"==typeof e.scope&&null!==e.scope&&(e.beginScope=e.scope,delete e.scope),"string"==typeof e.beginScope&&(e.beginScope={_wrap:e.beginScope}),"string"==typeof e.endScope&&(e.endScope={_wrap:e.endScope}),function(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw F("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),G;if("object"!=typeof e.beginScope||null===e.beginScope)throw F("beginScope must be object"),G;Z(e,e.begin,{key:"beginScope"}),e.begin=S(e.begin,{joinWith:""})}}(e),function(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw F("skip, excludeEnd, returnEnd not compatible with endScope: {}"),G;if("object"!=typeof e.endScope||null===e.endScope)throw F("endScope must be object"),G;Z(e,e.end,{key:"endScope"}),e.end=S(e.end,{joinWith:""})}}(e)}class Y extends Error{constructor(e,n){super(e),this.name="HTMLInjectionError",this.html=n}}let q=Symbol("nomatch"),Q=function(e){let n=Object.create(null),t=Object.create(null),i=[],r=!0,a="Could not find the language '{}', did you forget to load/include a language module?",c={disableAutodetect:!0,name:"Plain text",contains:[]},g={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:f};function u(e){return g.noHighlightRe.test(e)}function d(e,n,t){let i="",r="";"object"==typeof n?(i=e,t=n.ignoreIllegals,r=n.language):(X("10.7.0","highlight(lang, code, ...args) has been deprecated."),X("10.7.0","Please use highlight(code, options) instead.\nhttps://github.com/highlightjs/highlight.js/issues/2277"),r=e,i=n),void 0===t&&(t=!0);let a={code:i,language:r};k("before:highlight",a);let s=a.result?a.result:h(a.language,a.code,t);return s.code=a.code,k("after:highlight",s),s}function h(e,t,i,c){let u=Object.create(null);function d(){if(!A.keywords){k.addText(B);return}let e=0;A.keywordPatternRe.lastIndex=0;let n=A.keywordPatternRe.exec(B),t="";for(;n;){t+=B.substring(e,n.index);let i=N.case_insensitive?n[0].toLowerCase():n[0],r=A.keywords[i];if(r){let[e,a]=r;if(k.addText(t),t="",u[i]=(u[i]||0)+1,u[i]<=7&&(L+=a),e.startsWith("_"))t+=n[0];else{let t=N.classNameAliases[e]||e;b(n[0],t)}}else t+=n[0];e=A.keywordPatternRe.lastIndex,n=A.keywordPatternRe.exec(B)}t+=B.substring(e),k.addText(t)}function f(){null!=A.subLanguage?function(){if(""===B)return;let e=null;if("string"==typeof A.subLanguage){if(!n[A.subLanguage]){k.addText(B);return}e=h(A.subLanguage,B,!0,R[A.subLanguage]),R[A.subLanguage]=e._top}else e=w(B,A.subLanguage.length?A.subLanguage:null);A.relevance>0&&(L+=e.relevance),k.__addSublanguage(e._emitter,e.language)}():d(),B=""}function b(e,n){""!==e&&(k.startScope(n),k.addText(e),k.endScope())}function m(e,n){let t=1,i=n.length-1;for(;t<=i;){if(!e._emit[t]){t++;continue}let i=N.classNameAliases[e[t]]||e[t],r=n[t];i?b(r,i):(B=r,d(),B=""),t++}}function E(e,n){return e.scope&&"string"==typeof e.scope&&k.openNode(N.classNameAliases[e.scope]||e.scope),e.beginScope&&(e.beginScope._wrap?(b(B,N.classNameAliases[e.beginScope._wrap]||e.beginScope._wrap),B=""):e.beginScope._multi&&(m(e.beginScope,n),B="")),A=Object.create(e,{parent:{value:A}})}let _={};function y(n,a){let o=a&&a[0];if(B+=n,null==o)return f(),0;if("begin"===_.type&&"end"===a.type&&_.index===a.index&&""===o){if(B+=t.slice(a.index,a.index+1),!r){let n=Error(`0 width match regex (${e})`);throw n.languageName=e,n.badRule=_.rule,n}return 1}if(_=a,"begin"===a.type)return function(e){let n=e[0],t=e.rule,i=new s(t);for(let r of[t.__beforeBegin,t["on:begin"]])if(r&&(r(e,i),i.isMatchIgnored))return 0===A.matcher.regexIndex?(B+=n[0],1):(j=!0,0);return t.skip?B+=n:(t.excludeBegin&&(B+=n),f(),t.returnBegin||t.excludeBegin||(B=n)),E(t,e),t.returnBegin?0:n.length}(a);if("illegal"!==a.type||i){if("end"===a.type){let e=function(e){let n=e[0],i=t.substring(e.index),r=function e(n,t,i){let r=function(e,n){let t=e&&e.exec(n);return t&&0===t.index}(n.endRe,i);if(r){if(n["on:end"]){let e=new s(n);n["on:end"](t,e),e.isMatchIgnored&&(r=!1)}if(r){for(;n.endsParent&&n.parent;)n=n.parent;return n}}if(n.endsWithParent)return e(n.parent,t,i)}(A,e,i);if(!r)return q;let a=A;A.endScope&&A.endScope._wrap?(f(),b(n,A.endScope._wrap)):A.endScope&&A.endScope._multi?(f(),m(A.endScope,e)):a.skip?B+=n:(a.returnEnd||a.excludeEnd||(B+=n),f(),a.excludeEnd&&(B=n));do A.scope&&k.closeNode(),A.skip||A.subLanguage||(L+=A.relevance),A=A.parent;while(A!==r.parent)return r.starts&&E(r.starts,e),a.returnEnd?0:n.length}(a);if(e!==q)return e}}else{let e=Error('Illegal lexeme "'+o+'" for mode "'+(A.scope||"<unnamed>")+'"');throw e.mode=A,e}if("illegal"===a.type&&""===o)return 1;if(T>1e5&&T>3*a.index)throw Error("potential infinite loop, way more iterations than matches");return B+=o,o.length}let N=M(e);if(!N)throw F(a.replace("{}",e)),Error('Unknown language: "'+e+'"');let O=function(e){function n(n,t){return RegExp(p(n),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(t?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(e,n){n.position=this.position++,this.matchIndexes[this.matchAt]=n,this.regexes.push([n,e]),this.matchAt+=x(e)+1}compile(){0===this.regexes.length&&(this.exec=()=>null);let e=this.regexes.map(e=>e[1]);this.matcherRe=n(S(e,{joinWith:"|"}),!0),this.lastIndex=0}exec(e){this.matcherRe.lastIndex=this.lastIndex;let n=this.matcherRe.exec(e);if(!n)return null;let t=n.findIndex((e,n)=>n>0&&void 0!==e),i=this.matchIndexes[t];return n.splice(0,t),Object.assign(n,i)}}class i{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){if(this.multiRegexes[e])return this.multiRegexes[e];let n=new t;return this.rules.slice(e).forEach(([e,t])=>n.addRule(e,t)),n.compile(),this.multiRegexes[e]=n,n}resumingScanAtSamePosition(){return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,n){this.rules.push([e,n]),"begin"===n.type&&this.count++}exec(e){let n=this.getMatcher(this.regexIndex);n.lastIndex=this.lastIndex;let t=n.exec(e);if(this.resumingScanAtSamePosition()){if(t&&t.index===this.lastIndex);else{let n=this.getMatcher(0);n.lastIndex=this.lastIndex+1,t=n.exec(e)}}return t&&(this.regexIndex+=t.position+1,this.regexIndex===this.count&&this.considerAll()),t}}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=l(e.classNameAliases||{}),function t(r,a){if(r.isCompiled)return r;[I,H,J,U].forEach(e=>e(r,a)),e.compilerExtensions.forEach(e=>e(r,a)),r.__beforeBegin=null,[$,D,P].forEach(e=>e(r,a)),r.isCompiled=!0;let s=null;return"object"==typeof r.keywords&&r.keywords.$pattern&&(r.keywords=Object.assign({},r.keywords),s=r.keywords.$pattern,delete r.keywords.$pattern),s=s||/\w+/,r.keywords&&(r.keywords=function e(n,t,i="keyword"){let r=Object.create(null);return"string"==typeof n?a(i,n.split(" ")):Array.isArray(n)?a(i,n):Object.keys(n).forEach(function(i){Object.assign(r,e(n[i],t,i))}),r;function a(e,n){t&&(n=n.map(e=>e.toLowerCase())),n.forEach(function(n){var t,i;let a=n.split("|");r[a[0]]=[e,(t=a[0],(i=a[1])?Number(i):K.includes(t.toLowerCase())?0:1)]})}}(r.keywords,e.case_insensitive)),r.keywordPatternRe=n(s,!0),a&&(r.begin||(r.begin=/\B|\b/),r.beginRe=n(r.begin),r.end||r.endsWithParent||(r.end=/\B|\b/),r.end&&(r.endRe=n(r.end)),r.terminatorEnd=p(r.end)||"",r.endsWithParent&&a.terminatorEnd&&(r.terminatorEnd+=(r.end?"|":"")+a.terminatorEnd)),r.illegal&&(r.illegalRe=n(r.illegal)),r.contains||(r.contains=[]),r.contains=[].concat(...r.contains.map(function(e){var n;return((n="self"===e?r:e).variants&&!n.cachedVariants&&(n.cachedVariants=n.variants.map(function(e){return l(n,{variants:null},e)})),n.cachedVariants)?n.cachedVariants:!function e(n){return!!n&&(n.endsWithParent||e(n.starts))}(n)?Object.isFrozen(n)?l(n):n:l(n,{starts:n.starts?l(n.starts):null})})),r.contains.forEach(function(e){t(e,r)}),r.starts&&t(r.starts,a),r.matcher=function(e){let n=new i;return e.contains.forEach(e=>n.addRule(e.begin,{rule:e,type:"begin"})),e.terminatorEnd&&n.addRule(e.terminatorEnd,{type:"end"}),e.illegal&&n.addRule(e.illegal,{type:"illegal"}),n}(r),r}(e)}(N),v="",A=c||O,R={},k=new g.__emitter(g);!function(){let e=[];for(let n=A;n!==N;n=n.parent)n.scope&&e.unshift(n.scope);e.forEach(e=>k.openNode(e))}();let B="",L=0,C=0,T=0,j=!1;try{if(N.__emitTokens)N.__emitTokens(t,k);else{for(A.matcher.considerAll();;){T++,j?j=!1:A.matcher.considerAll(),A.matcher.lastIndex=C;let e=A.matcher.exec(t);if(!e)break;let n=t.substring(C,e.index),i=y(n,e);C=e.index+i}y(t.substring(C))}return k.finalize(),v=k.toHTML(),{language:e,value:v,relevance:L,illegal:!1,_emitter:k,_top:A}}catch(n){if(n.message&&n.message.includes("Illegal"))return{language:e,value:o(t),illegal:!0,relevance:0,_illegalBy:{message:n.message,index:C,context:t.slice(C-100,C+100),mode:n.mode,resultSoFar:v},_emitter:k};if(r)return{language:e,value:o(t),illegal:!1,relevance:0,errorRaised:n,_emitter:k,_top:A};throw n}}function w(e,t){t=t||g.languages||Object.keys(n);let i=function(e){let n={value:o(e),illegal:!1,relevance:0,_top:c,_emitter:new g.__emitter(g)};return n._emitter.addText(e),n}(e),r=t.filter(M).filter(R).map(n=>h(n,e,!1));r.unshift(i);let[a,s]=r.sort((e,n)=>{if(e.relevance!==n.relevance)return n.relevance-e.relevance;if(e.language&&n.language){if(M(e.language).supersetOf===n.language)return 1;if(M(n.language).supersetOf===e.language)return -1}return 0});return a.secondBest=s,a}function N(e){let n=function(e){let n=e.className+" ";n+=e.parentNode?e.parentNode.className:"";let t=g.languageDetectRe.exec(n);if(t){let n=M(t[1]);return n||(W(a.replace("{}",t[1])),W("Falling back to no-highlight mode for this block.",e)),n?t[1]:"no-highlight"}return n.split(/\s+/).find(e=>u(e)||M(e))}(e);if(u(n))return;if(k("before:highlightElement",{el:e,language:n}),e.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",e);return}if(e.children.length>0&&(g.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(e)),g.throwUnescapedHTML))throw new Y("One of your code blocks includes unescaped HTML.",e.innerHTML);let i=e.textContent,r=n?d(i,{language:n,ignoreIllegals:!0}):w(i);e.innerHTML=r.value,e.dataset.highlighted="yes",function(e,n,i){let r=n&&t[n]||i;e.classList.add("hljs"),e.classList.add(`language-${r}`)}(e,n,r.language),e.result={language:r.language,re:r.relevance,relevance:r.relevance},r.secondBest&&(e.secondBest={language:r.secondBest.language,relevance:r.secondBest.relevance}),k("after:highlightElement",{el:e,result:r,text:i})}let O=!1;function v(){if("loading"===document.readyState){O=!0;return}document.querySelectorAll(g.cssSelector).forEach(N)}function M(e){return n[e=(e||"").toLowerCase()]||n[t[e]]}function A(e,{languageName:n}){"string"==typeof e&&(e=[e]),e.forEach(e=>{t[e.toLowerCase()]=n})}function R(e){let n=M(e);return n&&!n.disableAutodetect}function k(e,n){i.forEach(function(t){t[e]&&t[e](n)})}for(let a in"undefined"!=typeof window&&window.addEventListener&&window.addEventListener("DOMContentLoaded",function(){O&&v()},!1),Object.assign(e,{highlight:d,highlightAuto:w,highlightAll:v,highlightElement:N,highlightBlock:function(e){return X("10.7.0","highlightBlock will be removed entirely in v12.0"),X("10.7.0","Please use highlightElement now."),N(e)},configure:function(e){g=l(g,e)},initHighlighting:()=>{v(),X("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")},initHighlightingOnLoad:function(){v(),X("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")},registerLanguage:function(t,i){let a=null;try{a=i(e)}catch(e){if(F("Language definition for '{}' could not be registered.".replace("{}",t)),r)F(e);else throw e;a=c}a.name||(a.name=t),n[t]=a,a.rawDefinition=i.bind(null,e),a.aliases&&A(a.aliases,{languageName:t})},unregisterLanguage:function(e){for(let i of(delete n[e],Object.keys(t)))t[i]===e&&delete t[i]},listLanguages:function(){return Object.keys(n)},getLanguage:M,registerAliases:A,autoDetection:R,inherit:l,addPlugin:function(e){var n;(n=e)["before:highlightBlock"]&&!n["before:highlightElement"]&&(n["before:highlightElement"]=e=>{n["before:highlightBlock"](Object.assign({block:e.el},e))}),n["after:highlightBlock"]&&!n["after:highlightElement"]&&(n["after:highlightElement"]=e=>{n["after:highlightBlock"](Object.assign({block:e.el},e))}),i.push(e)},removePlugin:function(e){let n=i.indexOf(e);-1!==n&&i.splice(n,1)}}),e.debugMode=function(){r=!1},e.safeMode=function(){r=!0},e.versionString="11.9.0",e.regex={concat:_,lookahead:b,either:y,optional:E,anyNumberOfTimes:m},T)"object"==typeof T[a]&&function e(n){return n instanceof Map?n.clear=n.delete=n.set=function(){throw Error("map is read-only")}:n instanceof Set&&(n.add=n.clear=n.delete=function(){throw Error("set is read-only")}),Object.freeze(n),Object.getOwnPropertyNames(n).forEach(t=>{let i=n[t],r=typeof i;"object"!==r&&"function"!==r||Object.isFrozen(i)||e(i)}),n}(T[a]);return Object.assign(e,T),e},V=Q({});V.newInstance=()=>Q({}),a=V,V.HighlightJS=V,V.default=V,a.registerLanguage("scala",i("72R40")),a.registerLanguage("python",i("5QYYR")),a.registerLanguage("python-repl",i("lc7e8")),a.highlightAll()}();
//# sourceMappingURL=highlight.js.map