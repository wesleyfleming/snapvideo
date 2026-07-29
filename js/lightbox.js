// Shared video lightbox. Wistia iframes are created ONLY when a poster is
// clicked — nothing video-related loads with the page.
(function () {
  let overlay = null;

  function close() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (e.key === 'Escape') close();
  }

  function open(wistiaId, aspect) {
    close();
    overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<div class="lightbox-frame ' + (aspect === 'vertical' ? 'lightbox-vertical' : 'lightbox-horizontal') + '">' +
      '<button class="lightbox-close" aria-label="Close video">&times;</button>' +
      '<iframe src="https://fast.wistia.net/embed/iframe/' + encodeURIComponent(wistiaId) +
      '?autoPlay=true" title="Video player" allow="autoplay; fullscreen" allowtransparency="true" frameborder="0" scrolling="no"></iframe>' +
      '</div>';
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
    });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
  }

  document.querySelectorAll('[data-wistia]').forEach(function (el) {
    el.addEventListener('click', function () {
      open(el.getAttribute('data-wistia'), el.getAttribute('data-aspect'));
    });
    el.style.cursor = 'pointer';
  });
})();
