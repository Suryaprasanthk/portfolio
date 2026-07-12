/* ================================================================
   K. SURYA PRASANTH — PORTFOLIO JAVASCRIPT
   script.js — Main Script

   TABLE OF CONTENTS:
   1. DOM Ready
   2. Theme (Light / Dark Mode)
   3. Navbar — Scroll & Hamburger
   4. Active Nav Link on Scroll
   5. Typed Title Animation
   6. Scroll Reveal Animations
   7. Back to Top Button
   8. Contact Form Handler
   9. Project Modal (Coming Soon)
   10. Certificate Modal
   11. Footer Year
   ================================================================ */

/* ────────────────────────────────────────────
   1. DOM READY
   ──────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initActiveNavOnScroll();
  initTypedAnimation();
  initScrollReveal();
  initBackToTop();
  initContactForm();
  initFooterYear();
});

/* ────────────────────────────────────────────
   2. THEME — LIGHT / DARK MODE
   Theme preference is saved to localStorage
   ──────────────────────────────────────────── */
function initTheme() {
  const toggle   = document.getElementById('theme-toggle');
  const icon     = document.getElementById('theme-icon');
  const htmlEl   = document.documentElement;

  // Load saved theme or default to 'dark'
  const savedTheme = localStorage.getItem('sp-theme') || 'dark';
  applyTheme(savedTheme);

  toggle.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('sp-theme', next);
  });

  function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      icon.className = 'fas fa-moon';
      toggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.className = 'fas fa-sun';
      toggle.setAttribute('aria-label', 'Switch to dark mode');
    }
  }
}

/* ────────────────────────────────────────────
   3. NAVBAR — SCROLL SHADOW & HAMBURGER
   ──────────────────────────────────────────── */
function initNavbar() {
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('nav-links');
  const certSection  = document.getElementById('certifications');

  // Add shadow on scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Handle nav link clicks — show/hide certifications
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      // Close mobile menu
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);

      const section = link.getAttribute('data-section');

      if (section === 'certifications') {
        // Show certifications, scroll to it
        certSection.classList.remove('cert-hidden');
        setTimeout(() => {
          certSection.scrollIntoView({ behavior: 'smooth' });
          // Trigger reveal animations for newly visible elements
          certSection.querySelectorAll('.reveal:not(.revealed)').forEach(el => {
            el.classList.add('revealed');
          });
        }, 50);
      } else if (section) {
        // Hide certifications when any other section nav is clicked
        certSection.classList.add('cert-hidden');
      }
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });
}


/* ────────────────────────────────────────────
   4. ACTIVE NAV LINK ON SCROLL
   Highlights the nav link for the visible section
   ──────────────────────────────────────────── */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach(sec => observer.observe(sec));
}

/* ────────────────────────────────────────────
   5. TYPED TITLE ANIMATION
   Cycles through job titles with a typing effect
   ──────────────────────────────────────────── */
function initTypedAnimation() {
  const target = document.getElementById('typed-title');
  if (!target) return;

  // ── EDIT: Add or change titles here ──
  const titles = [
    'Full Stack Developer',
    'AI Enthusiast',
    'Problem Solver',
    'Web Developer',
  ];

  let titleIndex = 0;
  let charIndex  = 0;
  let isDeleting = false;
  const typingSpeed   = 90;   // ms per character (typing)
  const deletingSpeed = 50;   // ms per character (deleting)
  const pauseAfter    = 1800; // ms pause after full word

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      target.textContent = currentTitle.slice(0, charIndex - 1);
      charIndex--;
    } else {
      target.textContent = currentTitle.slice(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentTitle.length) {
      // Pause at end of word
      delay = pauseAfter;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      delay = 300;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
}

/* ────────────────────────────────────────────
   6. SCROLL REVEAL ANIMATIONS
   Elements with class .reveal animate in when
   they enter the viewport
   ──────────────────────────────────────────── */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach(el => observer.observe(el));
}

/* ────────────────────────────────────────────
   7. BACK TO TOP BUTTON
   ──────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ────────────────────────────────────────────
   8. CONTACT FORM HANDLER — Formspree
   Submissions are sent to: https://formspree.io/f/mpqvayyd
   Emails arrive directly in kalabattulaprasanth@gmail.com
   ──────────────────────────────────────────── */
function initContactForm() {
  const form      = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status-msg');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    // Basic validation
    if (!name || !email || !message) {
      showStatus('⚠️ Please fill in all required fields.', 'warning');
      return;
    }
    if (!isValidEmail(email)) {
      showStatus('⚠️ Please enter a valid email address.', 'warning');
      return;
    }

    // Disable button & show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    try {
      // ── Submit to Formspree ──
      const response = await fetch('https://formspree.io/f/mpqvayyd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name:    name,
          email:   email,
          subject: document.getElementById('form-subject').value.trim(),
          message: message
        })
      });

      if (response.ok) {
        form.reset();
        showStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
        setTimeout(() => { statusMsg.textContent = ''; }, 6000);
      } else {
        const data = await response.json();
        const errMsg = data?.errors?.map(e => e.message).join(', ') || 'Something went wrong.';
        showStatus(`❌ ${errMsg}`, 'error');
      }
    } catch (err) {
      showStatus('❌ Network error. Please try again or email me directly.', 'error');
    }

    // Restore button
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  });

  function showStatus(msg, type) {
    statusMsg.textContent = msg;
    statusMsg.style.color =
      type === 'success' ? 'var(--accent-green)' :
      type === 'warning' ? 'var(--accent-amber)' :
      '#ef4444';
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}


/* ────────────────────────────────────────────
   9. PROJECT MODAL — COMING SOON
   ──────────────────────────────────────────── */

/**
 * Open the Coming Soon modal.
 * Called via onclick="openComingSoonModal()" in HTML.
 */
function openComingSoonModal() {
  openModal('coming-soon-modal');
}


/* ────────────────────────────────────────────
   10. CERTIFICATE MODAL
   ──────────────────────────────────────────── */

/**
 * Open the certificate viewer modal.
 * @param {HTMLElement} btn  — The clicked "View Certificate" button.
 *                             It reads data-img and data-title attributes.
 */
function openCertModal(btn) {
  const imgSrc    = btn.getAttribute('data-img')   || '';
  const titleText = btn.getAttribute('data-title') || 'Certificate';

  const modal      = document.getElementById('cert-modal');
  const modalTitle = document.getElementById('cert-modal-title');
  const modalImg   = document.getElementById('cert-modal-img');
  const placeholder = modal.querySelector('.cert-modal-placeholder');
  const dlBtn      = document.getElementById('cert-download-btn');

  modalTitle.textContent = titleText;

  if (imgSrc) {
    // Try loading the image; fall back to placeholder if 404
    modalImg.onload = () => {
      placeholder.style.display = 'none';
      modalImg.style.display    = 'block';
      dlBtn.style.display       = 'inline-flex';
      dlBtn.href                = imgSrc;
      dlBtn.download            = titleText.replace(/\s+/g, '_') + '.jpg';
    };
    modalImg.onerror = () => {
      placeholder.style.display = 'flex';
      modalImg.style.display    = 'none';
      dlBtn.style.display       = 'none';
    };
    modalImg.src = imgSrc;
  } else {
    placeholder.style.display = 'flex';
    modalImg.style.display    = 'none';
    dlBtn.style.display       = 'none';
  }

  openModal('cert-modal');
}

/* ── Generic Modal Helpers ── */

/**
 * Open a modal by its ID.
 * @param {string} modalId
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';

  // Close on overlay click (outside box)
  modal.addEventListener('click', handleOverlayClick);
}

/**
 * Close a modal by its ID.
 * @param {string} modalId
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
  modal.removeEventListener('click', handleOverlayClick);
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    closeModal(e.currentTarget.id);
  }
}

// Close modals on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      closeModal(m.id);
    });
  }
});

/* ────────────────────────────────────────────
   11. FOOTER YEAR — AUTO-UPDATE
   ──────────────────────────────────────────── */
function initFooterYear() {
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
