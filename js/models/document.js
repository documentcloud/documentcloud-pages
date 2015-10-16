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
      if (_.isUndefined(this._contributorSearchUrl)) {
        var slug = this.get('contributor_slug');
        var host = 'www.documentcloud.org'; // hard coded for the moment
        this._contributorSearchUrl = slug ? ('//'+host+'/public/search/Account:' + slug) : false;
      }
      return this._contributorSearchUrl;
    },

    organizationSearchUrl: function() {
      if (_.isUndefined(this._organizationSearchUrl)) {
        var slug = this.get('contributor_organization_slug');
        var host = 'www.documentcloud.org'; // hard coded for the moment
        this._organizationSearchUrl = slug ? ('//'+host+'/public/search/Group:' + slug) : false;
      }
      return this._organizationSearchUrl;
    },

  }, {
    extractId: function(url){ return url.match(/(\d+[A-Za-z0-9-]+).js(on)?$/)[1]; }
  });

  definition.DocumentSet = definition.DocumentSet || Backbone.Collection.extend({
    model: definition.Document
  });

})();
