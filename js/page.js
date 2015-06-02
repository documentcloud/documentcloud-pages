(function(){
  var dc       = window.dc;
  var $        = dc.$;
  var _        = dc._;
  var Backbone = dc.Backbone;

  var definition = dc.embed.definition;
  var data = dc.embed.data;
  var views = dc.embed.views;

  definition.PageView = definition.PageView || Backbone.View.extend({
    events: {
      'click .DC-mode-toggle .DC-mode-image': function(event) { event.preventDefault(); this.switchToImage(); },
      'click .DC-mode-toggle .DC-mode-text': function(event) { event.preventDefault(); this.switchToText(); },
      'click .DC-note-overlay': function(event) {
        if ($(event.target).is('.DC-note-overlay') && this.openNote) { this.openNote.close(); }
      },
    },
  
    initialize: function(options) {
      this.options = options;
      this.noteViews = {};

      this.listenTo(this.model, 'sync', this.render);
      this.renderOverlay = _.bind(this.renderOverlay,this);
    },
  
    prepare: function() {
      var notes = this.model.notes.forPage(this.options.page);
      _.each(notes, function(note){ 
        var noteView = new definition.NoteView({model: note});
        this.noteViews[note.id] = noteView;
        this.listenTo(noteView, 'opened', this.updateOpenNote);
        this.listenTo(noteView, 'closed', this.closeOpenNote);
      }, this);
      this.prepared = true;
    },

    render: function() {
      if (!this.prepared){ this.prepare(); }
      this.$el.html(JST['page']({
        model: this.model,
        pageNumber: this.options.page
      }));
      this.cacheDomReferences();
      if (this.dimensions) {
        this.renderOverlay();
      } else {
        // Not sold on Promises given that they swallow error messages
        // unless you add an explicit path to catch possible errors.
        this.cacheNaturalDimensions().then(this.renderOverlay).then(
          undefined, function(error){ console.log(error);
        });
      }
      this.switchToImage();
    },

    renderOverlay: function() {
      // var scale  = this.currentScale();
      var notes  = this.model.notes.forPage(this.options.page);
      //markup   = JST['debug']({ 
      //  scale: scale, 
      //  height: this.dimensions.height, 
      //  width: this.dimensions.width
      //}) + markup;
      this.$overlay.empty();
      var noteViews = _.map(notes, function(note){ return this.noteViews[note.id].render(this.dimensions); }, this);
      this.$overlay.append(_.map(noteViews, function(v){return v.$el;}));
    },
  
    // resize: function() {
    //   var scale = this.currentScale();
    //   this.$el.css({
    //     width: this.width * scale,
    //     height: this.height * scale
    //   });
    //   _.each(this.noteViews, function(view){ view.resize(scale); });
    // },

    cacheDomReferences: function() {
      this.$embed = this.$el.closest('.DC-embed');
      this.$image = this.$el.find('.DC-page-image');
      this.$text = this.$el.find('.DC-page-text');
      this.$overlay = this.$el.find('.DC-note-overlay');
    },

    cacheNaturalDimensions: function() {
      var view = this;
      return new Promise(function(resolve, reject){
        var unstyledImage = $(new Image());
        unstyledImage.load(function(){
          view.dimensions = {
            height: this.height,
            width: this.width,
            aspectRatio: this.width / this.height
          };
          resolve();
        });
        unstyledImage.attr('src', view.model.imageUrl(view.options.page));
      });
    },

    currentScale: function() { return this.$image.width() / this.dimensions.width; },
  
    switchToImage: function() {
      if (this.mode != 'page') {
        this.$embed.removeClass('DC-mode-text').addClass('DC-mode-image');
        this.mode = 'page';
      }
    },

    switchToText: function() {
      if (this.mode != 'text') {
        this.fitTextToImage();
        this.$embed.removeClass('DC-mode-image').addClass('DC-mode-text');
        this.mode = 'text';
        if (_.isUndefined(this.cachedText)) {
          this.$text.removeClass('error').addClass('fetching')
                    .html('<i class="dc-icon-arrows-cw animate-spin"></i> Fetching page text…');
          var _this = this;
          $.get(this.model.textUrl(this.options.page), function(data) {
            _this.cachedText = data;
            _this.$text.text(data);
          }).fail(function(){
            _this.$text.addClass('error').text('Unable to fetch page text.');
          }).always(function(){
            _this.$text.removeClass('fetching');
          });
        }
      }
    },

    fitTextToImage: function() {
      var padding = parseInt(this.$text.css('padding').replace('px', ''), 10);
      this.$text.css({
        width: this.$image.width() - (padding * 2) + 'px',
        height: this.$image.height() - (padding * 2) + 'px',
      });
    },

    updateOpenNote: function(justOpened){
      if (this.openNote && this.openNote != justOpened) { this.openNote.close(); }
      this.openNote = justOpened;
    },
    closeOpenNote: function(){
      this.openNote = undefined;
    }
  });
})();
