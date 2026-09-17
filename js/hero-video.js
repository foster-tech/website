(function () {
  'use strict';

  var video = document.querySelector('.hero-video');
  if (!video) return;

  function showPlayingVideo() {
    video.classList.remove('is-autoplay-pending', 'is-autoplay-blocked');
  }

  function showPosterFallback() {
    video.classList.remove('is-autoplay-pending');
    video.classList.add('is-autoplay-blocked');
  }

  function attemptAutoplay() {
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('muted', '');

    var playback;
    try {
      playback = video.play();
    } catch (error) {
      showPosterFallback();
      return;
    }

    if (playback && typeof playback.then === 'function') {
      playback.then(showPlayingVideo).catch(showPosterFallback);
    }
  }

  video.addEventListener('playing', showPlayingVideo);
  video.addEventListener('error', showPosterFallback);
  window.addEventListener('pageshow', attemptAutoplay);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && video.paused) attemptAutoplay();
  });

  attemptAutoplay();
})();
