(function(){
  var DCEmbedToolbelt = window.DCEmbedToolbelt;
  var DocumentCloud   = window.DocumentCloud;
  var $               = DocumentCloud.$;
  var _               = DocumentCloud._;
  var Backbone        = DocumentCloud.Backbone;

  var definition      = DocumentCloud.embed.definition;
  var data            = DocumentCloud.embed.data;
  var views           = DocumentCloud.embed.views;

  definition.NoteView = definition.NoteView || Backbone.View.extend({
    NOTE_MAX_HEIGHT: 200,

    // Appending `-wrapper` to avoid conflict with note embed
    className: "DC-note-wrapper",

    events: {
      'click .DC-note-region': 'toggle',
    },

    initialize: function(options) {
      this.imageUrl      = options.imageUrl;
      this.imageUrlLarge = options.imageUrlLarge;
    },

    // FIXME: It is immensely gross that I'm passing `publishedUrl` in here; I 
    // hope to work around that ASAP.
    render: function(dimensions, publishedUrl) {
      this.$el.html(JST["note"]({
        title:            this.model.get('title'),
        text:             this.model.get('content'),
        publishedUrlNote: publishedUrl + this.model.pageAnchor(),
        imageUrl:         this.imageUrl,
        imageUrlLarge:    this.imageUrlLarge,
        showNoteMenuBar:  false,
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
      this.$noteBody.css({top: 'auto', bottom: 'auto'});
    },

    // Note might drip off right or bottom edge; reposition in that case.
    repositionIfNecessary: function() {
      var $overlay = this.$el.closest('.DC-note-overlay');

      var newCSS       = {};
      var notePosition = this.$el.position();

      var noteLeft     = notePosition.left;
      var bodyWidth    = this.$noteBody.width();
      var bodyRight    = noteLeft + bodyWidth;
      var overlayWidth = $overlay.width();

      // Never drip off horizontal edges, even in direct (non-iframe) contexts
      if (bodyRight > overlayWidth) {
        var regionRight = noteLeft + this.$noteRegion.width();
        var noteBodyRight = (regionRight > bodyWidth) ? 0 : ((overlayWidth - regionRight) * -1);
        newCSS.right = noteBodyRight + 'px';
      }

      // In the iframe context, never drip off the bottom edge.
      if (DCEmbedToolbelt.isIframed()) {
        var noteHeight    = this.$el.height();
        var noteBottom    = notePosition.top + noteHeight;
        var overlayHeight = $overlay.height();
        var bodyHeight    = this.$noteBody.height();
        var bodyBottom    = noteBottom + bodyHeight;

        // Is the note bottom outside of the overlay?
        if (bodyBottom > overlayHeight) {
          var noteBottomToOverlayBottom = overlayHeight - noteBottom;
          var noteTopToOverlayTop       = notePosition.top;

          // Do we have more room above the note than below?
          if (noteTopToOverlayTop > noteBottomToOverlayBottom) {
            newCSS.bottom = noteHeight + 'px';

            // Do we need to limit max height?
            if (noteTopToOverlayTop < this.NOTE_MAX_HEIGHT) {
              newCSS.maxHeight = noteTopToOverlayTop + 'px';
            }
          } else {
            // Below-note positioning is still our best bet, so limit max height
            newCSS.maxHeight = noteBottomToOverlayBottom + 'px';
          }
        }
      }

      this.$noteBody.css(newCSS);
    },

  });
})();