parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"JXbL":[function(require,module,exports) {
module.exports="/countries.a59e5dcf.csv";
},{}],"knfB":[function(require,module,exports) {
var t={top:0,right:20,bottom:30,left:200},a=500-t.left-t.right,e=400-t.top-t.bottom,r=d3.select("#chart").append("svg").attr("width",a+t.left+t.right).attr("height",e+t.top+t.bottom).append("g").attr("transform","translate("+t.left+","+t.top+")"),c=d3.scaleLinear().domain([0,8e4]).range([0,a]),n=d3.scaleLinear().domain([30,85]).range([e,0]),i=d3.scaleOrdinal().range(["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae"]);function l(t){console.log("Data is",t),r.selectAll("circle").data(t).enter().append("circle").attr("r",4).attr("cx",function(t){return c(t.gdp_per_capita)}).attr("cy",function(t){return n(t.life_expectancy)}).attr("fill",function(t){return i(t.continent)});var l=d3.axisLeft(n).tickSize(-a).ticks(5);r.append("g").attr("class","axis y-axis").call(l).lower(),d3.select(".y-axis .domain").remove();var s=d3.axisBottom(c).ticks(7);r.append("g").attr("class","axis x-axis").attr("transform","translate(0,"+e+")").call(s)}d3.csv(require("./countries.csv")).then(l);
},{"./countries.csv":"JXbL"}]},{},["knfB"], null)
//# sourceMappingURL=/graph.2c8d6857.js.map