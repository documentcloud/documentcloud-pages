(function(){
  var DocumentCloud   = window.DocumentCloud;
  var $               = DocumentCloud.$;
  var _               = DocumentCloud._;
  var definition      = DocumentCloud.embed.definition;
  var data            = DocumentCloud.embed.data;
  var views           = DocumentCloud.embed.views;
  var DCEmbedToolbelt = window.DCEmbedToolbelt;

  data.documents = data.documents || new definition.DocumentSet();
  // views.pages is a nested list of page views, keyed at the top level
  // by document id, and then element selector.
  // e.g. views.pages['282753-lefler-thesis']['#target-container']
  // initialization of the inner object is done in DocumentCloud.embed.load
  views.pages = views.pages || {};

  if (!_.isFunction(DocumentCloud.embed.load)) {
    DocumentCloud.embed.load = function(resource, options) {
      options = options || {};

      // If passed a URL to a resource, convert it to a recognized object
      // TODO: Just pass resource straight to `recognizeResource` and have that       be smarter about being passed recognized resources.
      if (_.isString(resource)) {
        resource = DCEmbedToolbelt.recognizeResource(resource);
      }

      // Have we been passed a selector string, jQuery element, or DOM element?
      var container = options.container;
      if (_.isString(container)) {
        container = document.querySelector(container);
      } else if (container instanceof jQuery && _.isElement(container[0])) {
        // Is jQuery DOM element, pluck out DOM element
        container = container[0];
      } else if (_.isElement(container)) {
        // Is DOM element already, do nothing
      }

      if (!container) {
        console.error("DocumentCloud can't be embedded without specifying a container.");
        return;
      }

      var containerId;
      if (container.hasAttribute('id')) {
        containerId = container.getAttribute('id');
      } else {
        containerId = DCEmbedToolbelt.generateUniqueElementId(resource);
        container.setAttribute('id', containerId);
      }

      var documentId      = resource.documentId;
      var doc             = new definition.Document({id: documentId});
      var validOptionKeys = definition.PageView.prototype.validOptionKeys;
      var embedOptions    = _.extend({}, _.pick(options, validOptionKeys),
                                     resource.embedOptions,
                                     {model: doc, el: container});
      var view            = new definition.PageView(embedOptions);
      data.documents.add(doc);
      views.pages[documentId]                    = views.pages[documentId] || {};
      views.pages[documentId][containerId] = view;
      doc.fetch({url: resource.dataUrl});

      // Track where the embed is loaded from
      DCEmbedToolbelt.pixelPing(resource, '#' + containerId);

      // We tweak the interface lightly based on the width of the embed; sadly, 
      // in non-iframe contexts, this requires watching the window for resizes.
      var $el = $(container);
      var setEmbedSizeClasses = function() {
        var width = $el.width();
        if (width < 200) { $el.addClass('DC-embed-size-tiny').removeClass('DC-embed-size-small'); }
        else if (width < 400) { $el.addClass('DC-embed-size-small').removeClass('DC-embed-size-tiny'); }
        else { $el.removeClass('DC-embed-size-small DC-embed-size-tiny'); }
      };
      $(window).on('resize', setEmbedSizeClasses);
      setEmbedSizeClasses();
    };
  }

})();
