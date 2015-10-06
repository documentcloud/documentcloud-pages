(function(){

  Penny.ready(function(){

    var generateUniqueElementId = function(doc, page) {
      var i = 1;
      var id = doc + '-p' + page + '-i' + i;
      while (document.getElementById(id)) {
        id = id.replace(/-i[0-9]+$/, '-i' + i++);
      }
      return id;
    };

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

    var enhanceStubs = function() {
      var stubs = document.querySelectorAll('.DC-embed-stub');
      Penny.forEach(stubs, function (stub, i) {
        var href        = stub.querySelector('.DC-embed-resource').getAttribute('href');
        // TODO: Recognize resource type based on URL pattern and load
        //       appropriate embed mechanism.
        var components  = href.match(/\/documents\/([A-Za-z0-9-]+)\.html\#document\/p([0-9]+)$/);
        if (components) {
          var document_id = components[1];
          var page_number = components[2];
          var element_id  = generateUniqueElementId(document_id, page_number);

          stub.className = 'DC-embed';
          stub.setAttribute('id', element_id);

          var embedOptions       = extractOptionsFromStub(stub);
          embedOptions.page      = page_number;
          embedOptions.container = '#' + element_id;

          DocumentCloud.embed.loadPage(
            '//www.documentcloud.org/documents/' + document_id + '.json',
            embedOptions
          );
        } else {
          console.error("The DocumentCloud URL you're trying to embed doesn't look right. Please generate a new embed code.");
        }
      });
    };

    if (!document.querySelector('link[href$="page_embed.css"]')) {
      var stylesheet   = document.createElement('link');
      stylesheet.rel   = 'stylesheet';
      stylesheet.type  = 'text/css';
      stylesheet.media = 'screen';
      stylesheet.href  = 'dist/page_embed.css';
      document.querySelector('head').appendChild(stylesheet);
    }

    if (window.DocumentCloud) {
      enhanceStubs();
    } else if (!document.querySelector('script[src$="page_embed.js"]')) {
      var page_embed_js = document.createElement('script');
      page_embed_js.src = "dist/page_embed.js";
      Penny.on(page_embed_js, 'load', enhanceStubs);
      document.querySelector('body').appendChild(page_embed_js);
    }

  });

})();
