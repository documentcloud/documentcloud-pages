(function(){
  var dc = window.dc = window.dc || {
    $: window.$.noConflict(),
    _: window._.noConflict(),
    Backbone: window.Backbone.noConflict()
  };
  dc.embed = dc.embed || { data: {}, definition: {}, views: {} };
})();
