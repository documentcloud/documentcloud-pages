/*!
 * Penny 0.0.0
 * Sometimes you only need a fraction of a $ or _.
 * Thanks to http://youmightnotneedjquery.com, Underscore, and Stack Overflow.
 *
 * The version number is not a typo, it's a statement: you should not use Penny.
 * It is not a library, it is a customized minimal set of functions for a very
 * specific use case. You should totally make your own Penny for your own case.
 *
 * @license (c) 2015 Justin Reese, DocumentCloud
 * Penny may be freely distributed under the MIT license, but why would you?
 *
 */

(function(){

  var Penny = window.Penny = window.Penny || {

    VERSION: '0.0.0',

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

    each: function (collection, fn) {
      if (collection != null && typeof collection === 'object') {
        for (var key in collection) {
          if (Penny.has(collection, key)) {
            fn(collection[key], key);
          }
        }
      } else {
        var len = collection.length;
        for (i = 0; i < len; i++) {
          fn(collection[i], i);
        }
      }
    },

    has: function(obj, key) {
      return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
    },

    values: function (obj) {
      var values = [];
      for (var key in obj) {
        if (Penny.has(obj, key)) {
          values.push(obj[key]);
        }
      }
      return values;
    },

    keys: function (obj) {
      var keys = [];
      for (var key in obj) {
        if (Penny.has(obj, key)) {
          keys.push(obj[key]);
        }
      }
      return keys;
    },

    findKey: function(obj, fn) {
      for (var key in obj) {
        if (Penny.has(obj, key)) {
          if (fn(obj[key], key)) {
            return key;
          }
        }
      }
      return null;
    },

    extend: function(out) {
      out = out || {};

      for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) {
          continue;
        }

        for (var key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            out[key] = arguments[i][key];
          }
        }
      }

      return out;
    },

    isString: function(thing) {
      return !!(typeof thing === 'string');
    },

    isElement: function(thing) {
      return !!(thing && thing.nodeType === 1);
    },

    // http://stackoverflow.com/a/4994244/5071070
    isEmpty: function(obj) {
      // null and undefined are "empty"
      if (obj == null) { return true; }

      // Assume if it has a length property with a non-zero value
      // that that property is correct.
      if (obj.length > 0)    { return false; }
      if (obj.length === 0)  { return true; }

      // Otherwise, does it have any properties of its own?
      // Note that this doesn't handle
      // toString and valueOf enumeration bugs in IE < 9
      for (var key in obj) {
        if (Penny.has(obj, key)) { return false; }
      }

      return true;
    },

  };

}());
