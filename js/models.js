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
  }, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z-]+).js(on)?$/)[1]; }
  });
  
  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({ 
    model: definition.Document 
  });
  
  definition.Note = Backbone.Model.extend({
    coordinates: function(force){
      if (!this._coordinates || force) {
        var css = _.map(this.get('location').image.split(','), function(num){ return parseInt(num, 10); });
        this._coordinates = {
          top:    css[0],
          left:   css[3],
          right:  css[1],
          height: css[2] - css[0],
          width:  css[1] - css[3]
        };
      }
      return this._coordinates;
    },
    scaledCoordinates: function(scale) {
      var scaled = _.clone(this.coordinates());
      _.each(_.keys(scaled), function(key){ scaled[key] *= scale; });
      return scaled;
    }
  });
  
  definition.NoteSet = Backbone.Collection.extend({
    model: definition.Note,
    forPage: function(number) {
      return this.select(function(note){ return note.get('page') == number; });
    }
  });
})();
