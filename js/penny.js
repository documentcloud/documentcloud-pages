// Penny 0.1.0
// Simmer jQuery until reduced to just the parts we need.
// Many, many thanks to http://youmightnotneedjquery.com.
// (c) 2015 Justin Reese, DocumentCloud
// Penny may be freely distributed under the MIT license.

(function(){

  var Penny = window.Penny = window.Penny || {

    VERSION: '0.1.0',

    on: function (el, eventName, handler) {
      if (el.addEventListener) {
        el.addEventListener(eventName, handler);
      } else {
        el.attachEvent('on' + eventName, function() {
          handler.call(el);
        });
      }
    },

    ready: function (fn) {
      if (document.readyState != 'loading') {
        fn();
      } else if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', fn);
      } else {
        document.attachEvent('onreadystatechange', function() {
          if (document.readyState != 'loading') {
            fn();
          }
        });
      }
    },

    forEach: function (array, fn) {
      for (i = 0; i < array.length; i++) {
        fn(array[i], i);
      }
    },

  };

}());
