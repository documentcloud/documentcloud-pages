(function(){
  var DCEmbedToolbelt = window.DCEmbedToolbelt;
  var DocumentCloud   = window.DocumentCloud;
  var $               = DocumentCloud.$;
  var _               = DocumentCloud._;
  var Backbone        = DocumentCloud.Backbone;

  var definition = DocumentCloud.embed.definition;
  var data       = DocumentCloud.embed.data;
  var views      = DocumentCloud.embed.views;

  definition.PageView = definition.PageView || Backbone.View.extend({

    events: {
      'click.dcPage  .DC-page':              'clickPage',
      'click.dcPage  .DC-action-nav-prev':   'goToPrevPage',
      'click.dcPage  .DC-action-nav-next':   'goToNextPage',
      'change.dcPage .DC-action-nav-select': 'selectPage',
      'click.dcPage  .DC-action-mode-image': 'switchToImage',
      'click.dcPage  .DC-action-mode-text':  'switchToText',
      'click.dcPage  .DC-note-overlay':      'clickNoteOverlay',
    },

    validOptionKeys: ['credit', 'page', 'pageNavigator', 'text', 'preview'],

    defaultOptions: {
      credit:        true,
      page:          1,
      pageNavigator: false,
      preview:       false,
      text:          false
    },

    sizeBreakpoints: [
      [0,   199],
      [200, 399]
    ], // Keep in sync with media queries in `page_embed.scss`

    initialize: function(options) {
      this.options = _.extend({}, this.defaultOptions, options);

      this.currentPageNumber = this.options.page;
      this.noteViews         = {};
      this.cachedText        = {};
      this.iframed           = DCEmbedToolbelt.isIframed()

      this.listenTo(this.model, 'sync', this.render);
    },

    render: function() {
      this.verifyPageNumber();
      this.makeTemplateData();
      this.prepareNotes(); // Requires `makeTemplateData()` be run first
      this.$el.html(JST['page'](this.templateData));
      this.cacheDomReferences();
      this.classifyEmbedContext();
      this.$image.on('load', _.bind(this.renderNoteOverlay, this));
      if (this.mode == 'text') {
        this.switchToText();
      } else {
        this.switchToImage();
      }
    },

    verifyPageNumber: function() {
      if (this.currentPageNumber > this.model.get('pages')) {
        console.warn("Showing the first page of the DocumentCloud document because page " + this.currentPageNumber + " doesn't exist.");
        this.currentPageNumber = 1;
      }
    },

    prepareNotes: function() {
      if (!_.has(this.noteViews, this.currentPageNumber)) {
        this.noteViews[this.currentPageNumber] = {}
      }
      // TODO: Try to save this and not regenerate every time
      var notes = this.model.notes.forPage(this.currentPageNumber);
      _.each(notes, function(note){
        var noteView = new definition.NoteView({
          model:         note,
          imageUrl:      this.templateData.imageUrl,
          imageUrlLarge: this.templateData.imageUrlLarge
        });
        this.noteViews[this.currentPageNumber][note.id] = noteView;
        this.listenTo(noteView, 'opened', this.updateOpenNote);
        this.listenTo(noteView, 'closed', this.closeOpenNote);
      }, this);
    },

    makeTemplateData: function() {
      var model      = this.model;
      var pageCount  = model.get('pages');
      var pageNumber = this.currentPageNumber;
      var creditData = {
        contributor:              this.model.get('contributor'),
        contributorDocumentsUrl:  this.model.get('contributor_documents_url'),
        organization:             this.model.get('contributor_organization'),
        organizationDocumentsUrl: this.model.get('contributor_organization_documents_url'),
      };
      // We need to know at least the contributor or organization name
      var hasCreditData = creditData.contributor || creditData.organization;

      this.templateData = {
        showMeta:          !this.iframed,
        showCredit:        !this.iframed && this.options.credit && hasCreditData,
        showTextMode:      this.options.text,
        showPageNavigator: this.options.pageNavigator,
        showPageMenuBar:   this.options.pageNavigator || this.options.text,
        model:             model,
        imageUrl:          model.imageUrl(pageNumber),
        imageUrlLarge:     model.imageUrl(pageNumber, 'large'),
        publishedUrlPage:  model.publishedUrlPage(pageNumber),
        pageTextUrl:       model.pageTextUrl(pageNumber),
        pageTextFileUrl:   model.pageTextFileUrl(pageNumber),
        pageCount:         pageCount,
        hasMultiplePages:  model.hasMultiplePages(),
        pageNumber:        pageNumber,
        hasPrevPage:       pageNumber > 1,
        hasNextPage:       pageNumber < pageCount,
      };
      this.templateData.prevPageHref      = this.templateData.hasPrevPage ? model.publishedUrlPage(pageNumber - 1) : '#';
      this.templateData.nextPageHref      = this.templateData.hasNextPage ? model.publishedUrlPage(pageNumber + 1) : '#';
      // Don't compile template if we don't have to
      this.templateData.contributorCredit = this.templateData.showCredit ? JST['credit'](creditData) : '';
    },

    cacheDomReferences: function() {
      this.$embed        = this.$el.find('.DC-page-embed');
      this.$image        = this.$el.find('.DC-page-image');
      this.$text         = this.$el.find('.DC-page-text');
      this.$overlay      = this.$el.find('.DC-note-overlay');
      this.$pageSelector = this.$el.find('.DC-action-nav-select');
    },

    renderNoteOverlay: function() {
      if (this.notesLoaded) {
        return false;
      }

      var view = this;

      // Cache this function internally
      var _renderOverlay = function() {
        view.$overlay.empty();
        var noteViews = _.map(view.noteViews[view.currentPageNumber],
                              function(noteView) {
                                return noteView.render(view.dimensions, view.model.publishedUrl());
                              });
        view.$overlay.append(_.map(noteViews, function(v) { return v.$el; }));
        view.notesLoaded = true;
      }

      // If dimensions are already cached, just straight re-render
      if (view.dimensions) {
        _renderOverlay();
      } else {
        view.dimensions = {
          width: 700,
          // TODO: If the document JSON returns page aspect ratio, we won't 
          // have to do this calculation, and in fact won't have to observe 
          // image loading at all
          aspectRatio: view.$image.width() / view.$image.height()
        };
        view.dimensions.height = view.dimensions.width / view.dimensions.aspectRatio;
        _renderOverlay();
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
      this.$embed.removeClass('DC-mode-text').addClass('DC-mode-image');
      this.mode = 'page';
    },

    switchToText: function(event) {
      if (!_.isUndefined(event)) {
        event.preventDefault();
      }
      this.$embed.removeClass('DC-mode-image').addClass('DC-mode-text');
      this.mode = 'text';
      if (_.isUndefined(this.cachedText[this.currentPageNumber])) {
        this.$text.removeClass('error').addClass('fetching')
                  .html('<i class="DC-icon DC-icon-arrows-cw animate-spin"></i> Fetching page text…');
        var _this = this;
        $.get(this.model.pageTextUrl(this.currentPageNumber), function(data) {
          _this.cachedText[_this.currentPageNumber] = data;
          _this.$text.text(data);
        }).fail(function(){
          _this.$text.addClass('error').text('Unable to fetch page text.');
        }).always(function(){
          _this.$text.removeClass('fetching');
        });
      } else {
        this.$text.text(this.cachedText[this.currentPageNumber]);
      }
    },

    updateOpenNote: function(justOpened) {
      if (this.openNote && this.openNote != justOpened) {
        this.openNote.close();
      }
      this.openNote = justOpened;
    },

    closeOpenNote: function() {
      this.openNote = undefined;
    },

    selectPage: function() {
      var newPageNumber = this.$pageSelector.val();
      this.goToPage(newPageNumber);
    },

    goToPrevPage: function(event) {
      event.preventDefault();
      var $prevPage = this.$pageSelector.find('option:selected').prev('option');
      if ($prevPage.length) {
        this.goToPage($prevPage.attr('value'));
      }
    },

    goToNextPage: function(event) {
      event.preventDefault();
      var $nextPage = this.$pageSelector.find('option:selected').next('option');
      if ($nextPage.length) {
        this.goToPage($nextPage.attr('value'));
      }
    },

    goToPage: function(pageNumber) {
      if (pageNumber <= this.model.get('pages') && pageNumber != this.currentPageNumber) {
        if (this.openNote) {
          this.openNote.close();
        };
        this.currentPageNumber = pageNumber;
        this.notesLoaded       = false;
        this.undelegateEvents();
        this.$el.html(this.render());
        this.delegateEvents();
      }
    },

    clickPage: function() {
      var weAreTiny = this.iframed ? (this.$el.width() <= this.sizeBreakpoints[0][1]) : this.$el.hasClass('DC-embed-size-0');
      if (weAreTiny) {
        window.open(this.model.publishedUrl());
      }
    },

    classifyEmbedContext: function() {
      this.$el.addClass('DC-embed-' + (this.iframed ? 'iframed' : 'inline'));
    },

  });
})();
