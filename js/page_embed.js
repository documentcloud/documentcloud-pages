(function(){
  var dcloud     = window.dcloud;
  var $          = dcloud.$;
  var _          = dcloud._;
  var definition = dcloud.embed.definition;
  var data       = dcloud.embed.data;
  var views      = dcloud.embed.views;
  
  data.documents = data.documents || new definition.DocumentSet();
  // views.pages is a nested list of page views, keyed at the top level
  // by document id, and then element selector.
  // e.g. views.pages['282753-lefler-thesis']['#target-container']
  // initialization of the inner object is done in dcloud.embed.loadPage
  views.pages = views.pages || {};

  if (!_.isFunction(dcloud.embed.loadPage)) {
    dcloud.embed.loadPage = function(url, opts) {
      var options = opts || {};

      if (!options.container) {
        if (window.console) {
          console.error('DocumentCloud can’t be embedded without a container.');
        }
        return;
      }

      var id   = definition.Document.extractId(url);
      var doc  = new definition.Document({id: id});
      var view = new definition.PageView({model: doc, el: options.container, page: options.page, pym: options.pym});
      data.documents.add(doc);
      views.pages[id]                    = views.pages[id] || {};
      views.pages[id][options.container] = view;
      doc.fetch({url: url});

      var $el = $(options.container);
      $(window).on('load resize', function() {
        var width = $el.width();
        // TODO: Move these size breakpoints/definitions to somewhere sensible
        if (width < 200) { $el.addClass('DC-embed-linkonly').removeClass('DC-embed-reduced'); }
        else if (width < 400) { $el.addClass('DC-embed-reduced').removeClass('DC-embed-linkonly'); }
        else { $el.removeClass('DC-embed-reduced DC-embed-linkonly'); }
      });

    };
  }

})();
