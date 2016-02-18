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
      return urlTemplate.replace('{size}', size).replace('{page}', pageNumber).replace(/^https?:/, '');
    },

    textUrl : function(pageNumber) {
      var resources = this.get('resources');
      return resources['text'];
    },

    hasMultiplePages: function() {
      return this.get('pages') > 1;
    },

    publishedUrl: function() {
      var resources = this.get('resources');
      return resources['published_url'] || this.get('canonical_url');
    },

    publishedUrlPage: function(pageNumber) {
      return this.publishedUrl() + '#document/p' + pageNumber;
    },

    // Link to page text within platform. Composed with `canonical_url`, not
    // `published_url`, because `published_url` might land us on remote page 
    // where text mode is disabled.
    pageTextUrl: function(pageNumber) {
      return this.get('canonical_url') + '#text/p' + pageNumber;
    },

    // URL for page text file
    pageTextFileUrl: function(pageNumber) {
      var resources = this.get('resources');
      return resources['page']['text'].replace('{page}', pageNumber);
    },

  });

  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({
    model: definition.Document
  });

})();
