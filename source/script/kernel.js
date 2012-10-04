(function(toString,undef){var global=(function(){return this||(1,
eval)("this")})();
if(Object.defineProperty&&Object.defineProperties){var add=function(target,name,method){Object.defineProperty(target,name,{value:method,
configurable:true,
enumerable:false,
writeable:true})}}else{var add=function(target,name,method){target[name]=method}};
var cache={global:global};
var declareNamespace=function(name,object){var splits=name.split(".");
var current=global;
var length=splits.length-1;
var segment;
var i=0;
while(i<length){segment=splits[i++];
if(current[segment]==null){current=current[segment]={}}else{current=current[segment]}}return cache[name]=current[splits[i]]=object};
var toStringMap={};
var classes="Array Function RegExp Object Date Number String Boolean";
classes.replace(/\w+/g,function(cls){toStringMap[cls]="[object "+cls+"]"});
declareNamespace("core.Main.declareNamespace",declareNamespace);
core.Main.declareNamespace("core.Main",{declareNamespace:declareNamespace,
TYPES:(classes+" Null Native Map Integer Primitive").split(" "),
isTypeOf:function(value,type){var result=false;
if(value==null){result=type=="Null"}else if(type in toStringMap){result=toString.call(value)==toStringMap[type]}else if(type=="Map"){result=toString.call(value)==toStringMap.Object&&value.constructor===Object}else if(type=="Integer"){result=toString.call(value)==toStringMap.Number&&(~~value)==value}else if(type=="Primitive"){var type=typeof value;
result=value==null||type=="boolean"||type=="number"||type=="string"}return result},
clearNamespace:function(name){if(name in cache){delete cache[name];
var current=global;
var splitted=name.split(".");
for(var i=0,l=splitted.length-1;
i<l;
i++){current=current[splitted[i]]}try{delete current[splitted[i]]}catch(ex){current[splitted[i]]=undef}return true}return false},
resolveNamespace:function(name){var current=cache[name];
if(!current){current=global;
if(name){var splitted=name.split(".");
for(var i=0,l=splitted.length;
i<l;
i++){current=current[splitted[i]];
if(!current){current=null;
break}}}}return current},
addStatics:function(name,statics,keep){var object=global[name]||cache[name];
var prefix=name+".";
for(var staticName in statics){if(!keep||object[staticName]===undef){var item=statics[staticName];
if(item instanceof Function){item.displayName=prefix+name}add(object,staticName,item)}}},
addMembers:function(name,members,keep){var object=global[name]||cache[name];
var proto=object.prototype;
var prefix=name+".prototype.";
for(var memberName in members){if(!keep||proto[memberName]===undef){var item=members[memberName];
if(item instanceof Function){item.displayName=prefix+name}add(proto,memberName,item)}}}})})(Object.prototype.toString);


core.Main.addMembers("Function",{bind:function(context,varargs){if(typeof this!=="function"){throw new TypeError}var self=this;
var undef;
if(varargs!==undef){var extraargs=Array.prototype.slice.call(arguments,1);
return function(){return self.apply(context,arguments.length?extraargs.concat(Array.prototype.slice.call(arguments)):extraargs)}}else{return function(){return arguments.length?self.apply(context,arguments):self.call(context)}}}},true);


(function(doc){if(doc){var tags="abbr article aside audio canvas details figcaption figure footer header hgroup mark meter nav output progress section summary time video";
tags.replace(/\w+/g,function(tagName){doc.createElement(tagName)})}})(this.document);


core.Main.addStatics("Array",{isArray:function(value){return value!=null&&Object.prototype.toString.call(value)=="[object Array]"}},true);


(function(){var ws="[\t\n\u000b\f\r \u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029\ufeff]";
var trimBeginRegexp=new RegExp("^"+ws+ws+"*");
var trimEndRegexp=new RegExp(ws+ws+"*$");
core.Main.addMembers("String",{trim:function(){return(""+this).replace(trimBeginRegexp,"").replace(trimEndRegexp,"")},
trimLeft:function(){return(""+this).replace(trimBeginRegexp,"")},
trimRight:function(){return(""+this).replace(trimEndRegexp,"")}})})();


(function(global){var methods="log,debug,error,warn,info".split(",");
var console=global.console||(global.console={});
var log=console.log||new Function;
for(var i=0,l=methods.length;
i<l;
i++){var name=methods[i];
if(!console[name]){console[name]=log}}if(!console.assert){console.assert=function(expression){if(!expression){throw new Error(Array.prototype.slice.call(arguments,1).join(" "))}}}})(this);


(function(){var genericToString=function(){return"[module "+this.moduleName+"]"};
core.Main.declareNamespace("core.Module",function(name,members){if(!core.Module.isModuleName(name)){throw new Error("Invalid module name "+name+"!")}if(!core.Main.isTypeOf(members,"Map")){throw new Error("Invalid map as module configuration in "+name+"!")}var prefix=name+".";
var value;
for(var key in members){value=members[key];
if(value instanceof Function){value.displayName=prefix+key}}if(members.moduleName==null){members.moduleName=name}if(!members.hasOwnProperty("toString")){members.toString=genericToString}if(!members.hasOwnProperty("valueOf")){members.valueOf=genericToString}members.__isModule=true;
core.Main.declareNamespace(name,members)});
var getByName=function(name){var obj=core.Main.resolveNamespace(name);
return isModule(obj)?obj:null};
var isModuleName=function(name){return/^(([a-z][a-z0-9]*\.)*)([A-Z][a-zA-Z0-9]*)$/.test(name)};
var isModule=function(module){return!!(module&&typeof module=="object"&&module.__isModule)};
core.Main.addStatics("core.Module",{getByName:getByName,
isModuleName:isModuleName,
isModule:isModule})})();


(function(global){if(global.btoa){return}var characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var fromCharCode=String.fromCharCode;
var charAt="charAt";
var charCodeAt="charCodeAt";
var indexOf="indexOf";
core.Main.addStatics("global",{btoa:function(string){var i=0;
var len=string.length;
var result=[];
while(i<len){var a=string[charCodeAt](i++)||0;
var b=string[charCodeAt](i++)||0;
var c=string[charCodeAt](i++)||0;
var b1=(a>>2)&0x3F;
var b2=((a&0x3)<<4)|((b>>4)&0xF);
var b3=((b&0xF)<<2)|((c>>6)&0x3);
var b4=c&0x3F;
if(!b){b3=b4=64}else if(!c){b4=64}result.push(characters[charAt](b1),characters[charAt](b2),characters[charAt](b3),characters[charAt](b4))}return result.join("")},
atob:function(string){string=string.replace(/=+$/,"");
var len=string.length;
var i=0;
var chars=[];
while(i<len){var b1=characters[indexOf](string[charAt](i++));
var b2=characters[indexOf](string[charAt](i++));
var b3=characters[indexOf](string[charAt](i++));
var b4=characters[indexOf](string[charAt](i++));
var a=((b1&0x3F)<<2)|((b2>>4)&0x3);
var b=((b2&0xF)<<4)|((b3>>2)&0xF);
var c=((b3&0x3)<<6)|(b4&0x3F);
chars.push(fromCharCode(a));
b&&chars.push(fromCharCode(b));
c&&chars.push(fromCharCode(c))}return chars.join("")}},true)}(this));


(function(){var hexTable="0123456789abcdef".split("");
core.Main.addMembers("String",{encodeBase64:function(){return btoa(this)},
decodeBase64:function(){return atob(this)},
toHex:function(){var output="";
var code;
for(var i=0,l=this.length;
i<l;
i++){code=this.charCodeAt(i);
output+=hexTable[(code>>>4)&0x0F]+hexTable[code&0x0F]}return output},
encodeUtf8:function(){return unescape(encodeURIComponent(this))},
decodeUtf8:function(){return decodeURIComponent(escape(this))},
contains:function(substring){return this.indexOf(substring)!=-1},
isBlank:function(){return this.trim().length==0},
reverse:function(){return this.split("").reverse().join("")},
compact:function(){return this.replace(/[\r\n]/g," ").trim().replace(/([\s　])+/g,"$1")},
hyphenate:function(){return this.replace(/[A-Z]/g,"-$&").toLowerCase()},
camelize:function(){return this.replace(/\-+(\S)?/g,function(match,chr){return chr?chr.toUpperCase():""})},
repeat:function(nr){if(nr<1){return""}var pattern=this;
var result="";
while(nr>0){if(nr&1){result+=pattern}nr>>=1;
pattern+=pattern}return result},
startsWith:function(begin){return begin==this.slice(0,begin.length)},
endsWith:function(end){return end==this.slice(-end.length)}})})();


core.Module("core.crypt.Util",{rawStringToLittleEndian:function(input){var output=Array(input.length>>2);
for(var i=0;
i<output.length;
i++){output[i]=0}for(var i=0;
i<input.length*8;
i+=8){output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(i%32)}return output},
littleEndianToRawString:function(input){var output="";
for(var i=0;
i<input.length*32;
i+=8){output+=String.fromCharCode((input[i>>5]>>>(i%32))&0xFF)}return output},
rawStringToBigEndian:function(input){var output=Array(input.length>>2);
for(var i=0;
i<output.length;
i++){output[i]=0}for(var i=0;
i<input.length*8;
i+=8){output[i>>5]|=(input.charCodeAt(i/8)&0xFF)<<(24-i%32)}return output},
bigEndianToRawString:function(input){var output="";
for(var i=0;
i<input.length*32;
i+=8){output+=String.fromCharCode((input[i>>5]>>>(24-i%32))&0xFF)}return output}});


(function(Util){core.Module("core.crypt.SHA1",{checksum:function(str){str=str.encodeUtf8();
return Util.bigEndianToRawString(binb_sha1(Util.rawStringToBigEndian(str),str.length*8))},
hmac:function(key,str){key=key.encodeUtf8();
str=str.encodeUtf8();
var bkey=Util.rawStringToBigEndian(key);
if(bkey.length>16){bkey=binb_sha1(bkey,key.length*8)}var ipad=Array(16);
var opad=Array(16);
for(var i=0;
i<16;
i++){ipad[i]=bkey[i]^0x36363636;
opad[i]=bkey[i]^0x5C5C5C5C}var hash=binb_sha1(ipad.concat(Util.rawStringToBigEndian(str)),512+str.length*8);
return Util.bigEndianToRawString(binb_sha1(opad.concat(hash),512+160))}});
function binb_sha1(x,len){x[len>>5]|=0x80<<(24-len%32);
x[((len+64>>9)<<4)+15]=len;
var w=Array(80);
var a=1732584193;
var b=-271733879;
var c=-1732584194;
var d=271733878;
var e=-1009589776;
for(var i=0;
i<x.length;
i+=16){var olda=a;
var oldb=b;
var oldc=c;
var oldd=d;
var olde=e;
for(var j=0;
j<80;
j++){if(j<16){w[j]=x[i+j]}else{w[j]=bit_rol(w[j-3]^w[j-8]^w[j-14]^w[j-16],1)}var t=safe_add(safe_add(bit_rol(a,5),sha1_ft(j,b,c,d)),safe_add(safe_add(e,w[j]),sha1_kt(j)));
e=d;
d=c;
c=bit_rol(b,30);
b=a;
a=t}a=safe_add(a,olda);
b=safe_add(b,oldb);
c=safe_add(c,oldc);
d=safe_add(d,oldd);
e=safe_add(e,olde)}return Array(a,b,c,d,e)}function sha1_ft(t,b,c,d){if(t<20){return(b&c)|((~b)&d)}else if(t<40){return b^c^d}else if(t<60){return(b&c)|(b&d)|(c&d)}else{return b^c^d}}function sha1_kt(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514}function safe_add(x,y){var lsw=(x&0xFFFF)+(y&0xFFFF);
var msw=(x>>16)+(y>>16)+(lsw>>16);
return(msw<<16)|(lsw&0xFFFF)}function bit_rol(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}})(core.crypt.Util);


(function(undef){var selected={};
var contains=function(array,value){for(var i=0,l=array.length;
i<l;
i++){if(array[i]==value){return true}}};
core.Module("jasy.Env",{SELECTED:selected,
CHECKSUM:null,
define:function(name,value){selected[name]=value},
setFields:function(fields){var key=[];
for(var i=0,l=fields.length;
i<l;
i++){var entry=fields[i];
var name=entry[0];
var type=entry[1];
if(type==1||type==3){var test=entry[2];
var value="VALUE"in test?test.VALUE:test.get(name);
var third=entry[3];
if(type==1&&!contains(third,value)){value=third[0]}else if(type==3&&value==null){value=third}}else{value=entry[2]}selected[name]=value;
if(type!=3){key.push(name+":"+value)}}if(selected.debug){console.info("jasy.Env: "+key.join(", "))}this.CHECKSUM=core.crypt.SHA1.checksum(key.join(";")).toHex()},
isSet:function(name,value){if(value===undef){value=true}return selected[name]==value},
getValue:function(name){return selected[name]},
select:function(name,map){return map[selected[name]]}})})();


if(jasy.Env.isSet("engine","trident")){(function(global){var origTimeout=global.setTimeout;
var origInterval=global.setInterval;
var delegate=function(callback,args){args=Array.prototype.slice.call(args,2);
return function(){callback.apply(null,args)}};
core.Main.addStatics("global",{setTimeout:function(callback,delay){return origTimeout(delegate(callback,arguments),delay)},
setInterval:function(callback,delay){return origInterval(delegate(callback,arguments),delay)}})})(this)}

core.Main.addStatics("Date",{now:function(){return +new Date}},true);


(function(doc){if(doc&&!doc.head){doc.head=doc.getElementsByTagName("head")[0]}})(this.document);


core.Module("core.detect.ES5",{VALUE:!!(Array.prototype.map&&Date.prototype.toISOString&&this.JSON)});


core.Module("core.detect.Locale",{VALUE:(function(global){var nav=global.navigator||{};
var input=(nav.userLanguage||nav.language||"en").toLowerCase();
var split=input.indexOf("-");
return split>0?input.substring(0,split):input})(this)});


core.Module("core.detect.Param",{get:(function(){var items=location.search.substring(1).split("&");
var map={};
var translate={"true":true,
"false":false,
"null":null};
for(var i=0,l=items.length;
i<l;
i++){var item=items[i];
var pos=item.indexOf("=");
var name=pos==-1?item:item.substring(0,pos);
var value=pos==-1?true:item.substring(pos+1);
if(value in translate){value=translate[value]}else if(""+parseFloat(value,10)==value){value=parseFloat(value,10)}map[name]=value}items=translate=null;
return function(name){return name in map?map[name]:null}})()});


core.Module("core.detect.Engine",{VALUE:(function(global,toString){var engine;
var doc=global.document;
var nav=global.navigator;
doc&&doc.documentElement.style;
if(global.opera&&toString.call(global.opera)=="[object Opera]"){engine="presto"}else if(global.WebKitPoint&&toString.call(global.WebKitPoint)=="[object WebKitPoint]"){engine="webkit"}else if(global.controllers&&toString.call(global.controllers)=="[object XULControllers]"){engine="gecko"}else if(nav&&typeof nav.cpuClass==="string"){engine="trident"}else if(typeof window!="undefined"){engine="webkit"}else if(nav&&/(webkit)[ \/]([\w.]+)/.exec(nav.userAgent)){engine="webkit"}else if(nav&&/(mozilla)(?:.*? rv:([\w.]+))?/i.exec(nav.userAgent)){engine="gecko"}return engine})(this,Object.prototype.toString)});


(function(){function raise(message){throw new Error(message)}core.Module("core.Assert",{equal:function(a,b,message){if(a!=b){raise(message||"Values must be equal: "+a+" and "+b+"!")}},
notEqual:function(a,b,message){if(a==b){raise(message||"Values must not be equal: "+a+" and "+b+"!")}},
identical:function(a,b,message){if(a!==b){raise(message||"Values must be identical: "+a+" and "+b+"!")}},
notIdentical:function(a,b,message){if(a===b){raise(message||"Values must not be identical: "+a+" and "+b+"!")}},
isTrue:function(a,message){if(a!=true){raise(message||"Value must be true: "+a+"!")}},
isFalse:function(a,message){if(a!=false){raise(message||"Value must be false: "+a+"!")}},
isNull:function(a,message){if(a==null){raise(message||"Value "+a+" must be null!")}},
isNotNull:function(a,message){if(a==null){raise(message||"Value "+a+" must not be null!")}},
isIn:function(a,object,message){if(!(a in object||object.indexOf&&object.indexOf(a)!=-1)){raise(message||"Value "+a+" is not in given object!")}},
isNotIn:function(a,object,message){if(a in object||object.indexOf&&object.indexOf(a)!=-1){raise(message||"Value "+a+" must not be in given object!")}},
matches:function(a,regexp,message){if(!regexp.match(a)){raise(message||"Value "+a+" must match "+regexp)}},
notMatches:function(a,regexp,message){if(regexp.match(a)){raise(message||"Value "+a+" must not match "+regexp)}},
isType:function(a,type,message){if(!core.Main.isTypeOf(a,type)){raise(message||"Value "+a+" must match type: "+type)}},
isNotType:function(a,type,message){if(core.Main.isTypeOf(a,type)){raise(message||"Value "+a+" must not match type: "+type)}}})})();


(function(){var delegates={};
var profiles,assets,sprites;
var typeExpansion={i:"image",
a:"audio",
v:"video",
f:"font",
t:"text",
b:"binary",
o:"other"};
var resolve=function(id){if(id.constructor==Object){return id}{core.Assert.isType(id,"String")}var splits=id.split("/");
var current=assets;
for(var i=0,l=splits.length;
current&&i<l;
i++){current=current[splits[i]]}return current||null};
var entryToUri=function(entry,id){{core.Assert.isType(id,"String","Unknown asset ID: "+id);
core.Assert.isType(entry,"Map","Invalid entry: "+entry+" for asset ID: "+id);
core.Assert.isType(entry.p,"Integer","Invalid profile in entry: "+entry.p+"for asset "+id+". Do not now how to construct an URI for that entry!")}var profile=profiles[entry.p];
var delegate=delegates[profile.name];
if(delegate){var url=delegate(profile,id,entry)}else{var url=(profile.root||"")+(entry.u||id)}return url};
var mergeData=function(src,dst){for(var key in src){var srcValue=src[key];
var dstValue=dst[key];
if(dstValue==null){dst[key]=srcValue}else if(srcValue.constructor===Object&&dstValue.constructor===Object){mergeData(srcValue,dstValue)}}};
core.Module("jasy.Asset",{resolve:resolve,
entryToUri:entryToUri,
resolveSprite:function(spriteNumber,assetId){{core.Assert.isType(spriteNumber,"Number");
core.Assert.isType(assetId,"String")}var spriteId=sprites[spriteNumber];
if(spriteId.charAt(0)=="/"){spriteId=spriteId.slice(1)}else if(spriteId.indexOf("/")==-1){var pos=assetId.lastIndexOf("/");
if(pos!=-1){spriteId=assetId.slice(0,pos+1)+spriteId}}return spriteId},
addData:function(data){{core.Assert.isType(data,"Map","Asset data must be a map with the keys assets and profiles.");
core.Assert.isType(data.profiles,"Array","Asset data must have an array of profiles under the profiles key.");
core.Assert.isType(data.assets,"Map","Asset data must define a structure of assets under the assets keys.");
if("sprites"in data){core.Assert.isType(data.sprites,"Array","Sprite data inside assets must be delivered as an Array.")}}if(!profiles){profiles=data.profiles;
assets=data.assets;
sprites=data.sprites}else{mergeData(data.assets,assets)}},
resetData:function(){profiles=assets=sprites=null},
registerDelegate:function(profile,delegate){{core.Assert.isType(profile,"String");
core.Assert.isType(delegate,"Function")}delegates[profile]=delegate},
has:function(id){{core.Assert.isType(id,"String")}return!!(resolve(id))},
getType:function(id){{core.Assert.isType(id,"String","Invalid asset ID (no string): "+id+"!")}var entry=resolve(id);
if(true&&!entry){throw new Error("Could not figure out size of unknown image: "+id)}return typeExpansion[entry.t]||"other"},
toUri:function(id){{core.Assert.isType(id,"String")}var resolved=resolve(id);
{core.Assert.isNotNull(resolved,"Failed to resolve asset ID: "+id)}return entryToUri(resolved,id)}})})(this);


(function(){var translations={};
core.Module("jasy.Translate",{addData:function(data){for(var id in data){translations[id]=data[id]}},
getEntry:function(basic,plural,context){var id=basic;
if(context!=null){id+="[C:"+context+"]"}else if(plural!=null){id+="[N:"+plural+"]"}return translations[id]}})})(this);


(function(global){var doc=global.document;
var supportsScriptAsync=doc.createElement("script").async===true;
var dynamicExtension="?r="+Date.now();
var assignCallback=function(elem,value){elem.onload=elem.onerror=elem.onreadystatechange=value};
core.Module("core.io.Script",{SUPPORTS_PARALLEL:supportsScriptAsync||jasy.Env.isSet("engine","gecko")||jasy.Env.isSet("engine","opera"),
load:function(uri,callback,context,nocache){{core.Assert.isType(uri,"String");
if(callback!=null){core.Assert.isType(callback,"Function","Invalid callback method!")}if(context!=null){core.Assert.isType(context,"Object","Invalid callback context!")}if(nocache!=null){core.Assert.isType(nocache,"Boolean")}}if(true&&nocache==null){nocache=true}var head=doc.head;
var elem=doc.createElement("script");
assignCallback(elem,function(e){var errornous=(e||global.event).type==="error";
if(errornous){console.warn("Could not load script: "+uri)}else{var readyState=elem.readyState;
if(readyState&&readyState!=="complete"&&readyState!=="loaded"){return}}assignCallback(elem,null);
if(callback){callback.call(context||global,uri,errornous)}});
elem.src=nocache?uri+dynamicExtension:uri;
if(supportsScriptAsync){elem.async=false}head.insertBefore(elem,head.firstChild)}})})(this);


(function(){var extractExtension=function(filename){var result=filename.match(/\.([^\.\?]+)(?:\?|$)/);
if(result!=null){return result[1]}if(filename.indexOf("callback=")!=-1){return"jsonp"}return null};
core.Module("core.io.Queue",{load:function(uris,callback,context,nocache,type){{core.Assert.isType(uris,"Array");
if(callback!=null){core.Assert.isType(callback,"Function","Invalid callback method!")}if(context!=null){core.Assert.isType(context,"Object","Invalid callback context!")}if(nocache!=null){core.Assert.isType(nocache,"Boolean")}if(type!=null){core.Assert.isType(type,"String")}}var loading={};
var cache={};
var typeLoader={js:core.io.Script,
css:core.io.StyleSheet,
jsonp:core.io.Jsonp,
json:core.io.Text,
txt:core.io.Text,
md:core.io.Text,
html:core.io.Text,
png:core.io.Image,
jpeg:core.io.Image,
jpg:core.io.Image,
gif:core.io.Image};
var onLoad=function(uri,errornous,data){{core.Assert.isType(uri,"String","Got invalid URI from loader!");
if(errornous!=null){core.Assert.isType(errornous,"Boolean","Got invalid errornous flag from loader for uri: "+uri)}}delete loading[uri];
if(data!=null){cache[uri]=data}for(var queued in loading){return}if(callback){context?callback.call(context,cache):callback(cache)}};
var executeDirectly=!!callback;
var autoType=!type;
var sequential={};
for(var i=0,l=uris.length;
i<l;
i++){var currentUri=uris[i];
if(autoType){type=extractExtension(currentUri);
if(true&&(!type||!typeLoader[type])){throw new Error("Could not figure out loader to use for URI: "+currentUri)}}var loader=typeLoader[type];
executeDirectly=false;
if(!loading[currentUri]){loading[currentUri]=true;
if(loader.SUPPORTS_PARALLEL){loader.load(currentUri,onLoad,null,nocache)}else{if(sequential[type]){sequential[type].push(currentUri)}else{sequential[type]=[currentUri]}}}}if(executeDirectly){context?callback.call(context,cache):callback(cache)}else{var loadNext=function(type){var uri=sequential[type].shift();
if(uri){typeLoader[type].load(uri,function(uri,errornous,data){onLoad(uri,errornous,data);
loadNext(type)},null,nocache)}};
for(var type in sequential){loadNext(type)}}}})})();


(function(){jasy.Env.setFields([['debug', 3, core.detect.Param, false], ['engine', 3, core.detect.Engine], ['es5', 3, core.detect.ES5, false], ['locale', 3, core.detect.Locale, "en"]]);})();