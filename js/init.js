(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    $('.parallax').parallax();

    $(document).ready(function () {
      $('.collapsible').collapsible();
    });

    /* 400 px swipeable */
    /* https://github.com/Dogfalo/materialize/issues/4159 */

  }); // end of document ready
})(jQuery); // end of jQuery name space

/* 400 px swipeable */
/* https://github.com/Dogfalo/materialize/issues/4159 */
// $(function () {
//   resizeTab();
//   $(window).resize(function () { resizeTab(); });
// });
// function resizeTab() {
//   var maxHeight = 0;
//   $('.carousel-item').each(function () {
//     if ($(this).height() > maxHeight) maxHeight = $(this).height();
//   });
//   $(".tabs-content").css('height', maxHeight + 'px');
// }

document.addEventListener('DOMContentLoaded', function () {
  M.Tabs.init(document.getElementById('schedule-tabs'), { swipeable: false, duration: 60 }).select('monday')

  //document.querySelector('.tabs-content.carousel').style.height = window.innerHeight + "px";

  M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
});

// var instance = M.Tabs.init(el, options);
// swipeable.swipeable = true;