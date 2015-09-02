(function(){
  var dcloud = window.dcloud = window.dcloud || {
    $: window.$.noConflict(),
    _: window._.noConflict(),
    Backbone: window.Backbone.noConflict()
  };
  dcloud.embed = dcloud.embed || { data: {}, definition: {}, views: {} };
})();
