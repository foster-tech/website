(function () {
  'use strict';

  var hero = document.querySelector('header.masthead');
  if (!hero) return;

  var video = hero.querySelector('.hero-video');
  var button = hero.querySelector('.hero-video-toggle');
  var status = hero.querySelector('.hero-video-status');
  if (!video || !button || !status) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var request = 0;

  function setState(state) {
    hero.setAttribute('data-video-state', state);
    button.hidden = state !== 'blocked';
    status.hidden = state === 'playing' || state === 'reduced';
    status.querySelectorAll('[data-video-state]').forEach(function (message) {
      message.hidden = message.getAttribute('data-video-state') !== state;
    });
  }

  function play() {
    if (reducedMotion.matches) return;
    var currentRequest = ++request;
    video.muted = true;
    setState('loading');
    // Invoke play directly in the click handler so Safari recognizes the gesture.
    var result = video.play();
    if (result && typeof result.then === 'function') {
      result.then(function () {
        // Autoplay may already have started before this script initialized.
        if (currentRequest === request && !reducedMotion.matches && !video.paused) {
          setState('playing');
        }
      }).catch(function (error) {
        if (currentRequest !== request || reducedMotion.matches) return;
        if (video.error || error.name === 'NotSupportedError') {
          setState('error');
        } else if (error.name === 'NotAllowedError') {
          setState('blocked');
        } else if (video.paused) {
          setState('blocked');
        }
      });
    }
  }

  function applyMotionPreference() {
    if (reducedMotion.matches) {
      ++request;
      video.autoplay = false;
      video.pause();
      setState('reduced');
    } else {
      video.autoplay = true;
      play();
    }
  }

  button.addEventListener('click', play);
  video.addEventListener('playing', function () {
    if (!reducedMotion.matches) setState('playing');
  });
  video.addEventListener('error', function () {
    if (!reducedMotion.matches) setState('error');
  });
  video.addEventListener('pause', function () {
    // Offscreen Safari pauses are normal: let the browser resume on return.
    if (!reducedMotion.matches && hero.getAttribute('data-video-state') === 'playing') {
      var bounds = hero.getBoundingClientRect();
      if (bounds.bottom > 0 && bounds.top < window.innerHeight) setState('blocked');
    }
  });

  if (reducedMotion.addEventListener) {
    reducedMotion.addEventListener('change', applyMotionPreference);
  } else {
    reducedMotion.addListener(applyMotionPreference);
  }
  applyMotionPreference();
})();
