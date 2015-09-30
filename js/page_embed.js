(function(){
  var DocumentCloud = window.DocumentCloud;
  var $             = DocumentCloud.$;
  var _             = DocumentCloud._;
  var definition    = DocumentCloud.embed.definition;
  var data          = DocumentCloud.embed.data;
  var views         = DocumentCloud.embed.views;

  data.documents = data.documents || new definition.DocumentSet();
  // views.pages is a nested list of page views, keyed at the top level
  // by document id, and then element selector.
  // e.g. views.pages['282753-lefler-thesis']['#target-container']
  // initialization of the inner object is done in DocumentCloud.embed.loadPage
  views.pages = views.pages || {};

  if (!_.isFunction(DocumentCloud.embed.loadPage)) {
    DocumentCloud.embed.loadPage = function(url, opts) {
      var options = opts || {};

      if (!options.container) {
        console.error("DocumentCloud can't be embedded without specifying a container.");
        return;
      }

      var id               = definition.Document.extractId(url);
      var doc              = new definition.Document({id: id});
      var validOptionKeys  = definition.PageView.prototype.validOptionKeys;
      var pageEmbedOptions = _.extend({}, {model: doc, el: options.container}, _.pick(options, validOptionKeys));
      var view             = new definition.PageView(pageEmbedOptions);
      data.documents.add(doc);
      views.pages[id]                    = views.pages[id] || {};
      views.pages[id][options.container] = view;
      doc.fetch({url: url});

      var setEmbedSizeClasses = function($el) {
        var width = $el.width();
        // TODO: Move these size breakpoints/definitions to somewhere sensible
        if (width < 200) { $el.addClass('DC-embed-linkonly').removeClass('DC-embed-reduced'); }
        else if (width < 400) { $el.addClass('DC-embed-reduced').removeClass('DC-embed-linkonly'); }
        else { $el.removeClass('DC-embed-reduced DC-embed-linkonly'); }
      };
      var $el = $(options.container);
      setEmbedSizeClasses($el);
      $(window).on('resize', setEmbedSizeClasses($el));
    };
  }


})();
