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
      'click .DC-note-region': 'open',
      'click .DC-note-foldup': 'close'
    },

    render: function(scale) {
      scale = scale || 1;
      var coordinates = this.model.scaledCoordinates(scale);
      this.$el.html(JST["note"]({
        title: this.model.get('title'),
        text: this.model.get('content')
      }));
      this.$el.css({
        top: coordinates.top,
        width: coordinates.width,
        left: coordinates.left,
      });
      this.$('.DC-note-region').css({height: coordinates.height});
      return this;
    },

    resize: function(scale) {
      var coordinates = this.model.scaledCoordinates(scale);
      this.$el.css({
        top: coordinates.top,
        width: coordinates.width,
        left: coordinates.left,
      });
      this.$('.DC-note-region').css({height: coordinates.height});
    },
  
    open: function() {
      this.$el.addClass('open');
      this.trigger('opened', this);
    },
  
    close: function() {
      this.$el.removeClass('open');
      this.trigger('closed', this);
    }
  });
})();