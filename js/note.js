(function(){
  var dc       = window.dc;
  var $        = dc.$;
  var _        = dc._;
  var Backbone = dc.Backbone;

  var definition = dc.embed.definition;
  var data = dc.embed.data;
  var views = dc.embed.views;

  definition.NoteView = definition.NoteView || Backbone.View.extend({
    className: "DC-note",
    events: {
      'click .DC-note-region': 'toggle',
    },

    // render: function(scale) {
    //   scale = scale || 1;
    //   var coordinates = this.model.scaledCoordinates(scale);
    //   this.$el.html(JST["note"]({
    //     title: this.model.get('title'),
    //     text: this.model.get('content')
    //   }));
    //   this.$el.css({
    //     top: coordinates.top,
    //     width: coordinates.width,
    //     left: coordinates.left,
    //   });
    //   this.$('.DC-note-region').css({height: coordinates.height});
    //   return this;
    // },

    initialize: function(options) {
      this.imageUrl = options.imageUrl;
    },

    render: function(dimensions) {
      this.$el.html(JST["note"]({
        title: this.model.get('title'),
        text: this.model.get('content'),
        canonicalUrl: this.model.get('canonical_url'),
        imageUrl: this.imageUrl,
      }));
      var coordinates = this.model.percentageCoordinates(dimensions);
      var cssCoordinates = _.pick(coordinates, 'top', 'left', 'width', 'height');
      this.$el.css(cssCoordinates);

      var imageCoordinates = this.model.imageCoordinates(dimensions);
      var cssImageCoordinates = _.pick(imageCoordinates, 'top', 'left', 'width');
      this.$el.find('.DC-note-image').css(cssImageCoordinates);

      return this;
    },

    // resize: function(scale) {
    //   var coordinates = this.model.scaledCoordinates(scale);
    //   this.$el.css({
    //     top: coordinates.top,
    //     width: coordinates.width,
    //     left: coordinates.left,
    //   });
    //   this.$('.DC-note-region').css({height: coordinates.height});
    // },
  
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
      this.$el.closest('.DC-embed').addClass('open');
    },
  
    close: function() {
      this.$el.removeClass('open');
      this.trigger('closed', this);
      this.$el.closest('.DC-embed').removeClass('open');
    }

  });
})();