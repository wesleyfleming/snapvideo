// Analytics and Tracking

// Google Analytics 4
// Replace 'G-XXXXXXXXXX' with your actual GA4 measurement ID
(function() {
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with actual ID

  // Only load GA if measurement ID is set
  if (GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Load GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize GA4
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID);

    // Make gtag available globally
    window.gtag = gtag;
  }
})();

// Meta Pixel (Facebook Pixel)
// Replace 'YOUR_PIXEL_ID' with your actual pixel ID
(function() {
  const PIXEL_ID = 'YOUR_PIXEL_ID'; // TODO: Replace with actual ID

  if (PIXEL_ID !== 'YOUR_PIXEL_ID') {
    !function(f,b,e,v,n,t,s) {
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', PIXEL_ID);
    fbq('track', 'PageView');
  }
})();

// TikTok Pixel
// Replace 'YOUR_TIKTOK_PIXEL' with your actual pixel ID
(function() {
  const TIKTOK_PIXEL = 'YOUR_TIKTOK_PIXEL'; // TODO: Replace with actual ID

  if (TIKTOK_PIXEL !== 'YOUR_TIKTOK_PIXEL') {
    !function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
      ttq.load(TIKTOK_PIXEL);
      ttq.page();
    }(window, document, 'ttq');
  }
})();

// Event tracking helpers
const trackEvent = {
  // Track button clicks
  buttonClick: function(buttonName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'button_click', {
        'event_category': 'engagement',
        'event_label': buttonName
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { button: buttonName });
    }
  },

  // Track Calendly opens
  calendlyOpen: function() {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'calendly_open', {
        'event_category': 'engagement',
        'event_label': 'Schedule Call'
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Schedule');
    }
    if (typeof ttq !== 'undefined') {
      ttq.track('Contact');
    }
  },

  // Track video plays
  videoPlay: function(videoName) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'video_play', {
        'event_category': 'engagement',
        'event_label': videoName
      });
    }
  },

  // Track pricing card clicks
  pricingClick: function(tier) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pricing_click', {
        'event_category': 'engagement',
        'event_label': tier
      });
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'InitiateCheckout', { tier: tier });
    }
  }
};

// Auto-track Calendly button clicks
document.addEventListener('DOMContentLoaded', function() {
  const calendlyButtons = document.querySelectorAll('[href*="calendly"]');
  calendlyButtons.forEach(button => {
    button.addEventListener('click', function() {
      trackEvent.calendlyOpen();
    });
  });
});

// Auto-track pricing card clicks
document.addEventListener('DOMContentLoaded', function() {
  const pricingButtons = document.querySelectorAll('.pricing-card .btn');
  pricingButtons.forEach((button, index) => {
    const tiers = ['Starter', 'Growth', 'Enterprise'];
    button.addEventListener('click', function() {
      trackEvent.pricingClick(tiers[index] || 'Unknown');
    });
  });
});

// Track scroll depth
(function() {
  const scrollDepths = [25, 50, 75, 100];
  const tracked = new Set();

  window.addEventListener('scroll', function() {
    const scrollPercentage = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;

    scrollDepths.forEach(depth => {
      if (scrollPercentage >= depth && !tracked.has(depth)) {
        tracked.add(depth);
        if (typeof gtag !== 'undefined') {
          gtag('event', 'scroll_depth', {
            'event_category': 'engagement',
            'event_label': `${depth}%`
          });
        }
      }
    });
  });
})();

// Track UTM parameters
(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmParams = {
    source: urlParams.get('utm_source'),
    medium: urlParams.get('utm_medium'),
    campaign: urlParams.get('utm_campaign'),
    content: urlParams.get('utm_content'),
    term: urlParams.get('utm_term')
  };

  // Store UTM params in sessionStorage for later use
  if (Object.values(utmParams).some(v => v !== null)) {
    sessionStorage.setItem('utm_params', JSON.stringify(utmParams));

    // Track UTM parameters
    if (typeof gtag !== 'undefined') {
      gtag('event', 'utm_tracking', {
        'event_category': 'acquisition',
        'utm_source': utmParams.source,
        'utm_medium': utmParams.medium,
        'utm_campaign': utmParams.campaign
      });
    }
  }
})();
