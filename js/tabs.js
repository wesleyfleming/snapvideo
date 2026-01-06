// Tab functionality for "How it Works" section

document.addEventListener('DOMContentLoaded', function() {
  const stepTabs = document.querySelectorAll('.step-tab');
  const contentPanels = document.querySelectorAll('.content-panel');

  stepTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const step = this.getAttribute('data-step');

      // Update active tab
      stepTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');

      // Update active panel
      contentPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('data-content') === step) {
          panel.classList.add('active');
        }
      });
    });
  });
});
