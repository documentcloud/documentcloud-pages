(function(){
  var dc       = window.dc;
  var $        = dc.$;
  var _        = dc._;
  var Backbone = dc.Backbone;

  var definition = dc.embed.definition;
  var data = dc.embed.data;
  var views = dc.embed.views;

  definition.Document = definition.Document || Backbone.Model.extend({
    initialize: function(attributes){
      this.notes = new definition.NoteSet();
      //this.resources = new definition.ResourceSet(); // doesn't exist yet.
      this.on('sync', this.updateCollections, this);
    },
    
    updateCollections: function() {
      this.notes.reset(this.get('annotations'));
    },
    
    imageUrl : function(pageNumber) {
      if (!this._imageUrl) {
        var resources = this.get('resources');
        var urlTemplate = resources['page']['image'];
        this._imageUrl = urlTemplate.replace('{size}', 'normal').replace('{page}', pageNumber);
      }
      return this._imageUrl;
    },

    textUrl : function(pageNumber) {
      if (!this._textUrl) {
        var resources = this.get('resources');
        var urlTemplate = resources['page']['text'];
        this._textUrl = urlTemplate.replace('{page}', pageNumber);
      }
      return this._textUrl;
    },
  }, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z0-9-]+).js(on)?$/)[1]; }
  });
  
  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({ 
    model: definition.Document 
  });
  
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
      }
      return this._coordinates;
    },

    // scaledCoordinates: function(scale) {
    //   var scaled = _.clone(this.coordinates());
    //   _.each(_.keys(scaled), function(key){ scaled[key] *= scale; });
    //   return scaled;
    // },

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
      return this.select(function(note){ return note.get('page') == number; });
    }
  });
})();
