(function(){
  var DocumentCloud = window.DocumentCloud;
  var $             = DocumentCloud.$;
  var _             = DocumentCloud._;
  var Backbone      = DocumentCloud.Backbone;

  var definition = DocumentCloud.embed.definition;
  var data       = DocumentCloud.embed.data;
  var views      = DocumentCloud.embed.views;

  definition.NoteView = definition.NoteView || Backbone.View.extend({
    // Appending `-wrapper` to avoid conflict with note embed
    className: "DC-note-wrapper",

    events: {
      'click .DC-note-region': 'toggle',
    },

    initialize: function(options) {
      this.imageUrl      = options.imageUrl;
      this.imageUrlLarge = options.imageUrlLarge;
    },

    render: function(dimensions) {
      this.$el.html(JST["note"]({
        title:           this.model.get('title'),
        text:            this.model.get('content'),
        permalinkNote:   this.model.permalink(),
        imageUrl:        this.imageUrl,
        imageUrlLarge:   this.imageUrlLarge,
        showNoteMenuBar: false,
      }));
      this.cacheDomReferences();

      var coordinates = this.model.percentageCoordinates(dimensions);
      var cssCoordinates = _.pick(coordinates, 'top', 'left', 'width', 'height');
      this.$el.css(cssCoordinates);

      var imageCoordinates = this.model.imageCoordinates(dimensions);
      var cssImageCoordinates = _.pick(imageCoordinates, 'top', 'left', 'width');
      this.$noteImage.css(cssImageCoordinates);

      return this;
    },

    cacheDomReferences: function() {
      this.$noteRegion = this.$el.find('.DC-note-region');
      this.$noteImage  = this.$el.find('.DC-note-image');
      this.$noteBody   = this.$el.find('.DC-note-body');
    },

    toggle: function() {
      if (this.$el.hasClass('open')) {
        this.close();
      } else {
        this.open();
      }
    },

    open: function() {
      this.$el.addClass('open');
      this.trigger('opened', this);
      this.$el.closest('.DC-page-embed').addClass('open');
      this.repositionIfNecessary();
    },

    close: function() {
      this.$el.removeClass('open');
      this.trigger('closed', this);
      this.$el.closest('.DC-page-embed').removeClass('open');
    },

    // Note might drip off right edge; reposition in that case.
    repositionIfNecessary: function() {
      var $overlay = this.$el.closest('.DC-note-overlay');

      var noteLeft     = this.$el.position().left;
      var bodyWidth    = this.$noteBody.width();
      var bodyRight    = noteLeft + bodyWidth;
      var overlayWidth = $overlay.width();

      if (bodyRight > overlayWidth) {
        var regionRight = noteLeft + this.$noteRegion.width();
        var noteBodyRight = (regionRight > bodyWidth) ? 0 : ((overlayWidth - regionRight) * -1);
        this.$noteBody.css({right: noteBodyRight + 'px' });
      }
    },

  });
})();