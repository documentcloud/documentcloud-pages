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

    imageUrl : function(pageNumber, size) {
      size = size || 'normal';
      var resources = this.get('resources');
      var urlTemplate = resources['page']['image'];
      return urlTemplate.replace('{size}', size).replace('{page}', pageNumber);
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

    // Permalink to page text within platform
    permalinkPageText: function(pageNumber) {
      return this.get('canonical_url') + '#text/p' + pageNumber;
    },

    // URL for page text file
    pageTextResourceUrl: function(pageNumber) {
      var resources = this.get('resources');
      return resources['page']['text'].replace('{page}', pageNumber);
    },

    contributorSearchUrl: function() {
      return this.get('account_search_url');
    },

    organizationSearchUrl: function() {
      return this.get('organization_search_url');
    },

  });

  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({
    model: definition.Document
  });

})();
