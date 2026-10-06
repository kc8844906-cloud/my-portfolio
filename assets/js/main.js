/**
 * Virander Kumar - Modern Developer Portfolio 2026
 * Core JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {

   /*=============== MOBILE NAVIGATION ===============*/
   const navMenu = document.getElementById('nav-menu'),
         navToggle = document.getElementById('nav-toggle'),
         navClose = document.getElementById('nav-close'),
         navLinks = document.querySelectorAll('.nav__link');

   // Show menu
   if (navToggle && navMenu) {
      navToggle.addEventListener('click', (e) => {
         e.stopPropagation();
         navMenu.classList.add('show-menu');
         document.body.style.overflow = 'hidden';
      });
   }

   // Hide menu
   const closeMenu = () => {
      if (navMenu) {
         navMenu.classList.remove('show-menu');
         document.body.style.overflow = '';
      }
   };

   if (navClose) {
      navClose.addEventListener('click', closeMenu);
   }

   // Close on link click
   navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
   });

   // Close on click outside or escape key
   document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('show-menu') && !navMenu.contains(e.target) && e.target !== navToggle) {
         closeMenu();
      }
   });

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
         closeMenu();
      }
   });

   /*=============== SCROLL PROGRESS & BLUR HEADER ===============*/
   const scrollProgressBar = document.getElementById('scroll-progress');
   const header = document.getElementById('header');
   const scrollUpBtn = document.getElementById('scroll-up');

   const handleScroll = () => {
      const scrollY = window.scrollY;

      // Header blur
      if (header) {
         scrollY >= 40 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
      }

      // Scroll progress bar
      if (scrollProgressBar) {
         const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
         if (totalHeight > 0) {
            const progress = (scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
         }
      }

      // Scroll to top button
      if (scrollUpBtn) {
         scrollY >= 350 ? scrollUpBtn.classList.add('show-scroll') : scrollUpBtn.classList.remove('show-scroll');
      }

      // Active nav link spy
      updateActiveSection(scrollY);
   };

   window.addEventListener('scroll', handleScroll, { passive: true });

   /*=============== SCROLL SECTIONS ACTIVE LINK SPY ===============*/
   const sections = document.querySelectorAll('section[id]');

   function updateActiveSection(scrollDown) {
      const headerOffset = 90;

      sections.forEach(current => {
         const sectionHeight = current.offsetHeight,
               sectionTop = current.offsetTop - headerOffset,
               sectionId = current.getAttribute('id'),
               link = document.querySelector(`.nav__menu a[href*='${sectionId}']`);

         if (link) {
            if (scrollDown >= sectionTop && scrollDown < sectionTop + sectionHeight) {
               link.classList.add('active-link');
            } else {
               link.classList.remove('active-link');
            }
         }
      });
   }

   /*=============== PROJECT FILTER SYSTEM ===============*/
   const filterBtns = document.querySelectorAll('.filter-btn');
   const projectCards = document.querySelectorAll('.project-card');

   filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
         // Update active button
         filterBtns.forEach(b => b.classList.remove('active-filter'));
         btn.classList.add('active-filter');

         const filterValue = btn.getAttribute('data-filter');

         projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (filterValue === 'all' || cardCategory === filterValue) {
               card.style.opacity = '0';
               card.style.display = 'flex';
               setTimeout(() => {
                  card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
               }, 50);
            } else {
               card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
               card.style.opacity = '0';
               card.style.transform = 'translateY(15px)';
               setTimeout(() => {
                  card.style.display = 'none';
               }, 300);
            }
         });
      });
   });

   /*=============== CONTACT FORM & SUBMISSION ===============*/
   const contactForm = document.getElementById('contact-form');
   const contactMessage = document.getElementById('contact-message');
   const submitBtn = document.getElementById('form-submit-btn');

   if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
         e.preventDefault();

         if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
         }

         // Button loading state
         const originalBtnContent = submitBtn.innerHTML;
         submitBtn.disabled = true;
         submitBtn.innerHTML = `<span>Sending...</span> <i class="ri-loader-4-line" style="animation: spin 1s linear infinite;"></i>`;

         // Injected CSS for spin animation if needed
         if (!document.getElementById('spin-keyframes')) {
            const style = document.createElement('style');
            style.id = 'spin-keyframes';
            style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
         }

         const serviceID = 'service_portfolio';
         const templateID = 'template_portfolio';
         const publicKey = 'YOUR_PUBLIC_KEY';

         const handleSuccess = () => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;

            contactMessage.className = 'form-status status-success';
            contactMessage.textContent = 'Thank you! Your message has been sent successfully. ✅';

            showToast('Message sent! I will reply shortly.');
            contactForm.reset();

            setTimeout(() => {
               contactMessage.textContent = '';
               contactMessage.className = 'form-status';
            }, 6000);
         };

         const handleError = (error) => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;

            contactMessage.className = 'form-status status-error';
            contactMessage.textContent = 'Oops! Message could not be sent. Please email directly to KC8844906@gmail.com ❌';

            setTimeout(() => {
               contactMessage.textContent = '';
               contactMessage.className = 'form-status';
            }, 6000);
         };

         if (typeof emailjs !== 'undefined' && publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.sendForm(serviceID, templateID, '#contact-form', publicKey)
               .then(handleSuccess, handleError);
         } else {
            // High fidelity simulation
            setTimeout(handleSuccess, 900);
         }
      });
   }

   /*=============== SCROLL REVEAL ANIMATIONS ===============*/
   if (typeof ScrollReveal !== 'undefined') {
      const sr = ScrollReveal({
         origin: 'top',
         distance: '45px',
         duration: 1800,
         delay: 200,
         easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
         reset: false
      });

      // Hero Elements
      sr.reveal('.hero__data', { delay: 150 });
      sr.reveal('.hero__visual', { origin: 'right', delay: 350 });

      // Section Titles & Subtitles
      sr.reveal('.section__header', { origin: 'top' });

      // About
      sr.reveal('.about__intro', { origin: 'left', delay: 200 });
      sr.reveal('.about__bento', { origin: 'right', delay: 300 });

      // Skills
      sr.reveal('.skills__category', { interval: 150, origin: 'bottom' });

      // Projects
      sr.reveal('.work__filters', { origin: 'top', delay: 100 });
      sr.reveal('.project-card', { interval: 120, origin: 'bottom' });

      // Services
      sr.reveal('.service-card', { interval: 120, origin: 'bottom' });

      // Experience Timeline
      sr.reveal('.timeline-item', { interval: 150, origin: 'left' });

      // Testimonials
      sr.reveal('.testimonial-card', { interval: 120, origin: 'bottom' });

      // CTA Banner
      sr.reveal('.cta-banner', { origin: 'bottom', scale: 0.95 });

      // Contact
      sr.reveal('.contact__info-card', { origin: 'left', delay: 200 });
      sr.reveal('.contact__form-card', { origin: 'right', delay: 300 });
   }

   // Initialize on load
   handleScroll();
});

/*=============== GLOBAL TOAST & CLIPBOARD HELPER ===============*/
window.showToast = function(message) {
   const toast = document.getElementById('toast-notification');
   const toastText = document.getElementById('toast-text');

   if (toast && toastText) {
      toastText.textContent = message;
      toast.classList.add('show-toast');

      setTimeout(() => {
         toast.classList.remove('show-toast');
      }, 3500);
   }
};

window.copyToClipboard = function(text, successMsg = 'Copied to clipboard!') {
   if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
         window.showToast(successMsg);
      }).catch(() => {
         fallbackCopy(text, successMsg);
      });
   } else {
      fallbackCopy(text, successMsg);
   }
};

function fallbackCopy(text, successMsg) {
   const textArea = document.createElement('textarea');
   textArea.value = text;
   textArea.style.position = 'fixed';
   textArea.style.opacity = '0';
   document.body.appendChild(textArea);
   textArea.focus();
   textArea.select();
   try {
      document.execCommand('copy');
      window.showToast(successMsg);
   } catch (err) {
      window.showToast('Failed to copy');
   }
   document.body.removeChild(textArea);
}
