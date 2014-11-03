(function(){
  window.dc = dc = window.dc || {};
  dc.$ = window.$.noConflict();
  dc._ = window._.noConflict();
  dc.Backbone = window.Backbone.noConflict();

  dc.embed = dc.embed || { data: {}, definition: {} };
  
  var definition = dc.embed.definition;
  var data = dc.embed.data;
  
  dc.embed.loadPage = function(){
    
  };
})();