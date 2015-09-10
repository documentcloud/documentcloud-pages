(function(){

  Penny.ready(function(){
    
    var composeID = function(doc, page) {
      var id = doc + '-p' + page;
      while (document.getElementById(id)) {
        id += '-r' + Math.floor((Math.random() * 100) + 1);
      }
      return id;
    };

    var convertStubs = function() {
      var stubs = document.querySelectorAll('.DC-embed-stub');
      Penny.forEach(stubs, function (stub, i) {
        var permalink = stub.querySelector('a');
        var href = permalink.getAttribute('href');
        var components = href.match(/\/documents\/([A-Za-z0-9-]+)\.html\#document\/p([0-9]+)$/);
        var document_id = components[1];
        var page_number = components[2];
        var element_id  = composeID(document_id, page_number);

        stub.className = 'DC-embed';
        stub.setAttribute('id', element_id);

        DocumentCloud.embed.loadPage('https://www.documentcloud.org/documents/' + document_id + '.json', {
          page: page_number,
          container: '#' + element_id
        });

      });
    };

    if (window.DocumentCloud) {
      convertStubs();
    } else {
      var page_embed_js = document.createElement('script');
      page_embed_js.src = "dist/page_embed.js";
      document.querySelector('body').appendChild(page_embed_js);
      Penny.on(page_embed_js, 'load', convertStubs);
    }

  });

})();
