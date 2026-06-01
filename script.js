/* ════════════════════════════════════════════════
   NAZRITHM — script.js
   Interactions: Cursor · Nav · Scroll · Animations
════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

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
            cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
        });

        // Smooth follower via rAF
        const animateFollow = () => {
            followX += (mouseX - followX) * 0.12;
            followY += (mouseY - followY) * 0.12;
            cursorFollow.style.transform = `translate(${followX - 18}px, ${followY - 18}px)`;
            requestAnimationFrame(animateFollow);
        };
        animateFollow();

        // Cursor expand on interactive elements
        const hoverEls = document.querySelectorAll(
            'a, button, .service-card, .work-card, .testi-card, .pill'
        );

        hoverEls.forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(2.5)';
                cursorFollow.style.opacity = '0.25';
                cursorFollow.style.transform += ' scale(1.6)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(2.5)', '');
                cursorFollow.style.opacity = '1';
                cursorFollow.style.transform = cursorFollow.style.transform.replace(' scale(1.6)', '');
            });
        });

        // Hide on mouse leave
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
        const target = parseInt(el.dataset.target, 10);
        const duration = 2000;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current);
            }
        }, step);
    };

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
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
       14. INITIAL PAGE LOAD — Stagger Hero Elements
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