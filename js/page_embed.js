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
  views.pages = views.pages || new Backbone.Collection();
  
  dc.embed.loadPage = function(url, opts){
    var options = opts || {};
    var id = definition.Document.extractId(url);
    var doc = new definition.Document({id: id});
    data.documents.add(doc);
    doc.fetch({url: url});
  };
})();
