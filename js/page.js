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
      'click .DC-page': function() { this.clickedPage(); },
      'click .DC-action-nav-prev': function(event) { event.preventDefault(); this.goToPrevPage(); },
      'click .DC-action-nav-next': function(event) { event.preventDefault(); this.goToNextPage(); },
      'change .DC-action-nav-select': function(event) { event.preventDefault(); this.selectPage(); },
      'click .DC-action-mode-image': function(event) { event.preventDefault(); this.switchToImage(); },
      'click .DC-action-mode-text':  function(event) { event.preventDefault(); this.switchToText(); },
      'click .DC-note-overlay':      function(event) {
        if ($(event.target).is('.DC-note-overlay') && this.openNote) { this.openNote.close(); }
      },
    },
  
    initialize: function(options) {
      this.options = options;
      this.noteViews = {};

      this.listenTo(this.model, 'sync', this.render);
      this.renderOverlay = _.bind(this.renderOverlay, this);
    },
  
    prepare: function() {
      var notes = this.model.notes.forPage(this.options.page);
      _.each(notes, function(note){ 
        var noteView = new definition.NoteView({
          model: note,
          imageUrl: this.model.imageUrl(this.options.page),
        });
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
      this.checkIfIframed();
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
      this.$pageSelector = this.$el.find('.DC-action-nav-select');
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
        this.$embed.removeClass('DC-mode-image').addClass('DC-mode-text');
        this.mode = 'text';
        if (_.isUndefined(this.cachedText)) {
          this.$text.removeClass('error').addClass('fetching')
                    .html('<i class="DC-icon DC-icon-arrows-cw animate-spin"></i> Fetching page text…');
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

    updateOpenNote: function(justOpened) {
      if (this.openNote && this.openNote != justOpened) { this.openNote.close(); }
      this.openNote = justOpened;
    },

    closeOpenNote: function() {
      this.openNote = undefined;
    },

    goToPrevPage: function() {
      var $prevPage = this.$pageSelector.find('option:selected').prev('option');
      if ($prevPage.length) {
        this.replaceWithPage($prevPage.attr('value'));
      }
    },

    goToNextPage: function() {
      var $nextPage = this.$pageSelector.find('option:selected').next('option');
      if ($nextPage.length) {
        this.replaceWithPage($nextPage.attr('value'));
      }
    },

    selectPage: function() {
      var currentPage = this.options.page;
      var newPage = this.$pageSelector.val();
      this.$pageSelector.find('option[value="' + currentPage + '"]').text(currentPage);
      this.$pageSelector.find('option[value="' + newPage + '"]').text( newPage + ' / ' + this.model.attributes.pages);
      this.replaceWithPage(newPage);
    },
    
    replaceWithPage: function(page) {
      var newOptions = _.extend({}, this.options, { page: page });
      this.options = newOptions;

      this.undelegateEvents();
      var newView = new definition.PageView(newOptions);
      views.pages[this.model.id][this.options.container] = newView;
      this.$el.html(newView.render());
    },

    clickedPage: function() {
      if (this.$el.width() < 200) {
        var href = this.$el.find('.DC-resource-url').attr('href');
        window.open(href);
      }
    },

    checkIfIframed: function() {
      if (this.inIframe()) {
        this.$el.addClass('DC-iframed');
        this.iframed = true;
      } else {
        this.$el.addClass('DC-no-iframed');
        this.iframed = false;
      }
    },

    // http://stackoverflow.com/q/326069/5071070
    inIframe: function() {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
    },

  });
})();
