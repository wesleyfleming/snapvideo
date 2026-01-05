// Flip Card Interactions

document.addEventListener('DOMContentLoaded', function() {
  initFlipCards();
});

/**
 * Initialize flip card functionality
 * Cards flip on hover (desktop) or tap (mobile)
 */
function initFlipCards() {
  const flipCards = document.querySelectorAll('.flip-card');

  flipCards.forEach(card => {
    // Mobile tap to flip
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      card.addEventListener('click', function() {
        // Toggle flipped state
        card.classList.toggle('flipped');

        // Close other cards (optional - remove for multi-flip)
        flipCards.forEach(otherCard => {
          if (otherCard !== card) {
            otherCard.classList.remove('flipped');
          }
        });
      });

      // Close card when clicking outside
      document.addEventListener('click', function(e) {
        if (!card.contains(e.target)) {
          card.classList.remove('flipped');
        }
      });
    }

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Flip card to see more details');

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
  // Check if browser supports Intersection Observer
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe flip cards for scroll animations
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
      observer.observe(card);
    });

    // Observe other elements (optional)
    const animatedElements = document.querySelectorAll('.pricing-card, .accordion-item, .faq-item');
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  }
});

// Lazy load images
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => img.classList.add('loaded'));
  }
});
