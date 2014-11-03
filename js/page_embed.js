(function(){
  var dc       = window.dc;
  var $        = dc.$;
  var _        = dc._;
  var Backbone = dc.Backbone;

  var definition = dc.embed.definition;
  var data = dc.embed.data;
  var views = dc.embed.views;

  definition.Document = definition.Document || Backbone.Model.extend({
    imageUrl : function(pageNumber) {
      if (!this._imageUrl) {
        var resources = this.get('resources');
        var urlTemplate = resources['page']['image'];
        this._imageUrl = urlTemplate.replace('{size}', 'normal').replace('{page}', pageNumber);
      }
      return this._imageUrl;
    },
  }, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z-]+).js(on)?$/)[1]; }
  });
  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({ 
    model: definition.Document 
  });

  definition.PageView = definition.PageView || Backbone.View.extend({
    initialize: function(options) {
      this.options = options;
      this.listenTo(this.model, 'sync', this.render);
    },
    render: function() {
      this.$el.html(JST['page']({model: this.model, pageNumber: this.options.page }));
    }
  });
  
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
