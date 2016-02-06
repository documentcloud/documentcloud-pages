(function(){
  var DCEmbedToolbelt = window.DCEmbedToolbelt;
  var DocumentCloud   = window.DocumentCloud;
  var $               = DocumentCloud.$;
  var _               = DocumentCloud._;

  var definition      = DocumentCloud.embed.definition;
  var data            = DocumentCloud.embed.data;
  var views           = DocumentCloud.embed.views;

  data.documents = data.documents || new definition.DocumentSet();
  // `views.pages` is a nested list of page views, keyed at the top level by
  // document ID and then by element ID (sans `#`), e.g.: 
  // `views.pages['1234']['foo']`. You could target the element with
  // `document.getElementById('foo')`.
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

      var isIframed = DCEmbedToolbelt.isIframed();
      if (isIframed) {
        $('html').addClass('DC-embed-iframe');
      }

      var documentId = resource.documentId;
      var doc        = new definition.Document({id: documentId});
      doc.fetch({
        url: resource.dataUrl,
        success: function() {
          // We don't want the top-level container to be our view element, so 
          // create one.
          var viewElementId   = DCEmbedToolbelt.generateUniqueElementId(resource);
          container.innerHTML = '<div id="' + viewElementId + '" class="DC-embed-view"></div>';
          var viewElement     = document.getElementById(viewElementId);

          // Create page view
          var pagePrototype   = definition.PageView.prototype;
          var validOptionKeys = pagePrototype.validOptionKeys;
          var embedOptions    = _.extend({}, _.pick(options, validOptionKeys),
                                         resource.embedOptions,
                                         {model: doc, el: viewElement});
          var view            = new definition.PageView(embedOptions);

          // Store doc model and page view on globals
          data.documents.add(doc);
          views.pages[documentId]                = views.pages[documentId] || {};
          views.pages[documentId][viewElementId] = view;

          // Track where the embed is loaded from
          if (options.preview !== true) {
            DCEmbedToolbelt.pixelPing(resource, viewElement);
          }

          if (!isIframed) {
            // We tweak the interface lightly based on the width of the embed; 
            // in non-iframe contexts, this requires observing window resizes.
            var $el = $(viewElement);
            var sizeBreakpoints = pagePrototype.sizeBreakpoints;
            var setEmbedSizeClasses = _.debounce(function(e) {
              var width = $el.width();
              _.each(sizeBreakpoints, function(breakpoints, i) {
                $el.toggleClass('DC-embed-size-' + i, (width >= breakpoints[0] && width <= breakpoints[1]));
              });
            }, 250);
            $(window).on('resize', setEmbedSizeClasses);
            setEmbedSizeClasses();
          }
        },
        error: function(model, response) {
          var icon, message, replace;
          switch (response.status) {
            case 403:
              icon    = 'lock';
              message = 'This DocumentCloud document is private and can only be viewed by its owner.';
              replace = 'all';
              break;
            case 404:
              icon    = 'help';
              message = 'DocumentCloud can’t find this document.';
              replace = 'image';
              break;
            default:
              icon    = 'cancel';
              message = 'DocumentCloud can’t load this document.';
              replace = 'image';
              break;
          }
          message = '<div class="DC-embed-unloadable"><i class="DC-icon DC-icon-' + icon + '"></i> ' + message + '</div>';

          switch (replace) {
            case 'all':
              container.innerHTML = message;
              break;
            default:
              container.querySelector('img').outerHTML = message;
              break;
          }
          // TODO: Notify us of the load error via pixel ping or something [JR]
        }
      });
    };
  }

})();
