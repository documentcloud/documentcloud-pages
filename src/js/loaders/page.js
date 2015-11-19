(function(){
  var DocumentCloud   = window.DocumentCloud;
  var $               = DocumentCloud.$;
  var _               = DocumentCloud._;
  var definition      = DocumentCloud.embed.definition;
  var data            = DocumentCloud.embed.data;
  var views           = DocumentCloud.embed.views;
  var DCEmbedToolbelt = window.DCEmbedToolbelt;

  data.documents = data.documents || new definition.DocumentSet();
  // `views.pages` is a nested list of page views, keyed at the top level by
  // document slug and then by element ID (sans `#`), e.g.: 
  // `views.pages['1234-this-is-a-slug']['foo']`. You could target the element 
  // with `document.getElementById('foo')`.
  views.pages = views.pages || {};

  if (!_.isFunction(DocumentCloud.embed.load)) {
    DocumentCloud.embed.load = function(resource, options) {
      options  = options || {};
      resource = DCEmbedToolbelt.recognizeResource(resource);

      var container = DCEmbedToolbelt.ensureElement(options.container);
      if (!container) {
        console.error("DocumentCloud can't be embedded without specifying a container.");
        return;
      }

      // While we can pass the container around as an actual DOM element, we 
      // still require it have an ID by which we can key `views.pages`. If it
      // doesn't have one, generate one.
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
