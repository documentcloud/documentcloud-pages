(function(){var e=window.Penny=window.Penny||{VERSION:"0.0.0",on:function(a,b,c){a.addEventListener?a.addEventListener(b,c):a.attachEvent("on"+b,function(){c.call(a)})},ready:function(a){"loading"!=document.readyState?a():document.addEventListener?document.addEventListener("DOMContentLoaded",a):document.attachEvent("onreadystatechange",function(){"loading"!=document.readyState&&a()})},each:function(a,b){if(null==a||"object"!==typeof a||e.isArrayLike(a))for(var c=0,g=a.length;c<g;c++)b(a[c],c);else for(c in a)e.has(a,
c)&&b(a[c],c)},has:function(a,b){return null!=a&&Object.prototype.hasOwnProperty.call(a,b)},values:function(a){var b=[],c;for(c in a)e.has(a,c)&&b.push(a[c]);return b},keys:function(a){var b=[],c;for(c in a)e.has(a,c)&&b.push(a[c]);return b},findKey:function(a,b){for(var c in a)if(e.has(a,c)&&b(a[c],c))return c;return null},extend:function(a){a=a||{};for(var b=1,c=arguments.length;b<c;b++)if(arguments[b])for(var g in arguments[b])arguments[b].hasOwnProperty(g)&&(a[g]=arguments[b][g]);return a},isString:function(a){return"string"===
typeof a},isElement:function(a){return!(!a||1!==a.nodeType)},isArrayLike:function(a){var b=Math.pow(2,53)-1;a=function(c){return function(a){return null==a?void 0:a[c]}}("length")(a);return"number"==typeof a&&0<=a&&a<=b},isEmpty:function(a){if(null==a)return!0;if(0<a.length)return!1;if(0===a.length)return!0;for(var b in a)if(e.has(a,b))return!1;return!0}}})();
(function(){window.console||(window.console={log:function(){},info:function(){},warn:function(){},error:function(){}});var e=window.DocumentCloud||{},a=window.Penny;if(e._)var b=e._;else if(a)b=a;else return console.error("DocumentCloud embed can't load because of missing components."),!1;window.DCEmbedToolbelt=window.DCEmbedToolbelt||{unicodeLetter:"A-Za-z\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0-\u08b4\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005\u3006\u3031-\u3035\u303b\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fd5\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6e5\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ad\ua7b0-\ua7b7\ua7f7-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab65\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc",
unicodeNumber:"0-9\u00b2\u00b3\u00b9\u00bc-\u00be\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u09f4-\u09f9\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0b72-\u0b77\u0be6-\u0bf2\u0c66-\u0c6f\u0c78-\u0c7e\u0ce6-\u0cef\u0d66-\u0d75\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f33\u1040-\u1049\u1090-\u1099\u1369-\u137c\u16ee-\u16f0\u17e0-\u17e9\u17f0-\u17f9\u1810-\u1819\u1946-\u194f\u19d0-\u19da\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249b\u24ea-\u24ff\u2776-\u2793\u2cfd\u3007\u3021-\u3029\u3038-\u303a\u3192-\u3195\u3220-\u3229\u3248-\u324f\u3251-\u325f\u3280-\u3289\u32b1-\u32bf\ua620-\ua629\ua6e6-\ua6ef\ua830-\ua835\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19",
isResource:function(c){return!!b.has(c,"resourceType")},recognizeResource:function(c){if(this.isResource(c))return c;var a={production:"www.documentcloud.org",staging:"staging.documentcloud.org",development:"dev.dcloud.org"},d="("+b.values(a).join("|")+")/documents/([0-9]+)-(["+(this.unicodeLetter+this.unicodeNumber+"%-")+"]+)",h=function(c){var a;switch(c.resourceType){case "document":a=[c.domain,"documents",c.documentSlug];break;case "page":a=[c.domain,"documents",c.documentSlug];break;case "note":a=
[c.domain,"documents",c.documentSlug,"annotations",c.noteId]}return"//"+a.join("/")+".json"},f={};b.each({document:[d+".(?:html|js|json)$"],page:[d+".html#document/p([0-9]+)$",d+"/pages/([0-9]+).(?:html|js|json)$"],note:[d+"/annotations/([0-9]+).(?:html|js|json)$",d+".html#document/p[0-9]+/a([0-9]+)$",d+".html#annotation/a([0-9]+)$"]},function(d,e){b.isEmpty(f)&&b.each(d,function(d){if(b.isEmpty(f)&&(d=c.match(d))){f={resourceUrl:c,resourceType:e,environment:b.findKey(a,function(a,d){return c.match(a)}),
domain:d[1],documentId:d[2],documentSlug:d[2]+"-"+d[3]};switch(e){case "document":f.trackingId=f.documentId;break;case "page":f.pageNumber=d[4];f.trackingId=f.documentId+"p"+f.pageNumber;f.embedOptions={page:f.pageNumber};break;case "note":f.trackingId=f.noteId=d[4]}f.dataUrl=h(f)}})});return f},toDomElement:function(c){return b.isElement(c)?c:b.isString(c)?document.querySelector(c):c instanceof jQuery&&b.isElement(c[0])?c[0]:null},generateUniqueElementId:function(c){var a=1,d="DC-"+c.documentSlug;
switch(c.resourceType){case "document":d+="-i"+a;break;case "page":d+="-p"+c.pageNumber+"-i"+a;break;case "note":d+="-a"+c.noteId+"-i"+a}for(;document.getElementById(d);)d=d.replace(/-i[0-9]+$/,"-i"+a++);return d},isIframed:function(){try{return window.self!==window.top}catch(a){return!0}},getSourceUrl:function(){var a,b;this.isIframed()?(a=document.createElement("A"),a.href=document.referrer):a=window.location;b=a.protocol+"//"+a.host;0!==a.pathname.indexOf("/")&&(b+="/");b+=a.pathname;return b=
b.replace(/[\/]+$/,"")},pixelPing:function(a,b){a=this.recognizeResource(a);b=this.toDomElement(b);var d="//"+a.domain+"/pixel.gif",h=this.getSourceUrl(),h=encodeURIComponent(a.resourceType+":"+a.trackingId+":"+h);b.insertAdjacentHTML("afterend",'<img src="'+d+"?key="+h+'" width="1" height="1" class="DC-embed-pixel-ping" alt="Anonymous hit counter for DocumentCloud">')}}})();
(function(){Penny.ready(function(){if(window.DCEmbedToolbelt){var e=function(a,c){if(!document.querySelector('script[src$="'+a+'"]')){var b=document.createElement("script");b.src=a;b.async=!0;Penny.on(b,"load",c);document.querySelector("body").appendChild(b)}},a=function(a){if(a=a.getAttribute("data-options"))try{a=JSON.parse(a)}catch(c){console.error("Inline DocumentCloud embed options must be valid JSON. See https://www.documentcloud.org/help/publishing."),a={}}else a={};return a},b=function(){var c=
window.DocumentCloud,b=document.querySelectorAll('.DC-embed[data-version^="1."]');Penny.each(b,function(b,d){if(-1==b.className.indexOf("DC-embed-enhanced")){var e=b.querySelector(".DC-embed-resource").getAttribute("href"),e=DCEmbedToolbelt.recognizeResource(e);if(Penny.isEmpty(e))console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");else{b.className+=" DC-embed-enhanced";b.setAttribute("data-resource-type",e.resourceType);var k=Penny.extend({},
a(b),e.embedOptions,{container:b});c.embed.load(e,k)}}})},c=function(){try{var a=window.ENV.config.embed}catch(b){a={}}return Penny.extend({},{page:{assetPaths:{app:"../dist/page_embed.js",style:"../dist/page_embed.css"}}},a)}();(function(a){if(!document.querySelector('link[href$="'+a+'"]')){var b=document.createElement("link");b.rel="stylesheet";b.type="text/css";b.media="screen";b.href=a;document.querySelector("head").appendChild(b)}})(c.page.assetPaths.style);window.DocumentCloud?b():e(c.page.assetPaths.app,
b)}else console.error("DocumentCloud embed can't load because of missing components.")})})();
