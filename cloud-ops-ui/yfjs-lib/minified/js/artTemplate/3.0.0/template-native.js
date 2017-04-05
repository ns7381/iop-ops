!function(){function a(a){return a.replace(t,"").replace(u,",").replace(v,"").replace(w,"").replace(x,"").split(y)}function b(a){return"'"+a.replace(/('|\\)/g,"\\$1").replace(/\r/g,"\\r").replace(/\n/g,"\\n")+"'"}function c(c,d){function e(a){return q+=a.split(/\n/).length-1,k&&(a=a.replace(/\s+/g," ").replace(/<!--[\w\W]*?-->/g,"")),a&&(a=u[1]+b(a)+u[2]+"\n"),a}function f(b){var c=q;if(j?b=j(b,d):g&&(b=b.replace(/\n/g,function(){return q++,"$line="+q+";"})),0===b.indexOf("=")){var e=m&&!/^=[=#]/.test(b)&&p(b);if(b=b.replace(/^=[=#]?|[\s;]*$/g,""),e){var f=b.replace(/\s*\([^\)]+\)/,"");n[f]||/^(include|print)$/.test(f)||(b="$escape("+b+")")}else b="$string("+b+")";b=u[1]+b+u[2]}return g&&(b="$line="+c+";"+b),r(a(b),function(a){if(a&&!s[a]){var b;b="print"===a?w:"include"===a?x:n[a]?"$utils."+a:o[a]?"$helpers."+a:"$data."+a,y+=a+"="+b+",",s[a]=!0}}),b+"\n"}var g=d.debug,h=d.openTag,i=d.closeTag,j=d.parser,k=d.compress,m=d.escape,p=function(a){if(!a)return!1;a=a.replace(/^=/,"");var b=function(b){if(b){if("string"==typeof b)return a===escapeIgnore;if(b instanceof RegExp)return b.test(a)}return!1};if(l(escapeIgnore)){for(var c=0;c<escapeIgnore.length;c++)if(b(escapeIgnore[c]))return!1;return!0}return!b(escapeIgnore)},q=1,s={$data:1,$filename:1,$utils:1,$helpers:1,$out:1,$line:1},t="".trim,u=t?["$out='';","$out+=",";","$out"]:["$out=[];","$out.push(",");","$out.join('')"],v=t?"$out+=text;return $out;":"$out.push(text);",w="function(){var text=''.concat.apply('',arguments);"+v+"}",x="function(filename,data){data=data||$data;var text=$utils.$include(filename,data,$filename);"+v+"}",y="'use strict';var $utils=this,$helpers=$utils.$helpers,"+(g?"$line=0,":""),z=u[0],A="return new String("+u[3]+");";r(c.split(h),function(a){a=a.split(i);var b=a[0],c=a[1];1===a.length?z+=e(b):(z+=f(b),c&&(z+=e(c)))});var B=y+z+A;g&&(B="try{"+B+"}catch(e){throw {filename:$filename,name:'Render Error',message:e.message,line:$line,source:"+b(c)+".split(/\\n/)[$line-1].replace(/^\\s+/,'')};}");try{var C=new Function("$data","$filename",B);return C.prototype=n,C}catch(a){throw a.temp="function anonymous($data,$filename) {"+B+"}",a}}var d=function(a,b){return"string"==typeof b?q(b,{filename:a}):g(a,b)};d.version="3.0.0",d.config=function(a,b){e[a]=b};var e=d.defaults={openTag:"<%",closeTag:"%>",escape:!0,escapeIgnore:null,cache:!0,compress:!1,parser:null},f=d.cache={};d.render=function(a,b){return q(a,b)};var g=d.renderFile=function(a,b){var c=d.get(a)||p({filename:a,name:"Render Error",message:"Template not found"});return b?c(b):c};d.get=function(a){var b;if(f[a])b=f[a];else if("object"==typeof document){var c=document.getElementById(a);if(c){var d=(c.value||c.innerHTML).replace(/^\s*|\s*$/g,"");b=q(d,{filename:a})}}return b};var h=function(a,b){return"string"!=typeof a&&(b=typeof a,"number"===b?a+="":a="function"===b?h(a.call(a)):""),a},i={"<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","&":"&#38;"},j=function(a){return i[a]},k=function(a){return h(a).replace(/&(?![\w#]+;)|[<>"']/g,j)},l=Array.isArray||function(a){return"[object Array]"==={}.toString.call(a)},m=function(a,b){var c,d;if(l(a))for(c=0,d=a.length;c<d;c++)b.call(a,a[c],c,a);else for(c in a)b.call(a,a[c],c)},n=d.utils={$helpers:{},$include:g,$string:h,$escape:k,$each:m};d.helper=function(a,b){o[a]=b};var o=d.helpers=n.$helpers;d.onerror=function(a){var b="Template Error\n\n";for(var c in a)b+="<"+c+">\n"+a[c]+"\n\n";"object"==typeof console&&console.error(b)};var p=function(a){return d.onerror(a),function(){return"{Template Error}"}},q=d.compile=function(a,b){function d(c){try{return new i(c,h)+""}catch(d){return b.debug?p(d)():(b.debug=!0,q(a,b)(c))}}b=b||{};for(var g in e)void 0===b[g]&&(b[g]=e[g]);var h=b.filename;try{var i=c(a,b)}catch(a){return a.filename=h||"anonymous",a.name="Syntax Error",p(a)}return d.prototype=i.prototype,d.toString=function(){return i.toString()},h&&b.cache&&(f[h]=d),d},r=n.$each,s="break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if,in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with,abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto,implements,import,int,interface,long,native,package,private,protected,public,short,static,super,synchronized,throws,transient,volatile,arguments,let,yield,undefined",t=/\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g,u=/[^\w$]+/g,v=new RegExp(["\\b"+s.replace(/,/g,"\\b|\\b")+"\\b"].join("|"),"g"),w=/^\d[^,]*|,\d[^,]*/g,x=/^,+|,+$/g,y=/^$|,+/;"function"==typeof define?define(function(){return d}):"undefined"!=typeof exports?module.exports=d:this.template=d}();