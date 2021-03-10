/**
 * Enable Boostrap Popovers
 * https://getbootstrap.com/docs/4.1/components/popovers/
 */
$(function enablePopovers() {
  $('[data-toggle="popover"]').popover({
    container: 'body'
  });
});

/**
 * Stop anchor tags from redirecting page if they're meant to toggle modals
 */
// $('.btn[href^=#]').click(function(e){
//   e.preventDefault();
//   var href = $(this).attr('href');
//   $(href).modal('toggle');
// });