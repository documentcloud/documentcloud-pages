(function(){
  if (window.DocumentCloud) {
    var $ = DocumentCloud.$;
    var _ = DocumentCloud._;

    // Cache width indicators and their parents so we don't have to do
    // expensive DOM lookups during `resize`;
    var $widths = $('.width');
    $widths.each(function(){
      $(this).data('target', $(this).closest('.width-target'));
    });
    var updateColWidths = _.debounce(function(){
      $widths.each(function(){
        $(this).text( $(this).data('target').css('width') );
      });
    }, 100);
    $(window).on('resize', updateColWidths);
    updateColWidths();

    // Live option changing
    $('.option').on('change', function(){
      var optionName = $(this).data('option');
      var optionVal  = $(this).prop('checked');
      _.each(DocumentCloud.embed.views.pages, function(containers, documentId) {
        _.each(containers, function(view, elementId) {
          if (view.openNote) {
            view.openNote.close();
          }
          view.options[optionName] = optionVal;
          view.$el.html(view.render());
        });
      });
    });

    // Ajax-inserted embed code test
    $.get('embed_code.html', function(data) {
      $('.embed_via_ajax').html(data);
    });

  }
})();
