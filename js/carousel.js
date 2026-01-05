// Video Carousel with Splide.js
document.addEventListener('DOMContentLoaded', function() {
  const carouselEl = document.getElementById('videoCarousel');

  if (carouselEl && typeof Splide !== 'undefined') {
    const splide = new Splide('#videoCarousel', {
      type: 'loop',
      focus: 'center',
      autoWidth: true,
      gap: '3rem',
      padding: '10%',
      arrows: true,
      pagination: false,
      updateOnMove: true,
      breakpoints: {
        1024: {
          gap: '2rem',
          padding: '5%',
        },
        768: {
          gap: '1rem',
          padding: '0',
          autoWidth: false,
        },
      },
    });

    splide.mount();

    // Auto-pause videos when not active (optional enhancement)
    splide.on('moved', function(newIndex) {
      const slides = splide.Components.Elements.slides;

      // Pause all videos
      slides.forEach(function(slide) {
        const iframe = slide.querySelector('iframe');
        if (iframe && iframe.src.includes('wistia')) {
          // Post message to pause Wistia video
          iframe.contentWindow.postMessage(JSON.stringify({
            method: 'pause'
          }), '*');
        }
      });
    });
  }
});

// Calendly button handler
document.addEventListener('DOMContentLoaded', function() {
  const calendlyButtons = document.querySelectorAll('#calendlyBtn, [href*="calendly"]');

  calendlyButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      // If Calendly widget is available, use popup
      if (typeof Calendly !== 'undefined') {
        e.preventDefault();
        Calendly.initPopupWidget({
          url: 'https://calendly.com/third-coast-films/30min'
        });
      }
      // Otherwise, let it open in new tab (default behavior)
    });
  });
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      mobileMenuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        mobileMenuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }
});

// Smooth scroll for anchor links
document.addEventListener('DOMContentLoaded', function() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');

      // Skip if href is just "#"
      if (targetId === '#') return;

      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        e.preventDefault();

        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - navbarHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
