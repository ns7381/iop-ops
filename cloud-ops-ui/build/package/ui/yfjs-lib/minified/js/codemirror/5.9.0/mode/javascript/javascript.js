!function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.defineMode("javascript",function(b,c){function d(a){for(var b,c=!1,d=!1;null!=(b=a.next());){if(!c){if("/"==b&&!d)return;"["==b?d=!0:d&&"]"==b&&(d=!1)}c=!c&&"\\"==b}}function e(a,b,c){return ta=a,ua=c,b}function f(a,b){var c=a.next();if('"'==c||"'"==c)return b.tokenize=g(c),b.tokenize(a,b);if("."==c&&a.match(/^\d+(?:[eE][+\-]?\d+)?/))return e("number","number");if("."==c&&a.match(".."))return e("spread","meta");if(/[\[\]{}\(\),;\:\.]/.test(c))return e(c);if("="==c&&a.eat(">"))return e("=>","operator");if("0"==c&&a.eat(/x/i))return a.eatWhile(/[\da-f]/i),e("number","number");if("0"==c&&a.eat(/o/i))return a.eatWhile(/[0-7]/i),e("number","number");if("0"==c&&a.eat(/b/i))return a.eatWhile(/[01]/i),e("number","number");if(/\d/.test(c))return a.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/),e("number","number");if("/"==c)return a.eat("*")?(b.tokenize=h,h(a,b)):a.eat("/")?(a.skipToEnd(),e("comment","comment")):/^(?:operator|sof|keyword c|case|new|[\[{}\(,;:])$/.test(b.lastType)?(d(a),a.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/),e("regexp","string-2")):(a.eatWhile(Ca),e("operator","operator",a.current()));if("`"==c)return b.tokenize=i,i(a,b);if("#"==c)return a.skipToEnd(),e("error","error");if(Ca.test(c))return a.eatWhile(Ca),e("operator","operator",a.current());if(Aa.test(c)){a.eatWhile(Aa);var f=a.current(),j=Ba.propertyIsEnumerable(f)&&Ba[f];return j&&"."!=b.lastType?e(j.type,j.style,f):e("variable","variable",f)}}function g(a){return function(b,c){var d,g=!1;if(xa&&"@"==b.peek()&&b.match(Da))return c.tokenize=f,e("jsonld-keyword","meta");for(;null!=(d=b.next())&&(d!=a||g);)g=!g&&"\\"==d;return g||(c.tokenize=f),e("string","string")}}function h(a,b){for(var c,d=!1;c=a.next();){if("/"==c&&d){b.tokenize=f;break}d="*"==c}return e("comment","comment")}function i(a,b){for(var c,d=!1;null!=(c=a.next());){if(!d&&("`"==c||"$"==c&&a.eat("{"))){b.tokenize=f;break}d=!d&&"\\"==c}return e("quasi","string-2",a.current())}function j(a,b){b.fatArrowAt&&(b.fatArrowAt=null);var c=a.string.indexOf("=>",a.start);if(!(c<0)){for(var d=0,e=!1,f=c-1;f>=0;--f){var g=a.string.charAt(f),h=Ea.indexOf(g);if(h>=0&&h<3){if(!d){++f;break}if(0==--d)break}else if(h>=3&&h<6)++d;else if(Aa.test(g))e=!0;else{if(/["'\/]/.test(g))return;if(e&&!d){++f;break}}}e&&!d&&(b.fatArrowAt=f)}}function k(a,b,c,d,e,f){this.indented=a,this.column=b,this.type=c,this.prev=e,this.info=f,null!=d&&(this.align=d)}function l(a,b){for(var c=a.localVars;c;c=c.next)if(c.name==b)return!0;for(var d=a.context;d;d=d.prev)for(var c=d.vars;c;c=c.next)if(c.name==b)return!0}function m(a,b,c,d,e){var f=a.cc;for(Ga.state=a,Ga.stream=e,Ga.marked=null,Ga.cc=f,Ga.style=b,a.lexical.hasOwnProperty("align")||(a.lexical.align=!0);;){var g=f.length?f.pop():ya?w:v;if(g(c,d)){for(;f.length&&f[f.length-1].lex;)f.pop()();return Ga.marked?Ga.marked:"variable"==c&&l(a,d)?"variable-2":b}}}function n(){for(var a=arguments.length-1;a>=0;a--)Ga.cc.push(arguments[a])}function o(){return n.apply(null,arguments),!0}function p(a){function b(b){for(var c=b;c;c=c.next)if(c.name==a)return!0;return!1}var d=Ga.state;if(Ga.marked="def",d.context){if(b(d.localVars))return;d.localVars={name:a,next:d.localVars}}else{if(b(d.globalVars))return;c.globalVars&&(d.globalVars={name:a,next:d.globalVars})}}function q(){Ga.state.context={prev:Ga.state.context,vars:Ga.state.localVars},Ga.state.localVars=Ha}function r(){Ga.state.localVars=Ga.state.context.vars,Ga.state.context=Ga.state.context.prev}function s(a,b){var c=function(){var c=Ga.state,d=c.indented;if("stat"==c.lexical.type)d=c.lexical.indented;else for(var e=c.lexical;e&&")"==e.type&&e.align;e=e.prev)d=e.indented;c.lexical=new k(d,Ga.stream.column(),a,null,c.lexical,b)};return c.lex=!0,c}function t(){var a=Ga.state;a.lexical.prev&&(")"==a.lexical.type&&(a.indented=a.lexical.indented),a.lexical=a.lexical.prev)}function u(a){function b(c){return c==a?o():";"==a?n():o(b)}return b}function v(a,b){return"var"==a?o(s("vardef",b.length),V,u(";"),t):"keyword a"==a?o(s("form"),w,v,t):"keyword b"==a?o(s("form"),v,t):"{"==a?o(s("}"),R,t):";"==a?o():"if"==a?("else"==Ga.state.lexical.info&&Ga.state.cc[Ga.state.cc.length-1]==t&&Ga.state.cc.pop()(),o(s("form"),w,v,t,$)):"function"==a?o(ea):"for"==a?o(s("form"),_,v,t):"variable"==a?o(s("stat"),K):"switch"==a?o(s("form"),w,s("}","switch"),u("{"),R,t,t):"case"==a?o(w,u(":")):"default"==a?o(u(":")):"catch"==a?o(s("form"),q,u("("),fa,u(")"),v,t,r):"class"==a?o(s("form"),ga,t):"export"==a?o(s("stat"),ka,t):"import"==a?o(s("stat"),la,t):n(s("stat"),w,u(";"),t)}function w(a){return y(a,!1)}function x(a){return y(a,!0)}function y(a,b){if(Ga.state.fatArrowAt==Ga.stream.start){var c=b?G:F;if("("==a)return o(q,s(")"),P(W,")"),t,u("=>"),c,r);if("variable"==a)return n(q,W,u("=>"),c,r)}var d=b?C:B;return Fa.hasOwnProperty(a)?o(d):"function"==a?o(ea,d):"keyword c"==a?o(b?A:z):"("==a?o(s(")"),z,ra,u(")"),t,d):"operator"==a||"spread"==a?o(b?x:w):"["==a?o(s("]"),pa,t,d):"{"==a?Q(M,"}",null,d):"quasi"==a?n(D,d):"new"==a?o(H(b)):o()}function z(a){return a.match(/[;\}\)\],]/)?n():n(w)}function A(a){return a.match(/[;\}\)\],]/)?n():n(x)}function B(a,b){return","==a?o(w):C(a,b,!1)}function C(a,b,c){var d=0==c?B:C,e=0==c?w:x;return"=>"==a?o(q,c?G:F,r):"operator"==a?/\+\+|--/.test(b)?o(d):"?"==b?o(w,u(":"),e):o(e):"quasi"==a?n(D,d):";"!=a?"("==a?Q(x,")","call",d):"."==a?o(L,d):"["==a?o(s("]"),z,u("]"),t,d):void 0:void 0}function D(a,b){return"quasi"!=a?n():"${"!=b.slice(b.length-2)?o(D):o(w,E)}function E(a){if("}"==a)return Ga.marked="string-2",Ga.state.tokenize=i,o(D)}function F(a){return j(Ga.stream,Ga.state),n("{"==a?v:w)}function G(a){return j(Ga.stream,Ga.state),n("{"==a?v:x)}function H(a){return function(b){return"."==b?o(a?J:I):n(a?x:w)}}function I(a,b){if("target"==b)return Ga.marked="keyword",o(B)}function J(a,b){if("target"==b)return Ga.marked="keyword",o(C)}function K(a){return":"==a?o(t,v):n(B,u(";"),t)}function L(a){if("variable"==a)return Ga.marked="property",o()}function M(a,b){return"variable"==a||"keyword"==Ga.style?(Ga.marked="property",o("get"==b||"set"==b?N:O)):"number"==a||"string"==a?(Ga.marked=xa?"property":Ga.style+" property",o(O)):"jsonld-keyword"==a?o(O):"["==a?o(w,u("]"),O):"spread"==a?o(w):void 0}function N(a){return"variable"!=a?n(O):(Ga.marked="property",o(ea))}function O(a){return":"==a?o(x):"("==a?n(ea):void 0}function P(a,b){function c(d){if(","==d){var e=Ga.state.lexical;return"call"==e.info&&(e.pos=(e.pos||0)+1),o(a,c)}return d==b?o():o(u(b))}return function(d){return d==b?o():n(a,c)}}function Q(a,b,c){for(var d=3;d<arguments.length;d++)Ga.cc.push(arguments[d]);return o(s(b,c),P(a,b),t)}function R(a){return"}"==a?o():n(v,R)}function S(a){if(za&&":"==a)return o(U)}function T(a,b){if("="==b)return o(x)}function U(a){if("variable"==a)return Ga.marked="variable-3",o()}function V(){return n(W,S,Y,Z)}function W(a,b){return"variable"==a?(p(b),o()):"spread"==a?o(W):"["==a?Q(W,"]"):"{"==a?Q(X,"}"):void 0}function X(a,b){return"variable"!=a||Ga.stream.match(/^\s*:/,!1)?("variable"==a&&(Ga.marked="property"),"spread"==a?o(W):o(u(":"),W,Y)):(p(b),o(Y))}function Y(a,b){if("="==b)return o(x)}function Z(a){if(","==a)return o(V)}function $(a,b){if("keyword b"==a&&"else"==b)return o(s("form","else"),v,t)}function _(a){if("("==a)return o(s(")"),aa,u(")"),t)}function aa(a){return"var"==a?o(V,u(";"),ca):";"==a?o(ca):"variable"==a?o(ba):n(w,u(";"),ca)}function ba(a,b){return"in"==b||"of"==b?(Ga.marked="keyword",o(w)):o(B,ca)}function ca(a,b){return";"==a?o(da):"in"==b||"of"==b?(Ga.marked="keyword",o(w)):n(w,u(";"),da)}function da(a){")"!=a&&o(w)}function ea(a,b){return"*"==b?(Ga.marked="keyword",o(ea)):"variable"==a?(p(b),o(ea)):"("==a?o(q,s(")"),P(fa,")"),t,v,r):void 0}function fa(a){return"spread"==a?o(fa):n(W,S,T)}function ga(a,b){if("variable"==a)return p(b),o(ha)}function ha(a,b){return"extends"==b?o(w,ha):"{"==a?o(s("}"),ia,t):void 0}function ia(a,b){return"variable"==a||"keyword"==Ga.style?"static"==b?(Ga.marked="keyword",o(ia)):(Ga.marked="property","get"==b||"set"==b?o(ja,ea,ia):o(ea,ia)):"*"==b?(Ga.marked="keyword",o(ia)):";"==a?o(ia):"}"==a?o():void 0}function ja(a){return"variable"!=a?n():(Ga.marked="property",o())}function ka(a,b){return"*"==b?(Ga.marked="keyword",o(oa,u(";"))):"default"==b?(Ga.marked="keyword",o(w,u(";"))):n(v)}function la(a){return"string"==a?o():n(ma,oa)}function ma(a,b){return"{"==a?Q(ma,"}"):("variable"==a&&p(b),"*"==b&&(Ga.marked="keyword"),o(na))}function na(a,b){if("as"==b)return Ga.marked="keyword",o(ma)}function oa(a,b){if("from"==b)return Ga.marked="keyword",o(w)}function pa(a){return"]"==a?o():n(x,qa)}function qa(a){return"for"==a?n(ra,u("]")):","==a?o(P(A,"]")):n(P(x,"]"))}function ra(a){return"for"==a?o(_,ra):"if"==a?o(w,ra):void 0}function sa(a,b){return"operator"==a.lastType||","==a.lastType||Ca.test(b.charAt(0))||/[,.]/.test(b.charAt(0))}var ta,ua,va=b.indentUnit,wa=c.statementIndent,xa=c.jsonld,ya=c.json||xa,za=c.typescript,Aa=c.wordCharacters||/[\w$\xa1-\uffff]/,Ba=function(){function a(a){return{type:a,style:"keyword"}}var b=a("keyword a"),c=a("keyword b"),d=a("keyword c"),e=a("operator"),f={type:"atom",style:"atom"},g={if:a("if"),while:b,with:b,else:c,do:c,try:c,finally:c,return:d,break:d,continue:d,new:a("new"),delete:d,throw:d,debugger:d,var:a("var"),const:a("var"),let:a("var"),function:a("function"),catch:a("catch"),for:a("for"),switch:a("switch"),case:a("case"),default:a("default"),in:e,typeof:e,instanceof:e,true:f,false:f,null:f,undefined:f,NaN:f,Infinity:f,this:a("this"),class:a("class"),super:a("atom"),yield:d,export:a("export"),import:a("import"),extends:d};if(za){var h={type:"variable",style:"variable-3"},i={interface:a("interface"),extends:a("extends"),constructor:a("constructor"),public:a("public"),private:a("private"),protected:a("protected"),static:a("static"),string:h,number:h,boolean:h,any:h};for(var j in i)g[j]=i[j]}return g}(),Ca=/[+\-*&%=<>!?|~^]/,Da=/^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/,Ea="([{}])",Fa={atom:!0,number:!0,variable:!0,string:!0,regexp:!0,this:!0,"jsonld-keyword":!0},Ga={state:null,column:null,marked:null,cc:null},Ha={name:"this",next:{name:"arguments"}};return t.lex=!0,{startState:function(a){var b={tokenize:f,lastType:"sof",cc:[],lexical:new k((a||0)-va,0,"block",!1),localVars:c.localVars,context:c.localVars&&{vars:c.localVars},indented:0};return c.globalVars&&"object"==typeof c.globalVars&&(b.globalVars=c.globalVars),b},token:function(a,b){if(a.sol()&&(b.lexical.hasOwnProperty("align")||(b.lexical.align=!1),b.indented=a.indentation(),j(a,b)),b.tokenize!=h&&a.eatSpace())return null;var c=b.tokenize(a,b);return"comment"==ta?c:(b.lastType="operator"!=ta||"++"!=ua&&"--"!=ua?ta:"incdec",m(b,c,ta,ua,a))},indent:function(b,d){if(b.tokenize==h)return a.Pass;if(b.tokenize!=f)return 0;var e=d&&d.charAt(0),g=b.lexical;if(!/^\s*else\b/.test(d))for(var i=b.cc.length-1;i>=0;--i){var j=b.cc[i];if(j==t)g=g.prev;else if(j!=$)break}"stat"==g.type&&"}"==e&&(g=g.prev),wa&&")"==g.type&&"stat"==g.prev.type&&(g=g.prev);var k=g.type,l=e==k;return"vardef"==k?g.indented+("operator"==b.lastType||","==b.lastType?g.info+1:0):"form"==k&&"{"==e?g.indented:"form"==k?g.indented+va:"stat"==k?g.indented+(sa(b,d)?wa||va:0):"switch"!=g.info||l||0==c.doubleIndentSwitch?g.align?g.column+(l?0:1):g.indented+(l?0:va):g.indented+(/^(?:case|default)\b/.test(d)?va:2*va)},electricInput:/^\s*(?:case .*?:|default:|\{|\})$/,blockCommentStart:ya?null:"/*",blockCommentEnd:ya?null:"*/",lineComment:ya?null:"//",fold:"brace",closeBrackets:"()[]{}''\"\"``",helperType:ya?"json":"javascript",jsonldMode:xa,jsonMode:ya}}),a.registerHelper("wordChars","javascript",/[\w$]/),a.defineMIME("text/javascript","javascript"),a.defineMIME("text/ecmascript","javascript"),a.defineMIME("application/javascript","javascript"),a.defineMIME("application/x-javascript","javascript"),a.defineMIME("application/ecmascript","javascript"),a.defineMIME("application/json",{name:"javascript",json:!0}),a.defineMIME("application/x-json",{name:"javascript",json:!0}),a.defineMIME("application/ld+json",{name:"javascript",jsonld:!0}),a.defineMIME("text/typescript",{name:"javascript",typescript:!0}),a.defineMIME("application/typescript",{name:"javascript",typescript:!0})});