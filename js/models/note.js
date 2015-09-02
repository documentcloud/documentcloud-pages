(function(){
  var dcloud   = window.dcloud;
  var $        = dcloud.$;
  var _        = dcloud._;
  var Backbone = dcloud.Backbone;

  var definition = dcloud.embed.definition;
  var data = dcloud.embed.data;
  var views = dcloud.embed.views;

  definition.Note = Backbone.Model.extend({

    permalink: function() {
      var id    = this.get('id');
      var page  = this.get('page');
      var url   = this.get('canonical_url');
      var start = url.indexOf('/annotations/');

      return url.substring(0, start) + '.html#document/p' + page + '/a' + id;
    },

    // Parses the coordinates in pixel value and calculates pixel width/height
    coordinates: function(force){
      if (!this._coordinates || force) {
        var css = _.map(this.get('location').image.split(','), function(num){ return parseInt(num, 10); });
        this._coordinates = {
          top:    css[0],
          left:   css[3],
          right:  css[1],
          height: css[2] - css[0],
          width:  css[1] - css[3],
        };
        this.transformCoordinatesToLegacy();
      }
      return this._coordinates;
    },

    // The existing note viewer transforms stored note dimensions before 
    // rendering. Replicate those transformations here for compatibility.
    transformCoordinatesToLegacy: function() {
      var adjustments = {
        top:    1,
        left:   -2,
        width:  -8,
      };
      this._coordinates = _.mapObject(this._coordinates, function(val, key) {
        return _.has(adjustments, key) ? val + adjustments[key] : val;
      });
    },

    // Calculate the coordinates as a fraction of the parent. E.g. a 100px wide
    // note on a 500px wide page has a width of `0.2`.
    fractionalCoordinates: function(pageDimensions) {
      var _coordinates = this.coordinates();
      return {
        top: (_coordinates.top / pageDimensions.height),
        left: (_coordinates.left / pageDimensions.width),
        right: (_coordinates.right / pageDimensions.width),
        height: (_coordinates.height / pageDimensions.height),
        width: (_coordinates.width / pageDimensions.width),
      };
    },

    // Convert the fractional coordinates (e.g., `0.2`) into percentage strings
    // (e.g., `'200%'`).
    percentageCoordinates: function(pageDimensions) {
      var _coordinates = this.fractionalCoordinates(pageDimensions);
      return _.mapObject(_coordinates, function(coordinate) {
        return coordinate * 100 + '%';
      });
    },

    // Compose coordinates necessary to position the note excerpt image. Tricky 
    // math.
    imageCoordinates: function(pageDimensions) {
      var _coordinates = this.fractionalCoordinates(pageDimensions);
      return {
        width: 1 / _coordinates.width * 100 + '%',
        left: _coordinates.left/_coordinates.width * -100 + '%',
        top: _coordinates.top/_coordinates.height * -100 + '%',
      };
    },

  });
  
  definition.NoteSet = Backbone.Collection.extend({
    model: definition.Note,
    forPage: function(number) {
      return this.select(function(note){
        return note.has('location') && note.get('page') == number;
      });
    }
  });
})();
