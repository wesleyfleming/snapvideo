// Auto-rotating testimonial cards (pause on hover/focus, dots to jump)
document.addEventListener('DOMContentLoaded', function () {
  const deck = document.getElementById('quoteDeck');
  const dotsWrap = document.getElementById('quoteDots');
  if (!deck || !dotsWrap) return;

  const cards = Array.from(deck.querySelectorAll('.quote-card'));
  if (cards.length < 2) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', 'Testimonial ' + (i + 1));
    dot.addEventListener('click', () => { show(i); restart(); });
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function show(i) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = i;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { show((current + 1) % cards.length); }

  function restart() {
    if (reduceMotion) return;
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  deck.addEventListener('mouseenter', () => clearInterval(timer));
  deck.addEventListener('mouseleave', restart);
  deck.addEventListener('focusin', () => clearInterval(timer));
  deck.addEventListener('focusout', restart);

  restart();
});
