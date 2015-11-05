(function(){

  Penny.ready(function(){

    // Insert the necessary stylesheet into the head, unless it's already there.
    var insertStylesheet = function(href) {
      if (!document.querySelector('link[href$="' + href + '"]')) {
        var stylesheet   = document.createElement('link');
        stylesheet.rel   = 'stylesheet';
        stylesheet.type  = 'text/css';
        stylesheet.media = 'screen';
        stylesheet.href  = href;
        document.querySelector('head').appendChild(stylesheet);
      }
    };

    // Insert the necessary JavaScript into the body, unless it's already there.
    var insertJavaScript = function(src, onLoadCallback) {
      if (!document.querySelector('script[src$="' + src + '"]')) {
        var page_embed_js = document.createElement('script');
        page_embed_js.src = src;
        Penny.on(page_embed_js, 'load', onLoadCallback);
        document.querySelector('body').appendChild(page_embed_js);
      }
    };

    // Generates a unique ID for a resource, checks the DOM for any existing
    // element with that ID, then increments and tries again if it finds one.
    var generateUniqueElementId = function(resourceData) {
      var i  = 1;
      var id = '';
      switch (resourceData.type) {
        case 'page':
          id = resourceData.documentSlug + '-p' + resourceData.pageNumber + '-i' + i;
          break;
      }
      while (document.getElementById(id)) {
        id = id.replace(/-i[0-9]+$/, '-i' + i++);
      }
      return id;
    };

    // Takes an embed stub DOM element and looks for a `data-options` attribute 
    // that contains a JSON representation of options.
    var extractOptionsFromStub = function(stub) {
      var options = stub.getAttribute('data-options');
      if (options) {
        try {
          options = JSON.parse(options);
        }
        catch(err) {
          console.error("Inline DocumentCloud embed options must be valid JSON. See https://www.documentcloud.org/help/publishing.");
          options = {};
        }
      } else {
        options = {};
      }
      return options;
    };

    // Takes either an embed stub DOM element or an embeddable resource URL,
    // returns a resource-specific hash used to enhance and embed the stub.
    var extractResourceData = function(resource) {
      var href, result;

      if (resource.nodeName === 'A') {
        href = resource.getAttribute('href');
      } else {
        href          = resource;
        resource      = document.createElement('A');
        resource.href = href;
      }

      // TODO: Recognize resource type based on URL pattern and load
      //       appropriate embed mechanism.
      var components = href && href.match(/\/documents\/([A-Za-z0-9-]+)\.html\#document\/p([0-9]+)$/);
      if (components) {
        var documentSlug = components[1];
        var path         = '/documents/' + documentSlug + '.json';
        result           = {
          type:         'page',
          host:         resource.host,
          path:         path,
          documentSlug: documentSlug,
          pageNumber:   components[2],
          resourceURL:  resource.protocol + '//' + resource.host + path,
          embedOptions: {
            page: components[2],
          },
        };
      } else {
        console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");
      }
      return result;
    };

    // Convert embed stubs to real live embeds. If this fails, stubs remain 
    // usable as effectively `noscript` representations of the embed.
    var enhanceStubs = function() {
      var stubs = document.querySelectorAll('.DC-embed');
      Penny.forEach(stubs, function (stub, i) {
        if (stub.className.indexOf('DC-embed-enhanced') != -1) { return; }
        var resourceElement = stub.querySelector('.DC-embed-resource');
        var resourceData    = extractResourceData(resourceElement);
        if (resourceData) {
          var elementId = generateUniqueElementId(resourceData);

          // Changing the class name means subsequent runs of the loader will
          // recognize this element has already been enhanced and won't redo it.
          stub.className += ' DC-embed-enhanced';
          stub.setAttribute('data-resource-type', resourceData.type);
          stub.setAttribute('id', elementId);

          // Options come from three places:
          // 1. JSON hash passed in via the stub's `data-options` attribute
          // 2. Resource-specific options composed in `extractResourceData()`
          // 3. Resource-agnostic options
          var embedOptions = Penny.extend({},
            extractOptionsFromStub(stub),
            resourceData.embedOptions,
            {
              container: '#' + elementId,
            }
          );

          DocumentCloud.embed.loadPage(
            '//' + resourceData.host + resourceData.path,
            embedOptions
          );
        } else {
          console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");
        }
      });
    };

    // Combine local defaults with global config options
    var chooseAssetPaths = function() {
      var defaultAssetPaths = {
        page: {
          app:   "/dist/page_embed.js",
          style: "/dist/page_embed.css"
        }
      };
      try { var configAssetPaths = window.ENV.config.embed.assetPaths; }
      catch (e) { var configAssetPaths = {}; }
      return Penny.extend({}, defaultAssetPaths, configAssetPaths);
    };

    // Definitions are complete. Do things!

    // TODO: Support more resource types; will have to scan the DOM for all
    //       embed types before enhancing.
    var assetPaths = chooseAssetPaths();
    insertStylesheet(assetPaths.page.style);
    if (window.DocumentCloud) {
      enhanceStubs();
    } else {
      insertJavaScript(assetPaths.page.app, enhanceStubs);
    }

  });

})();
