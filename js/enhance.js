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
    var generateUniqueElementId = function(resourceType, components) {
      var i  = 1;
      var id = '';
      switch (resourceType) {
        case 'page':
          id = components.documentSlug + '-p' + components.pageNumber + '-i' + i;
          break;
      }
      while (document.getElementById(id)) {
        id = id.replace(/-i[0-9]+$/, '-i' + i++);
      }
      return id;
    };

    // Takes an embed stub (the entire DOM element) and looks for a 
    // `data-options` attribute that contains a JSON representation of options.
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

    // Convert embed stubs to real live embeds. If this fails, stubs remain 
    // usable as effectively `noscript` representations of the embed.
    var enhanceStubs = function() {
      var stubs = document.querySelectorAll('.DC-embed');
      Penny.forEach(stubs, function (stub, i) {
        var href = stub.querySelector('.DC-embed-resource').getAttribute('href');
        // TODO: Recognize resource type based on URL pattern and load
        //       appropriate embed mechanism.
        var components = href.match(/\/documents\/([A-Za-z0-9-]+)\.html\#document\/p([0-9]+)$/);
        if (components) {
          var documentSlug = components[1];
          var pageNumber   = components[2];
          var elementId    = generateUniqueElementId('page', {
            documentSlug: documentSlug,
            pageNumber:   pageNumber
          });

          // Changing the class name means subsequent runs of the loader will
          // recognize this element has already been enhanced and won't redo it.
          stub.className = 'DC-embed-enhanced';
          stub.setAttribute('data-resource-type', 'page');
          stub.setAttribute('id', elementId);

          var embedOptions       = extractOptionsFromStub(stub);
          embedOptions.page      = pageNumber;
          embedOptions.container = '#' + elementId;

          DocumentCloud.embed.loadPage(
            '//www.documentcloud.org/documents/' + documentSlug + '.json',
            embedOptions
          );
        } else {
          console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");
        }
      });
    };

    // Definitions are complete. Do things!
    insertStylesheet('dist/page_embed.css');
    if (window.DocumentCloud) {
      enhanceStubs();
    } else {
      insertJavaScript('dist/page_embed.js', enhanceStubs);
    }

  });

})();
