(function(){
  var DocumentCloud = window.DocumentCloud;
  var $             = DocumentCloud.$;
  var _             = DocumentCloud._;
  var Backbone      = DocumentCloud.Backbone;

  var definition = DocumentCloud.embed.definition;
  var data       = DocumentCloud.embed.data;
  var views      = DocumentCloud.embed.views;

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
      var resources = this.get('resources');
      var urlTemplate = resources['page']['image'];
      return urlTemplate.replace('{size}', 'normal').replace('{page}', pageNumber);
    },

    textUrl : function(pageNumber) {
      var resources = this.get('resources');
      var urlTemplate = resources['page']['text'];
      return urlTemplate.replace('{page}', pageNumber);
    },

    hasMultiplePages: function() {
      return this.get('pages') > 1;
    },

    permalink: function() {
      return this.get('canonical_url');
    },

    permalinkPage: function(pageNumber) {
      return this.get('canonical_url') + '#document/p' + pageNumber;
    },

    permalinkPageText: function(pageNumber) {
      return this.get('canonical_url') + '#text/p' + pageNumber;
    },

    credit: function() {
      var contributor  = this.get('contributor');
      var organization = this.get('contributor_organization');

      var _credit = 'Contributed by ';
      if (contributor) { _credit += contributor; }
      if (organization && organization != contributor) { _credit += (' of ' + organization); }
      return _credit;
    },

  }, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z0-9-]+).js(on)?$/)[1]; }
  });
  
  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({ 
    model: definition.Document 
  });
  
})();
