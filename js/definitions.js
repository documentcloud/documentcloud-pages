(function(){
  var dc       = window.dc;
  var $        = dc.$;
  var _        = dc._;
  var Backbone = dc.Backbone;

  var definition = dc.embed.definition;
  var data = dc.embed.data;
  var views = dc.embed.views;

  definition.Document = definition.Document || Backbone.Model.extend({
    initialize: function(attributes){
      this.notes = new definition.NoteSet();
      //this.resources = new definition.ResourceSet(); // doesn't exist yet.
      this.on('sync', this.updateCollections, this);
    },
    
    updateCollections: function() {
      this.notes.reset(this.get('annotations'));
    },
    
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
  
  definition.Note = Backbone.Model.extend({});
  definition.NoteSet = Backbone.Collection.extend({
    model: definition.Note
  });

  definition.PageView = definition.PageView || Backbone.View.extend({
    initialize: function(options) {
      this.options = options;
      this.listenTo(this.model, 'sync', this.render);
    },

    render: function() {
      this.$el.html(JST['page']({model: this.model, pageNumber: this.options.page }));
      this.cacheDomReferences();
      this.cacheNaturalDimensions();
    },

    cacheDomReferences: function() {
      this.$image = this.$('.DC-page-image');
    },

    cacheNaturalDimensions: function() {
      var unstyledImage = $(new Image());
      var view = this;
      unstyledImage.load(function(){
        view.dimensions = {
          height: this.height,
          width: this.width,
          aspectRatio: this.height / this.width
        };
      });
      unstyledImage.attr('src', this.model.imageUrl(this.options.page));
    },

    currentScale: function() {
      return this.$image.width() / this.dimensions.width;
    }
  });
})();
