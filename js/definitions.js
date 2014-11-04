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
    model: definition.Note,
    forPage: function(number) {
      return this.select(function(note){ return note.get('page') == number; });
    }
  });

  definition.PageView = definition.PageView || Backbone.View.extend({
    initialize: function(options) {
      this.options = options;
      this.listenTo(this.model, 'sync', this.render);
      this.renderNotes = _.bind(this.renderNotes,this);
    },

    render: function() {
      this.$el.html(JST['page']({model: this.model, pageNumber: this.options.page }));
      this.cacheDomReferences();
      if (this.dimensions) {
        this.renderNotes();
      } else {
        // Not sold on Promises given that they swallow error messages
        // unless you add an explicit path to catch possible errors.
        this.cacheNaturalDimensions().then(this.renderNotes).then(
          undefined, function(error){ console.log(error);
        });
      }
    },
    
    renderNotes: function(){
      var scale = this.currentScale();
      var notes = this.model.notes.forPage(this.options.page);
      var markup = _.reduce(notes, function(memo, note){
        return memo + JST["note"]({note:note, scale: scale});
      }, "");
      markup = JST['debug']({ 
        scale: scale, 
        height: this.dimensions.height, 
        width: this.dimensions.width
      }) + markup;
      this.$overlay.html(markup);
    },

    cacheDomReferences: function() {
      this.$image = this.$('.DC-page-image');
      this.$overlay = this.$('.DC-note-overlay');
    },

    cacheNaturalDimensions: function() {
      var view = this;
      return new Promise(function(resolve, reject){
        var unstyledImage = $(new Image());
        unstyledImage.load(function(){
          view.dimensions = {
            height: this.height,
            width: this.width,
            aspectRatio: this.height / this.width
          };
          resolve();
        });
        unstyledImage.attr('src', view.model.imageUrl(view.options.page));
      });
    },

    currentScale: function() {
      return this.$image.width() / this.dimensions.width;
    }
  });
})();
