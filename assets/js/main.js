/**
 * Virander Kumar — Senior Developer Portfolio Script
 * Clean, lightweight, dependency-free vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

   /*=============== 1. MOBILE NAVIGATION DRAWER ===============*/
   const navMenu = document.getElementById('nav-menu');
   const navToggle = document.getElementById('nav-toggle');
   const navClose = document.getElementById('nav-close');
   const navBackdrop = document.getElementById('nav-backdrop');
   const navLinks = document.querySelectorAll('.nav__link');

   const openMenu = () => {
      if (navMenu) navMenu.classList.add('show-menu');
      if (navBackdrop) navBackdrop.classList.add('show-backdrop');
      document.body.style.overflow = 'hidden';
   };

   const closeMenu = () => {
      if (navMenu) navMenu.classList.remove('show-menu');
      if (navBackdrop) navBackdrop.classList.remove('show-backdrop');
      document.body.style.overflow = '';
   };

   if (navToggle) {
      navToggle.addEventListener('click', (e) => {
         e.stopPropagation();
         navMenu && navMenu.classList.contains('show-menu') ? closeMenu() : openMenu();
      });
   }

   if (navClose) navClose.addEventListener('click', closeMenu);
   if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);

   navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
   });

   document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
   });


   /*=============== 2. SCROLL PROGRESS & ACTIVE LINK SPY ===============*/
   const scrollProgressBar = document.getElementById('scroll-progress');
   const scrollUpBtn = document.getElementById('scroll-up');
   const sections = document.querySelectorAll('section[id]');

   const handleScroll = () => {
      const scrollY = window.scrollY;

      // Scroll progress bar
      if (scrollProgressBar) {
         const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
         if (totalHeight > 0) {
            const progress = (scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
         }
      }

      // Scroll to top button visibility
      if (scrollUpBtn) {
         scrollY >= 400 ? scrollUpBtn.classList.add('show-scroll') : scrollUpBtn.classList.remove('show-scroll');
      }

      // Active Section Spy
      const headerOffset = 100;
      sections.forEach(current => {
         const sectionHeight = current.offsetHeight;
         const sectionTop = current.offsetTop - headerOffset;
         const sectionId = current.getAttribute('id');
         const link = document.querySelector(`.nav__list a[href*='${sectionId}']`);

         if (link) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
               link.classList.add('active-link');
            } else {
               link.classList.remove('active-link');
            }
         }
      });
   };

   window.addEventListener('scroll', handleScroll, { passive: true });
   handleScroll();


   /*=============== 3. CONTACT FORM SUBMISSION ===============*/
   const contactForm = document.getElementById('contact-form');
   const contactMessage = document.getElementById('contact-message');
   const submitBtn = document.getElementById('form-submit-btn');

   if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
         e.preventDefault();

         if (!submitBtn) return;
         const originalContent = submitBtn.innerHTML;

         submitBtn.disabled = true;
         submitBtn.innerHTML = `Sending message...`;

         const serviceID = 'service_portfolio';
         const templateID = 'template_portfolio';
         const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with real key if needed

         const handleSuccess = () => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;

            if (contactMessage) {
               contactMessage.className = 'form-status status-success';
               contactMessage.textContent = 'Thank you! Your message was sent successfully. I will get back to you soon.';
            }

            window.showToast('Message sent! Thank you.');
            contactForm.reset();

            setTimeout(() => {
               if (contactMessage) {
                  contactMessage.textContent = '';
                  contactMessage.className = 'form-status';
               }
            }, 6000);
         };

         const handleError = () => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;

            if (contactMessage) {
               contactMessage.className = 'form-status status-error';
               contactMessage.textContent = 'Oops! Please send an email directly to KC8844906@gmail.com.';
            }

            setTimeout(() => {
               if (contactMessage) {
                  contactMessage.textContent = '';
                  contactMessage.className = 'form-status';
               }
            }, 6000);
         };

         if (typeof emailjs !== 'undefined' && publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.sendForm(serviceID, templateID, '#contact-form', publicKey)
               .then(handleSuccess, handleError);
         } else {
            setTimeout(handleSuccess, 700);
         }
      });
   }

});


/*=============== GLOBAL CLIPBOARD & TOAST HELPER ===============*/
window.showToast = function(message) {
   const toast = document.getElementById('toast-notification');
   const toastText = document.getElementById('toast-text');

   if (toast && toastText) {
      toastText.textContent = message;
      toast.classList.add('show-toast');

      setTimeout(() => {
         toast.classList.remove('show-toast');
      }, 3000);
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
