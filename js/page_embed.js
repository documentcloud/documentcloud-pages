(function(){
  var dc         = window.dc;
  var $          = dc.$;
  var _          = dc._;
  var definition = dc.embed.definition;
  var data       = dc.embed.data;
  var views      = dc.embed.views;
  
  data.documents = data.documents || new definition.DocumentSet();
  // views.pages is a nested list of page views, keyed at the top level
  // by document id, and then element selector.
  // e.g. views.pages['282753-lefler-thesis']['#target-container']
  // initialization of the inner object is done in dc.embed.loadPage
  views.pages = views.pages || {};

  if (!_.isFunction(dc.embed.loadPage)) {
    dc.embed.loadPage = function(url, opts) {
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
      $(window).on('resize', function() {
        var width = $el.width();
        if (width < 200) { $el.addClass('DC-embed-linkonly').removeClass('DC-embed-reduced'); }
        else if (width < 300) { $el.addClass('DC-embed-reduced').removeClass('DC-embed-linkonly'); }
        else { $el.removeClass('DC-embed-reduced DC-embed-linkonly'); }
      });

    };
  }

})();
