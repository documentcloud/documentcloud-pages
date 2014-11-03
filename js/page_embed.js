(function(){
  var dc         = window.dc;
  var definition = dc.embed.definition;
  var data       = dc.embed.data;
  var views      = dc.embed.views;
  
  data.documents = data.documents || new definition.DocumentSet();
  // views.pages is a nested list of page views, keyed at the top level
  // by document id, and then element selector.
  // e.g. views.pages['282753-lefler-thesis']['#target-container']
  // initialization of the inner object is done in dc.embed.loadPage
  views.pages = views.pages || {};
  
  dc.embed.loadPage = function(url, opts){
    var options = opts || {};
    // should throw an error here if there isn't a container.
    var id = definition.Document.extractId(url);
    
    // create the things and keep references to them in the right places.
    var doc = new definition.Document({id: id});
    var view = new definition.PageView({model: doc, el: options.container, page: options.page});
    data.documents.add(doc);
    views.pages[id] = views.pages[id] || {};
    views.pages[id][options.container] = view;
    doc.fetch({url: url}); // kick everything off.
  };
})();
