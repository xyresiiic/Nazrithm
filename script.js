/* ════════════════════════════════════════════════
   NAZRITHM — script.js
   Interactions: Cursor · Nav · Scroll · Animations
   NOTES:
     - This file controls page interactivity and animation behavior.
     - Add new page elements to the matching section below.
     - If you add buttons, cards, or anchors, update `updateHoverState()`
       and anchor scroll logic accordingly.
     - Keep any new section IDs aligned with the HTML nav links.
 ════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ──────────────────────────────────────────────
       0. PRELOADER & INITIAL LOAD HERO REVEAL
    ────────────────────────────────────────────── */
    const preloader = document.getElementById('preloader');

    const dismissPreloader = () => {
        if (preloader && !preloader.classList.contains('fade-out')) {
            preloader.classList.add('fade-out');
            document.body.classList.add('preloader-done');
            window.dispatchEvent(new Event('preloaderFinished'));
            setTimeout(() => {
                preloader.remove(); // Remove from DOM after transition
            }, 800); // match transition duration
        } else if (!preloader) {
            document.body.classList.add('preloader-done');
            window.dispatchEvent(new Event('preloaderFinished'));
        }
    };

    // Safely trigger preloader dismissal on window load (or fallback timeout)
    window.addEventListener('load', dismissPreloader);
    setTimeout(dismissPreloader, 300); // start within 0.3s if load takes too long


    /* ──────────────────────────────────────────────
       1. CUSTOM CURSOR
    ────────────────────────────────────────────── */
    const cursor = document.getElementById('cursor');
    const cursorFollow = document.getElementById('cursorFollow');

    if (cursor && cursorFollow) {
        let mouseX = 0, mouseY = 0;
        let followX = 0, followY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });

        // Smooth follower via rAF
        const animateFollow = () => {
            followX += (mouseX - followX) * 0.12;
            followY += (mouseY - followY) * 0.12;
            cursorFollow.style.left = `${followX}px`;
            cursorFollow.style.top = `${followY}px`;
            requestAnimationFrame(animateFollow);
        };
        animateFollow();

        // Cursor expand on interactive elements
        const updateHoverState = () => {
            const hoverEls = document.querySelectorAll(
                'a, button, .service-card, .work-card, .testi-card, .pill, .accordion-header, input, textarea, select'
            );

            hoverEls.forEach((el) => {
                // Remove existing listeners to prevent duplication if called multiple times
                el.removeEventListener('mouseenter', addCursorHover);
                el.removeEventListener('mouseleave', removeCursorHover);

                el.addEventListener('mouseenter', addCursorHover);
                el.addEventListener('mouseleave', removeCursorHover);
            });
        };

        const addCursorHover = () => {
            cursor.classList.add('cursor-hover');
            cursorFollow.classList.add('cursor-follow-hover');
        };

        const removeCursorHover = () => {
            cursor.classList.remove('cursor-hover');
            cursorFollow.classList.remove('cursor-follow-hover');
        };

        updateHoverState();
        // Export cursor hover refresh helper
        window.refreshCursorHover = updateHoverState;

        // Hide cursor on mouse leave window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollow.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollow.style.opacity = '1';
        });
    }


    /* ──────────────────────────────────────────────
       2. SCROLL PROGRESS BAR
    ────────────────────────────────────────────── */
    const progressBar = document.getElementById('progressBar');

    const updateProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPct = (scrollTop / docHeight) * 100;
        if (progressBar) progressBar.style.width = `${scrollPct}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });


    /* ──────────────────────────────────────────────
       3. NAVBAR — Scroll Shrink + Active Links
    ────────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');

    const handleNavScroll = () => {
        if (!navbar) return;

        // Shrink nav on scroll
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let currentSection = '';
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleNavScroll, { passive: true });


    /* ──────────────────────────────────────────────
       4. HAMBURGER MENU (Mobile)
    ────────────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navLinksEl = document.getElementById('navLinks');

    if (hamburger && navLinksEl) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinksEl.classList.toggle('open');
        });

        // Close menu on link click
        navLinksEl.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinksEl.classList.remove('open');
            });
        });
    }


    /* ──────────────────────────────────────────────
       5. INTERSECTION OBSERVER — Fade-Up Animations
    ────────────────────────────────────────────── */
    const fadeEls = document.querySelectorAll('.fade-up');

    const fadeObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    fadeObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el) => fadeObserver.observe(el));


    /* ──────────────────────────────────────────────
       6. COUNTER ANIMATION (Hero Stats)
    ────────────────────────────────────────────── */
    const counters = document.querySelectorAll('.stat-val[data-target]');

    const animateCounter = (el) => {
        const isFloat = el.dataset.target.includes('.');
        const target = parseFloat(el.dataset.target);
        const duration = 2000; // 2 seconds
        let startTimestamp = null;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // easeOutQuart for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            const current = target * easeProgress;

            if (isFloat) {
                el.textContent = current.toFixed(1);
            } else {
                el.textContent = Math.floor(current);
            }

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = isFloat ? target.toFixed(1) : target;
            }
        };
        requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const startAnimation = () => {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    };

                    if (document.body.classList.contains('preloader-done')) {
                        startAnimation();
                    } else {
                        window.addEventListener('preloaderFinished', startAnimation, { once: true });
                    }
                }
            });
        },
        { threshold: 0.1 }
    );

    counters.forEach((counter) => counterObserver.observe(counter));


    /* ──────────────────────────────────────────────
       7. SMOOTH SCROLL — Internal Anchors
    ────────────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navH = navbar ? navbar.offsetHeight : 80;
                const top = target.getBoundingClientRect().top + window.scrollY - navH;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    /* ──────────────────────────────────────────────
       8. WORK CARD TILT EFFECT (Subtle 3D)
    ────────────────────────────────────────────── */
    const workCards = document.querySelectorAll('.work-card');

    workCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);
            const rotX = dy * -4;
            const rotY = dx * 4;

            card.style.transform = `scale(1.02) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
            card.style.transition = 'transform 0.1s ease';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.35s ease, border-color 0.3s ease';
        });
    });


    /* ──────────────────────────────────────────────
       9. SERVICE CARD — Cursor-Tracked Glow
    ────────────────────────────────────────────── */
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            card.style.setProperty('--gx', `${x}%`);
            card.style.setProperty('--gy', `${y}%`);
        });
    });


    /* ──────────────────────────────────────────────
       10. MARQUEE — Pause on Hover
    ────────────────────────────────────────────── */
    const marqueeSection = document.querySelector('.marquee-section');
    const marqueeTrack = document.querySelector('.marquee-track');

    if (marqueeSection && marqueeTrack) {
        marqueeSection.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeSection.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }


    /* ──────────────────────────────────────────────
       11. PROCESS STEPS — Staggered Reveal
    ────────────────────────────────────────────── */
    const processSteps = document.querySelectorAll('.process-step');

    const stepObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = [...processSteps].indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 100}ms`;
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    stepObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    processSteps.forEach((step) => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(24px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        stepObserver.observe(step);
    });


    /* ──────────────────────────────────────────────
       12. PILL HOVER RIPPLE (About Section)
    ────────────────────────────────────────────── */
    document.querySelectorAll('.pill').forEach((pill) => {
        pill.addEventListener('click', function () {
            this.style.background = 'rgba(200,242,58,0.1)';
            setTimeout(() => { this.style.background = ''; }, 300);
        });
    });


    /* ──────────────────────────────────────────────
       13. FOOTER — Back to Top on Logo Click
    ────────────────────────────────────────────── */
    const footerLogo = document.querySelector('#footer .nav-logo');
    if (footerLogo) {
        footerLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ──────────────────────────────────────────────
       14. FAQ ACCORDION
    ────────────────────────────────────────────── */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const collapse = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Close all other items
            document.querySelectorAll('.accordion-item').forEach((otherItem) => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    const otherCollapse = otherItem.querySelector('.accordion-collapse');
                    otherHeader.setAttribute('aria-expanded', 'false');
                    otherCollapse.style.maxHeight = null;
                    otherCollapse.setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle current item
            if (isExpanded) {
                header.setAttribute('aria-expanded', 'false');
                collapse.style.maxHeight = null;
                collapse.setAttribute('aria-hidden', 'true');
                item.classList.remove('active');
            } else {
                header.setAttribute('aria-expanded', 'true');
                collapse.style.maxHeight = `${collapse.scrollHeight}px`;
                collapse.setAttribute('aria-hidden', 'false');
                item.classList.add('active');
            }
        });
    });


    /* ──────────────────────────────────────────────
       15. INQUIRY FORM VALIDATION & SUBMISSION
    ────────────────────────────────────────────── */
    const inquiryForm = document.getElementById('inquiryForm');
    const successAlert = document.getElementById('formSuccess');
    const errorAlert = document.getElementById('formError');

    if (inquiryForm) {
        const validateField = (inputEl) => {
            const group = inputEl.closest('.form-group');
            if (!group) return true;

            let isValid = true;
            if (inputEl.hasAttribute('required')) {
                if (inputEl.type === 'checkbox') {
                    isValid = inputEl.checked;
                } else if (inputEl.tagName === 'SELECT') {
                    isValid = inputEl.value !== '';
                } else {
                    isValid = inputEl.value.trim() !== '';
                }
            }

            if (isValid && inputEl.type === 'email' && inputEl.value.trim() !== '') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(inputEl.value.trim());
            }

            if (isValid) {
                group.classList.remove('invalid');
            } else {
                group.classList.add('invalid');
            }

            return isValid;
        };

        // Attach live input listeners to clear errors on type
        inquiryForm.querySelectorAll('input, select, textarea').forEach((inputEl) => {
            const triggerEvent = inputEl.tagName === 'SELECT' ? 'change' : 'input';
            inputEl.addEventListener(triggerEvent, () => {
                validateField(inputEl);
            });
            inputEl.addEventListener('blur', () => {
                validateField(inputEl);
            });
        });

        // Submit handler
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate all fields
            let isFormValid = true;
            inquiryForm.querySelectorAll('input, select, textarea').forEach((inputEl) => {
                const isFieldValid = validateField(inputEl);
                if (!isFieldValid) isFormValid = false;
            });

            if (!isFormValid) {
                if (errorAlert) {
                    errorAlert.style.display = 'block';
                    if (successAlert) successAlert.style.display = 'none';
                    setTimeout(() => {
                        errorAlert.style.display = 'none';
                    }, 5000);
                }
                return;
            }

            // Valid Form: Submit to Web3Forms
            inquiryForm.classList.add('loading');
            if (successAlert) successAlert.style.display = 'none';
            if (errorAlert) errorAlert.style.display = 'none';

            const formData = new FormData(inquiryForm);
            const jsonData = Object.fromEntries(formData);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jsonData)
            })
                .then(response => response.json())
                .then(data => {
                    inquiryForm.classList.remove('loading');

                    if (data.success) {
                        if (successAlert) {
                            successAlert.style.display = 'block';
                            inquiryForm.reset();
                            setTimeout(() => {
                                successAlert.style.display = 'none';
                            }, 8000);
                        }
                    } else {
                        if (errorAlert) {
                            errorAlert.style.display = 'block';
                            setTimeout(() => {
                                errorAlert.style.display = 'none';
                            }, 5000);
                        }
                    }
                })
                .catch(() => {
                    inquiryForm.classList.remove('loading');
                    if (errorAlert) {
                        errorAlert.style.display = 'block';
                        setTimeout(() => {
                            errorAlert.style.display = 'none';
                        }, 5000);
                    }
                });
        });
    }


    /* ──────────────────────────────────────────────
       17. GALLERY MODAL & LIGHTBOX
    ────────────────────────────────────────────── */
    const seeAllProjectsBtn = document.getElementById('seeAllProjectsBtn');
    const galleryModal = document.getElementById('galleryModal');
    const galleryCloseBtn = document.querySelector('.gallery-close');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-grid img');

    if (seeAllProjectsBtn && galleryModal) {
        seeAllProjectsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            galleryModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        galleryCloseBtn.addEventListener('click', () => {
            galleryModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    if (galleryImages && lightboxOverlay) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxOverlay.classList.add('show');
            });
        });

        lightboxClose.addEventListener('click', () => {
            lightboxOverlay.classList.remove('show');
            setTimeout(() => { lightboxImg.src = ''; }, 300);
        });

        lightboxOverlay.addEventListener('click', (e) => {
            if (e.target === lightboxOverlay) {
                lightboxOverlay.classList.remove('show');
                setTimeout(() => { lightboxImg.src = ''; }, 300);
            }
        });
    }

    /* ──────────────────────────────────────────────
       16. INITIAL PAGE LOAD — Stagger Hero Elements
    ────────────────────────────────────────────── */
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '1';
    }

    console.log(
        '%cNAZRiTHM ✦',
        'color:#C8F23A;font-family:Syne,sans-serif;font-size:18px;font-weight:800;'
    );
    console.log(
        '%cWhere Vision Meets Viral Rhythm.',
        'color:#9A9A8A;font-size:12px;font-family:DM Sans,sans-serif;'
    );

});