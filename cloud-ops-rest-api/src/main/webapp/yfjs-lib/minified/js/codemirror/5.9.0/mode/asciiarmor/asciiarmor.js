!function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";function b(a){var b=a.match(/^\s*\S/);return a.skipToEnd(),b?"error":null}a.defineMode("asciiarmor",function(){return{token:function(a,c){var d;if("top"==c.state)return a.sol()&&(d=a.match(/^-----BEGIN (.*)?-----\s*$/))?(c.state="headers",c.type=d[1],"tag"):b(a);if("headers"==c.state){if(a.sol()&&a.match(/^\w+:/))return c.state="header","atom";var e=b(a);return e&&(c.state="body"),e}return"header"==c.state?(a.skipToEnd(),c.state="headers","string"):"body"==c.state?a.sol()&&(d=a.match(/^-----END (.*)?-----\s*$/))?d[1]!=c.type?"error":(c.state="end","tag"):a.eatWhile(/[A-Za-z0-9+\/=]/)?null:(a.next(),"error"):"end"==c.state?b(a):void 0},blankLine:function(a){"headers"==a.state&&(a.state="body")},startState:function(){return{state:"top",type:null}}}}),a.defineMIME("application/pgp","asciiarmor"),a.defineMIME("application/pgp-keys","asciiarmor"),a.defineMIME("application/pgp-signature","asciiarmor")});