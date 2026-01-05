// Accordion functionality for "How it Works" and FAQ sections

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all accordions on the page
  initAccordion('.accordion-item', '.accordion-header', '.accordion-content');
  initAccordion('.faq-item', '.faq-question', '.faq-answer');
});

/**
 * Initialize accordion functionality
 * @param {string} itemSelector - Selector for accordion items
 * @param {string} headerSelector - Selector for accordion headers/buttons
 * @param {string} contentSelector - Selector for accordion content
 */
function initAccordion(itemSelector, headerSelector, contentSelector) {
  const accordionItems = document.querySelectorAll(itemSelector);

  accordionItems.forEach(item => {
    const header = item.querySelector(headerSelector);
    const content = item.querySelector(contentSelector);

    if (!header || !content) return;

    // Set initial ARIA attributes
    header.setAttribute('aria-expanded', 'false');
    content.setAttribute('aria-hidden', 'true');

    // Add click handler
    header.addEventListener('click', function() {
      const isExpanded = header.getAttribute('aria-expanded') === 'true';

      // Close all other accordions in the same group (optional - remove for multi-open)
      const allHeaders = item.parentElement.querySelectorAll(headerSelector);
      const allContents = item.parentElement.querySelectorAll(contentSelector);

      allHeaders.forEach(h => h.setAttribute('aria-expanded', 'false'));
      allContents.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-hidden', 'true');
      });

      // Toggle current accordion
      if (!isExpanded) {
        header.setAttribute('aria-expanded', 'true');
        content.classList.add('active');
        content.setAttribute('aria-hidden', 'false');

        // Set max-height for smooth animation
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        header.setAttribute('aria-expanded', 'false');
        content.classList.remove('active');
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0';
      }
    });

    // Keyboard navigation
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });
}

// Auto-open first accordion item (optional)
// Uncomment if you want the first item open by default
/*
document.addEventListener('DOMContentLoaded', function() {
  const firstAccordionHeader = document.querySelector('.accordion-header');
  if (firstAccordionHeader) {
    setTimeout(() => firstAccordionHeader.click(), 300);
  }
});
*/
