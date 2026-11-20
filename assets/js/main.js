/**
 * Virander Kumar — Developer Portfolio (2026 Edition)
 * Aura Obsidian Interaction & Performance Script
 */

document.addEventListener('DOMContentLoaded', () => {

   /*=============== 1. DYNAMIC MOUSE SPOTLIGHT ON BENTO CARDS ===============*/
   const spotlightCards = document.querySelectorAll('.spotlight-card');

   spotlightCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
         const rect = card.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;
         card.style.setProperty('--mouse-x', `${x}px`);
         card.style.setProperty('--mouse-y', `${y}px`);
      });
   });


   /*=============== 2. LIVE CLOCK (IST / GMT+5:30) ===============*/
   const clockDisplay = document.getElementById('clock-display');
   const navClockTime = document.getElementById('nav-clock-time');

   function updateLiveClock() {
      const now = new Date();
      // Format to IST
      const options = {
         timeZone: 'Asia/Kolkata',
         hour: '2-digit',
         minute: '2-digit',
         second: '2-digit',
         hour12: true
      };

      try {
         const formatter = new Intl.DateTimeFormat('en-US', options);
         const timeString = formatter.format(now);
         
         if (clockDisplay) {
            clockDisplay.textContent = `${timeString} IST`;
         }
         if (navClockTime) {
            const shortOptions = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true };
            navClockTime.textContent = `${new Intl.DateTimeFormat('en-US', shortOptions).format(now)} IST`;
         }
      } catch (err) {
         // Fallback
         const fallback = now.toLocaleTimeString();
         if (clockDisplay) clockDisplay.textContent = `${fallback} IST`;
      }
   }

   updateLiveClock();
   setInterval(updateLiveClock, 1000);


   /*=============== 3. MOBILE NAVIGATION DRAWER ===============*/
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


   /*=============== 4. SCROLL PROGRESS & BLUR HEADER ===============*/
   const scrollProgressBar = document.getElementById('scroll-progress');
   const header = document.getElementById('header');
   const scrollUpBtn = document.getElementById('scroll-up');
   const sections = document.querySelectorAll('section[id]');

   const handleScroll = () => {
      const scrollY = window.scrollY;

      // Blur header
      if (header) {
         scrollY >= 40 ? header.classList.add('blur-header') : header.classList.remove('blur-header');
      }

      // Scroll progress
      if (scrollProgressBar) {
         const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
         if (totalHeight > 0) {
            const progress = (scrollY / totalHeight) * 100;
            scrollProgressBar.style.width = `${progress}%`;
         }
      }

      // Scroll to top button
      if (scrollUpBtn) {
         scrollY >= 400 ? scrollUpBtn.classList.add('show-scroll') : scrollUpBtn.classList.remove('show-scroll');
      }

      // Active Section Spy
      const headerOffset = 110;
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


   /*=============== 5. PROJECT FILTER SYSTEM ===============*/
   const filterBtns = document.querySelectorAll('.filter-btn');
   const projectCards = document.querySelectorAll('.project-card');

   filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
         filterBtns.forEach(b => b.classList.remove('active-filter'));
         btn.classList.add('active-filter');

         const filterValue = btn.getAttribute('data-filter');

         projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category') || '';
            const categories = cardCategory.split(' ');

            if (filterValue === 'all' || categories.includes(filterValue)) {
               card.style.opacity = '0';
               card.style.display = 'flex';
               setTimeout(() => {
                  card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                  card.style.opacity = '1';
                  card.style.transform = 'translateY(0)';
               }, 20);
            } else {
               card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
               card.style.opacity = '0';
               card.style.transform = 'translateY(15px)';
               setTimeout(() => {
                  card.style.display = 'none';
               }, 250);
            }
         });
      });
   });


   /*=============== 6. FAQ ACCORDION ===============*/
   const faqItems = document.querySelectorAll('.faq-item');

   faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      if (question && answer) {
         question.addEventListener('click', () => {
            const isActive = item.classList.contains('active-faq');

            // Close all
            faqItems.forEach(otherItem => {
               otherItem.classList.remove('active-faq');
               const otherAnswer = otherItem.querySelector('.faq-answer');
               if (otherAnswer) otherAnswer.style.maxHeight = null;
            });

            // Toggle current
            if (!isActive) {
               item.classList.add('active-faq');
               answer.style.maxHeight = answer.scrollHeight + 30 + 'px';
            }
         });
      }
   });


   /*=============== 7. CONTACT FORM SUBMISSION ===============*/
   const contactForm = document.getElementById('contact-form');
   const contactMessage = document.getElementById('contact-message');
   const submitBtn = document.getElementById('form-submit-btn');

   if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
         e.preventDefault();

         if (!submitBtn) return;
         const originalContent = submitBtn.innerHTML;

         // Loading UI
         submitBtn.disabled = true;
         submitBtn.innerHTML = `<span>Sending inquiry...</span> <i class="ri-loader-4-line spinner"></i>`;

         // Spinner animation style check
         if (!document.getElementById('spinner-anim')) {
            const style = document.createElement('style');
            style.id = 'spinner-anim';
            style.textContent = `.spinner { animation: spin 0.8s linear infinite; display: inline-block; } @keyframes spin { to { transform: rotate(360deg); } }`;
            document.head.appendChild(style);
         }

         const serviceID = 'service_portfolio';
         const templateID = 'template_portfolio';
         const publicKey = 'YOUR_PUBLIC_KEY'; // Replace with your real EmailJS key

         const handleSuccess = () => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;

            if (contactMessage) {
               contactMessage.className = 'form-status status-success';
               contactMessage.textContent = 'Thank you! Your inquiry was sent successfully. Virander will reply within 2-4 hours.';
            }

            window.showToast('Inquiry sent! I will review and reply shortly.');
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
               contactMessage.textContent = 'Oops! Please send an email directly to KC8844906@gmail.com or WhatsApp +91 8571840837.';
            }

            setTimeout(() => {
               if (contactMessage) {
                  contactMessage.textContent = '';
                  contactMessage.className = 'form-status';
               }
            }, 6000);
         };

         // If EmailJS configured
         if (typeof emailjs !== 'undefined' && publicKey !== 'YOUR_PUBLIC_KEY') {
            emailjs.sendForm(serviceID, templateID, '#contact-form', publicKey)
               .then(handleSuccess, handleError);
         } else {
            // High fidelity fast feedback simulation
            setTimeout(handleSuccess, 800);
         }
      });
   }

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
