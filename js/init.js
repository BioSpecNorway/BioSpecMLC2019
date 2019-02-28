// Initialize Firebase
var config = {
  apiKey: "AIzaSyADm1pGfwlso3rwWipDY2h1cWqGMyF-pcg",
  authDomain: "biospecmlc2019-registration.firebaseapp.com",
  databaseURL: "https://biospecmlc2019-registration.firebaseio.com",
  projectId: "biospecmlc2019-registration",
  storageBucket: "biospecmlc2019-registration.appspot.com",
  messagingSenderId: "278961283165"
};
firebase.initializeApp(config);
var firestore = firebase.firestore();

(function ($) {
  $(function () {

    $('.sidenav').sidenav();
    // $('.parallax').parallax();

    // $(document).ready(function () {
    //   $('.collapsible').collapsible();
    // });

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
  M.Tabs.init(document.getElementById('schedule-tabs'), { swipeable: false, duration: 60 })
  M.Tabs.init(document.getElementById('committee-tabs'), { swipeable: false, duration: 60 })

  //document.querySelector('.tabs-content.carousel').style.height = window.innerHeight + "px";
  M.Parallax.init(document.querySelectorAll('.parallax'), {});

  M.Collapsible.init(document.querySelectorAll('.collapsible'), {});

  var speakers_carousel = M.Carousel.init(document.getElementById('speakers-carousel'), {shift: 100, numVisible: 3, indicators: true});
  speakers_carousel.set(3);
});

// var instance = M.Tabs.init(el, options);
// swipeable.swipeable = true;