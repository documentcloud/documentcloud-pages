(function(){
  window.dc    = dc = window.dc || {};
  var $        = dc.$ = window.$.noConflict();
  var _        = dc._ = window._.noConflict();
  var Backbone = dc.Backbone = window.Backbone.noConflict();

  dc.embed = dc.embed || { data: {}, definition: {}, views: {} };
  
  var definition = dc.embed.definition;
  var data = dc.embed.data;
  var views = dc.embed.views;

  definition.Document = definition.Document || Backbone.Model.extend({}, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z-]+).js(on)?$/)[1]; }
  });
  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({ 
    model: definition.Document 
  });

  definition.PageView = definition.PageView || Backbone.View.extend({
    template: JST['page']
  });
  
  data.documents = data.documents || new definition.DocumentSet();
  views.pages = views.pages || new Backbone.Collection();
  
  dc.embed.loadPage = function(url, opts){
    var options = opts || {};
    var id = definition.Document.extractId(url);
    var doc = new definition.Document({id: id});
    data.documents.add(doc);
    doc.fetch({url: url});
  };
})();
