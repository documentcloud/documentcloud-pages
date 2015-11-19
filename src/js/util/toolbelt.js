(function(){

  var DocumentCloud = window.DocumentCloud;
  var Penny         = window.Penny;

  if (DocumentCloud && DocumentCloud._) {
    // Use Underscore if it's available...
    var _ = DocumentCloud._;
  } else if (Penny) {
    // ...but fall back to Penny, which has the bits of Underscore we need here.
    var _ = Penny;
  } else {
    console.error("DocumentCloud embed can't load because of missing components.");
    return false;
  }

  // DCEmbedToolbelt is a small library of components shared between both 
  // the enhance.js embed loader and actual embed libraries. It should remain 
  // very small. It depends on `logger.js` and either `setup.js` (for 
  // Underscore) or Penny.
  var DCEmbedToolbelt = window.DCEmbedToolbelt = window.DCEmbedToolbelt || {

    // Sugar for making sure we've recognized a thing as a resource.
    isResource: function(thing) {
      return !!(_.has(thing, 'resourceType'));
    },

    // Given a valid URL to a DocumentCloud resource, returns an object 
    // identifying the resource's type, the environment of the resource being 
    // requested, and some resource-specific URL components.
    recognizeResource: function(originalResource) {

      if (this.isResource(originalResource)) {
        return originalResource;
      }

      var domainEnvPatterns = {
        production:  'www\.documentcloud\.org',
        staging:     'staging\.documentcloud\.org',
        development: 'dev\.dcloud\.org'
      };
      var domains = _.values(domainEnvPatterns).join('|');
      var docBase = '(' + domains + ')\/documents\/([0-9]+)-([a-z0-9-]+)';
      var resourceTypePatterns = {
        'document': [
          docBase + '\.(?:html|js|json)$'
        ],
        page: [
          docBase + '\.html#document\/p([0-9]+)$',         // Current
          docBase + '\/pages\/([0-9]+)\.(?:html|js|json)$' // Future?
        ],
        note: [
          docBase + '\/annotations\/([0-9]+)\.(?:html|js|json)$',
          docBase + '\.html#document\/p[0-9]+\/a([0-9]+)$',
          docBase + '\.html#annotation\/a([0-9]+)$'
        ]
      };

      // Figure out which JSON endpoint to hit to access data for a given resource
      var makeDataUrl = function(resource) {
        var urlComponents;

        switch (resource.resourceType) {
          case 'document':
            urlComponents = [resource.domain, 'documents', resource.documentSlug];
            break;
          case 'page':
            urlComponents = [resource.domain, 'documents', resource.documentSlug];
            break;
          case 'note':
            urlComponents = [resource.domain, 'documents', resource.documentSlug, 'annotations', resource.noteId];
            break;
        }

        return '//' + urlComponents.join('/') + '.json';
      };

      var resource = {};
      _.each(resourceTypePatterns, function(patterns, resourceType) {
        if (!_.isEmpty(resource)) { return; } // `_.each` can't be broken out of
        _.each(patterns, function(pattern) {
          if (!_.isEmpty(resource)) { return; } // `_.each` can't be broken out of
          var match = originalResource.match(pattern);
          if (match) {
            // Resource-agnostic properties
            resource = {
              resourceUrl:  originalResource,
              resourceType: resourceType,
              environment:  _.findKey(domainEnvPatterns, function(domain, env) {
                return originalResource.match(domain);
              }),
              domain:       match[1],
              documentId:   match[2],
              documentSlug: match[2] + '-' + match[3],
            };
            // Resource-specific properties
            switch (resourceType) {
              case 'document':
                resource.trackingId = resource.documentId;
                break;
              case 'page':
                resource.pageNumber = match[4];
                resource.trackingId = resource.documentId + 'p' + resource.pageNumber;
                resource.embedOptions = {
                  page: resource.pageNumber
                };
                break;
              case 'note':
                resource.trackingId = resource.noteId = match[4];
                break;
            }
            resource.dataUrl = makeDataUrl(resource);
          }
        });
      });
      return resource;
    },

    // Many times, we want a function to be able to receive either a string 
    // selector or a DOM element (or even a jQuery element). This function lets 
    // you pass a parameter in and get out a DOM element.
    ensureElement: function(thing) {
      if (_.isElement(thing)) {
        // Is DOM element already; return it
        return thing;
      } else if (_.isString(thing)) {
        // Is a selector; find and return DOM element
        return document.querySelector(thing);
      } else if (thing instanceof jQuery && _.isElement(thing[0])) {
        // Is jQuery element; pluck out and return DOM element
        return thing[0];
      }
      return null;
    },

    // Generates a unique ID for a resource, checks the DOM for any existing
    // element with that ID, then increments and tries again if it finds one.
    generateUniqueElementId: function(resource) {
      var i  = 1;
      var id = 'DC-' + resource.documentSlug;
      switch (resource.resourceType) {
        case 'document':
          id += '-i' + i;
          break;
        case 'page':
          id += '-p' + resource.pageNumber + '-i' + i;
          break;
        case 'note':
          id += '-a' + resource.noteId + '-i' + i;
          break;
      }
      while (document.getElementById(id)) {
        id = id.replace(/-i[0-9]+$/, '-i' + i++);
      }
      return id;
    },

    // http://stackoverflow.com/a/21965342/5071070
    isIframed: function() {
      try {
          return window.self !== window.top;
      } catch (e) {
          return true;
      }
    },

    // We want to know where the resource is embedded in an iframe-safe way.
    // I.e., when wrapped in an iframe, we want the parent page's URL, not the 
    // iframe's URL. We also want to strip off any hash, query params, and 
    // ending slash to unify the results.
    getSourceUrl: function() {
      var source, sourceUrl;

      if (this.isIframed()) {
        // NB: Since we can't rely on accessing the parent page's URL using 
        // `window.top` or `window.parent` thanks to same-origin requirements, 
        // we have to use `document.referrer`, which has two limitations:
        // - Deep-iframed pages (grandchildren) can't access grandparents, and 
        //   so will return the URL of their own parent
        // - If the child page navigates away, the `referrer` is now the 
        //   original child, not the parent
        // Despite these limitations, it's still the most practical answer.
        source      = document.createElement('A');
        source.href = document.referrer;
      } else {
        source      = window.location;
      }
      sourceUrl = source.protocol + '//' + source.host;

      // Use `pathname` to effectively strip off hash and query params. But! In
      // IE, `createElement`-generated URLs won't have an absolute `pathname`,
      // so we must prefix it manually.
      if (source.pathname.indexOf('/') !== 0) {
        sourceUrl += '/';
      };
      sourceUrl += source.pathname;

      // Treat `foo.com/bar/` and `foo.com/bar` as the same URL
      sourceUrl = sourceUrl.replace(/[\/]+$/, '');

      return sourceUrl;
    },

    // Given a resource or resource URL, composes and inserts a tracking pixel 
    // adjacent to the specified container (which can be a DOM element or 
    // selector string).
    pixelPing: function(resource, container) {
      resource  = this.recognizeResource(resource);
      container = this.ensureElement(container);

      var pingUrl   = '//' + resource.domain + '/pixel.gif';
      var sourceUrl = this.getSourceUrl();
      var key       = encodeURIComponent(resource.resourceType + ':' + resource.trackingId + ':' + sourceUrl);
      var image     = '<img src="' + pingUrl + '?key=' + key + '" width="1" height="1" alt="Anonymous hit counter for DocumentCloud">';
      container.insertAdjacentHTML('afterend', image);
    }
  };

})();
