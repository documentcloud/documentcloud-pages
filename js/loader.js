(function(){

  Penny.ready(function(){

    // Insert the necessary stylesheet into the head, unless it's already there.
    var insertStylesheet = function() {
      if (!document.querySelector('link[href$="page_embed.css"]')) {
        var stylesheet   = document.createElement('link');
        stylesheet.rel   = 'stylesheet';
        stylesheet.type  = 'text/css';
        stylesheet.media = 'screen';
        stylesheet.href  = 'dist/page_embed.css';
        document.querySelector('head').appendChild(stylesheet);
      }
    };

    // Insert the necessary JavaScript into the body, unless it's already there.
    var insertJavaScript = function(onLoadCallback) {
      if (!document.querySelector('script[src$="page_embed.js"]')) {
        var page_embed_js = document.createElement('script');
        page_embed_js.src = "dist/page_embed.js";
        Penny.on(page_embed_js, 'load', onLoadCallback);
        document.querySelector('body').appendChild(page_embed_js);
      }
    };

    // Generates a unique ID for a given page, checks the DOM for any existing
    // element with that ID, then increments and tries again if it finds one.
    var generateUniquePageElementId = function(documentSlug, pageNumber) {
      var i = 1;
      var id = documentSlug + '-p' + pageNumber + '-i' + i;
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
      var stubs = document.querySelectorAll('.DC-embed-stub');
      Penny.forEach(stubs, function (stub, i) {
        var href = stub.querySelector('.DC-embed-resource').getAttribute('href');
        // TODO: Recognize resource type based on URL pattern and load
        //       appropriate embed mechanism.
        var components = href.match(/\/documents\/([A-Za-z0-9-]+)\.html\#document\/p([0-9]+)$/);
        if (components) {
          var documentSlug = components[1];
          var pageNumber   = components[2];
          var elementId    = generateUniquePageElementId(documentSlug, pageNumber);

          // Changing the class name means subsequent runs of the loader won't 
          // recognize this element as a stub and thus won't enhance it again.
          stub.className = 'DC-embed';
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
    insertStylesheet();
    if (window.DocumentCloud) {
      enhanceStubs();
    } else {
      insertJavaScript(enhanceStubs);
    }

  });

})();
