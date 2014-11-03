(function(){
  window.dc    = dc = window.dc || {};
  var $        = dc.$ = window.$.noConflict();
  var _        = dc._ = window._.noConflict();
  var Backbone = dc.Backbone = window.Backbone.noConflict();

  dc.embed = dc.embed || { data: {}, definition: {} };
  
  var definition = dc.embed.definition;
  var data = dc.embed.data;
  
  definition.Document = Backbone.Model.extend({}, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z-]+).js(on)?$/)[1]; }
  });
  definition.DocumentSet = Backbone.Collection.extend({ model: definition.Document });
  
  data.documents = new definition.DocumentSet();

  dc.embed.loadPage = function(url, opts){
    var options = opts || {};
    var id = definition.Document.extractId(url);
    var doc = new definition.Document({id: id});
    data.documents.add(doc);
    doc.fetch({url: url});
  };
})();
