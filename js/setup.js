(function(){
  var DocumentCloud = window.DocumentCloud = window.DocumentCloud || {
    $: window.$.noConflict(),
    _: window._.noConflict(),
    Backbone: window.Backbone.noConflict()
  };
  DocumentCloud.embed = DocumentCloud.embed || { data: {}, definition: {}, views: {} };
})();
