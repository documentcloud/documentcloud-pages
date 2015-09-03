(function(){
  var DocumentCloud = window.DocumentCloud;
  var $             = DocumentCloud.$;
  var _             = DocumentCloud._;
  var Backbone      = DocumentCloud.Backbone;

  var definition = DocumentCloud.embed.definition;
  var data       = DocumentCloud.embed.data;
  var views      = DocumentCloud.embed.views;

  definition.PageView = definition.PageView || Backbone.View.extend({
    events: {
      'click.dcPage':                        'clickedEmbed',
      'click.dcPage  .DC-action-nav-prev':   'goToPrevPage',
      'click.dcPage  .DC-action-nav-next':   'goToNextPage',
      'change.dcPage .DC-action-nav-select': 'selectPage',
      'click.dcPage  .DC-action-mode-image': 'switchToImage',
      'click.dcPage  .DC-action-mode-text':  'switchToText',
      'click.dcPage  .DC-note-overlay':      'clickNoteOverlay',
    },
  
    initialize: function(options) {
      this.options = options;
      this.noteViews = {};

      if (this.options.pym) {
        this.pym = this.options.pym;
      }

      this.listenTo(this.model, 'sync', this.render);
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
      if (!this.prepared) { this.prepare(); }
      this.makeTemplateOptions();
      this.$el.html(JST['page'](this.templateOptions));
      this.cacheDomReferences();
      this.checkIfIframed();
      this.renderNoteOverlay();
      this.switchToImage();
    },

    makeTemplateOptions: function() {
      var model      = this.model;
      var pageCount  = model.get('pages');
      var pageNumber = this.options.page;

      this.templateOptions = {
        model:             model,
        credit:            model.credit(),
        permalink:         model.permalink(),
        imageUrl:          model.imageUrl(pageNumber),
        permalinkPage:     model.permalinkPage(pageNumber),
        permalinkPageText: model.permalinkPageText(pageNumber),
        pageCount:         pageCount,
        hasMultiplePages:  model.hasMultiplePages(),
        pageNumber:        pageNumber,
        hasPrevPage:       pageNumber > 1,
        hasNextPage:       pageNumber < pageCount,
      };
      this.templateOptions.prevPageHref = this.templateOptions.hasPrevPage ? model.permalinkPage(pageNumber - 1) : '#';
      this.templateOptions.nextPageHref = this.templateOptions.hasNextPage ? model.permalinkPage(pageNumber + 1) : '#';
    },

    cacheDomReferences: function() {
      this.$embed = this.$el.closest('.DC-embed');
      this.$image = this.$el.find('.DC-page-image');
      this.$text = this.$el.find('.DC-page-text');
      this.$overlay = this.$el.find('.DC-note-overlay');
      this.$pageSelector = this.$el.find('.DC-action-nav-select');
    },

    renderNoteOverlay: function() {
      var view = this;

      // Cache this function internally
      var _renderOverlay = function() {
        var notes  = view.model.notes.forPage(view.options.page);
        view.$overlay.empty();
        var noteViews = _.map(notes, function(note) { return view.noteViews[note.id].render(view.dimensions); });
        view.$overlay.append(_.map(noteViews, function(v) { return v.$el; }));
      }

      // If dimensions are already cached, just straight re-render
      if (view.dimensions) {
        _renderOverlay();
      } else {
        var unstyledImage = $(new Image());
        unstyledImage.load(function() {
          view.dimensions = {
            height: this.height,
            width: this.width,
            aspectRatio: this.width / this.height
          };
          view.notifyPymParent();
          _renderOverlay();
        });
        unstyledImage.attr('src', view.model.imageUrl(view.options.page));
      }
    },

    clickNoteOverlay: function(event) {
      if ($(event.target).is('.DC-note-overlay') && this.openNote) {
        this.openNote.close();
      }
    },

    currentScale: function() { return this.$image.width() / this.dimensions.width; },
  
    switchToImage: function(event) {
      if (!_.isUndefined(event)) {
        event.preventDefault();
      }
      if (this.mode != 'page') {
        this.$embed.removeClass('DC-mode-text').addClass('DC-mode-image');
        this.mode = 'page';
      }
    },

    switchToText: function(event) {
      if (!_.isUndefined(event)) {
        event.preventDefault();
      }
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
      this.notifyPymParent();
    },

    closeOpenNote: function() {
      this.openNote = undefined;
      this.notifyPymParent(this.$el.height());
    },

    goToPrevPage: function(event) {
      event.preventDefault();
      var $prevPage = this.$pageSelector.find('option:selected').prev('option');
      if ($prevPage.length) {
        this.replaceWithPage($prevPage.attr('value'));
      }
    },

    goToNextPage: function(event) {
      event.preventDefault();
      var $nextPage = this.$pageSelector.find('option:selected').next('option');
      if ($nextPage.length) {
        this.replaceWithPage($nextPage.attr('value'));
      }
    },

    selectPage: function() {
      var newPage = this.$pageSelector.val();
      this.replaceWithPage(newPage);
    },
    
    replaceWithPage: function(page) {
      var newOptions = _.extend({}, this.options, { page: page });
      this.options = newOptions;

      // TODO: It'd be nice if I didn't have to reset all this stuff
      this.undelegateEvents();
      if (this.openNote) { this.openNote.close(); };

      var newView = new definition.PageView(newOptions);
      views.pages[this.model.id][this.options.container] = newView;
      this.$el.html(newView.render());
    },

    clickedEmbed: function() {
      if (this.$el.hasClass('DC-embed-linkonly')) {
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

    notifyPymParent: function(height) {
      if (this.pym) {
        if (!height) {
          var body = document.body,
              html = document.documentElement;

          height = Math.max(body.scrollHeight, body.offsetHeight,
                            html.clientHeight, html.scrollHeight, html.offsetHeight);
        }
        this.pym.sendMessage('height', height.toString());
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
