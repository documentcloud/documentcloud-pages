(function(){
  var DocumentCloud = window.DocumentCloud = window.DocumentCloud || {};

  DocumentCloud.$        = DocumentCloud.$        || window.jQuery.noConflict()
  DocumentCloud._        = DocumentCloud._        || window._.noConflict(),
  DocumentCloud.Backbone = DocumentCloud.Backbone || window.Backbone.noConflict()
  DocumentCloud.embed    = DocumentCloud.embed    || {data: {},definition: {},views: {}};
})();
