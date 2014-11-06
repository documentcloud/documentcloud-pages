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
  
  definition.Note = Backbone.Model.extend({
    coordinates: function(force){
      if (!this._coordinates || force) {
        var css = _.map(this.get('location').image.split(','), function(num){ return parseInt(num, 10); });
        this._coordinates = {
          top:    css[0],
          left:   css[3],
          right:  css[1],
          height: css[2] - css[0],
          width:  css[1] - css[3]
        };
      }
      return this._coordinates;
    },
    scaledCoordinates: function(scale) {
      var scaled = _.clone(this.coordinates());
      _.each(_.keys(scaled), function(key){ scaled[key] *= scale; });
      return scaled;
    }
  });
  
  definition.NoteSet = Backbone.Collection.extend({
    model: definition.Note,
    forPage: function(number) {
      return this.select(function(note){ return note.get('page') == number; });
    }
  });
  
  definition.NoteView = definition.NoteView || Backbone.View.extend({
    className: "DC-note",
    render: function(scale) {
      scale = scale || 1;
      this.$el.html(JST["note"]({coordinates:this.model.scaledCoordinates(scale)}));
      return this;
    },
    resize: function(scale) {
      this.$('.DC-note-region').css(this.model.scaledCoordinates(scale));
    }
  });

  definition.PageView = definition.PageView || Backbone.View.extend({
    initialize: function(options) {
      this.options = options;
      this.noteViews = {};

      this.listenTo(this.model, 'sync', this.render);
      this.renderOverlay = _.bind(this.renderOverlay,this);
    },
    
    prepare: function() {
      var notes = this.model.notes.forPage(this.options.page);
      _.each(notes, function(note){ this.noteViews[note.id] = new definition.NoteView({model: note}); }, this);
      this.prepared = true;
    },

    render: function() {
      if (!this.prepared){ this.prepare(); }
      this.$el.html(JST['page']({model: this.model, pageNumber: this.options.page }));
      this.cacheDomReferences();
      if (this.dimensions) {
        this.renderNotes();
      } else {
        // Not sold on Promises given that they swallow error messages
        // unless you add an explicit path to catch possible errors.
        this.cacheNaturalDimensions().then(this.renderOverlay).then(
          undefined, function(error){ console.log(error);
        });
      }
    },

    renderOverlay: function() {
      var scale  = this.currentScale();
      var notes  = this.model.notes.forPage(this.options.page);
      //markup   = JST['debug']({ 
      //  scale: scale, 
      //  height: this.dimensions.height, 
      //  width: this.dimensions.width
      //}) + markup;
      this.$overlay.empty();
      var noteViews = _.map(notes, function(note){ return this.noteViews[note.id].render(scale) }, this);
      this.$overlay.append(_.map(noteViews, function(v){return v.$el}));
    },
    
    resize: function() {
      var scale = this.currentScale();
      _.each(this.noteViews, function(view){
        view.resize(scale);
      });
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
