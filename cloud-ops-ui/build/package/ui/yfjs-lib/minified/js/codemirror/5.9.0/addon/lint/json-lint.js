!function(a){"object"==typeof exports&&"object"==typeof module?a(require("../../lib/codemirror")):"function"==typeof define&&define.amd?define(["../../lib/codemirror"],a):a(CodeMirror)}(function(a){"use strict";a.registerHelper("lint","json",function(b){var c=[];jsonlint.parseError=function(b,d){var e=d.loc;c.push({from:a.Pos(e.first_line-1,e.first_column),to:a.Pos(e.last_line-1,e.last_column),message:b})};try{jsonlint.parse(b)}catch(a){}return c})});