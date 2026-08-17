/**
 * Main JavaScript - Career Topology Redesign (aprvh1.github.io)
 * Includes: mobile nav, scroll-spy, accessible experience modals.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
   * Mobile Navigation Toggle
   * ---------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');

  if (mobileToggle && sidebar) {
    mobileToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', sidebar.classList.contains('open'));
    });

    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 992 &&
          sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ------------------------------------------------------------
   * Scroll Spy for Navigation Links
   * ---------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Close mobile sidebar when a nav link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });

  /* ------------------------------------------------------------
   * Accessible Experience Detail Modals
   * ---------------------------------------------------------- */
  const modals = document.querySelectorAll('.modal-backdrop');
  const triggers = document.querySelectorAll('[data-modal-target]');
  const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
  let activeModal = null;

  const getModal = (id) => document.getElementById(id);

  function getFocusable(modal) {
    return Array.from(modal.querySelectorAll(FOCUSABLE)).filter(
      el => el.offsetParent !== null || el === document.activeElement
    );
  }

  function openModal(modal) {
    if (!modal) return;
    activeModal = modal;
    modal.hidden = false;
    document.body.classList.add('modal-open');

    // Notify the triggering tile
    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', 'true');

    // Allow transition to render
    requestAnimationFrame(() => modal.classList.add('visible'));

    // Move focus into the dialog
    const focusable = getFocusable(modal);
    if (focusable.length) focusable[0].focus();
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('visible');
    document.body.classList.remove('modal-open');

    const trigger = document.querySelector(`[aria-controls="${modal.id}"]`);
    if (trigger) trigger.setAttribute('aria-expanded', 'false');

    // Wait for fade-out before hiding
    window.setTimeout(() => { modal.hidden = true; }, 250);

    // Return focus to the triggering tile
    if (trigger) trigger.focus();
    activeModal = null;
  }

  // Open triggers
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      openModal(getModal(trigger.dataset.modalTarget));
    });
  });

  // Close buttons inside each modal
  modals.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  });

  // Backdrop click closes (only when clicking outside the dialog)
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Escape closes the active modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModal) {
      closeModal(activeModal);
    }
  });

  // Focus trap within the active modal
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !activeModal) return;
    const focusable = getFocusable(activeModal);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ------------------------------------------------------------
   * Dynamic Console Message
   * ---------------------------------------------------------- */
  console.log(
    "%c APRVH1 %c Career Topology Initialized. System status: OPTIMAL ",
    "background: #00ade4; color: #14161a; font-weight: bold; padding: 2px 6px; border-radius: 3px;",
    "background: #1b1e24; color: #e8e6e1; padding: 2px 6px; border-radius: 3px;"
  );
});