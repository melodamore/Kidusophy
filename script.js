document.addEventListener('DOMContentLoaded', () => {
            const isDesktop = window.matchMedia("(min-width: 901px)").matches;
            
            // Mark body as loaded
            document.body.classList.add('loaded');

            // --- Loader Logic ---
            const loader = document.getElementById('loader');
            if(loader) { 
                setTimeout(() => { 
                    loader.classList.add('hidden'); 
                    
                    // Remove loader from DOM after animation completes
                    setTimeout(() => {
                        loader.remove();
                    }, 1000);
                }, 2500); 
            }
// Scroll progress bar
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

            // --- NEW: Infinite Scroll Implementation ---
            const loadMoreButton = document.getElementById('load-more-button');
            if (loadMoreButton) {
                loadMoreButton.addEventListener('click', function() {
                    const nextUrl = this.getAttribute('data-next-url');
                    if (!nextUrl) return;
                    
                    // Show loading state
                    this.textContent = 'እየፈለግን ነው...';
                    this.disabled = true;
                    
                    fetch(nextUrl)
                        .then(response => response.text())
                        .then(html => {
                            // Parse the HTML response
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(html, 'text/html');
                            
                            // Extract new posts
                            const newPosts = doc.querySelectorAll('.post-card');
                            if (newPosts.length === 0) {
                                // No more posts - show "ይዘቶች አልቀዋል!"
                                this.remove();
                                document.querySelector('.load-more-container').innerHTML = '<div class="the-end-indicator">ይዘቶች አልቀዋል!</div>';
                                return;
                            }
                            
                            // Append new posts to grid
                            const postsGrid = document.getElementById('posts-grid');
                            newPosts.forEach(post => {
                                postsGrid.appendChild(post);
                            });
                            
                            // Update next URL or remove button if no more posts
                            const nextButton = doc.querySelector('.blog-pager-older-link');
                            if (nextButton) {
                                this.setAttribute('data-next-url', nextButton.href);
                                this.textContent = 'See more posts';
                                this.disabled = false;
                            } else {
                                this.remove();
                                document.querySelector('.load-more-container').innerHTML = '<div class="the-end-indicator">ይዘቶች አልቀዋል!</div>';
                            }
                            
                            // Initialize GSAP animations for new posts
                            gsap.utils.toArray('.animate-on-scroll:not(.is-visible)').forEach(el => {
                                gsap.from(el, {
                                    scrollTrigger: {
                                        trigger: el,
                                        start: "top 80%",
                                        toggleActions: "play none none none",
                                        once: true
                                    },
                                    y: 50,
                                    opacity: 0,
                                    duration: 1,
                                    ease: "power3.out"
                                });
                            });
                        })
                        .catch(error => {
                            console.error('Error loading more posts:', error);
                            this.textContent = 'Error - Try Again';
                            this.disabled = false;
                        });
                });
            }

            // --- Atmospheric & UI Effects ---
            // CUSTOM CURSOR (Desktop only)
            if (isDesktop) {
                const cursorDot = document.querySelector('.custom-cursor-dot');
                const cursorCircle = document.querySelector('.custom-cursor-circle');
                const trailContainer = document.getElementById('cursor-trail-container');
                
                if (cursorDot && cursorCircle && trailContainer) {
                    let dotX = 0, dotY = 0, circleX = 0, circleY = 0;
                    let mouseX = 0, mouseY = 0;
                    
                    // Mouse move event
                    window.addEventListener('mousemove', (e) => { 
                        mouseX = e.clientX;
                        mouseY = e.clientY;
                        dotX = e.clientX; 
                        dotY = e.clientY;
                        createTrail(dotX, dotY);
                        
                        // Update mouse position for card effects
                        document.querySelectorAll('.card-3d, .ad-card').forEach(card => {
                            const rect = card.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const y = e.clientY - rect.top;
                            card.style.setProperty('--mouse-x', `${x}px`);
                            card.style.setProperty('--mouse-y', `${y}px`);
                        });
                    });
                    
                    // Create trail particles
                    const createTrail = (x, y) => {
                        const p = document.createElement('div');
                        p.className = 'trail-particle';
                        const s = Math.random() * 4 + 2;
                        p.style.width = `${s}px`; 
                        p.style.height = `${s}px`;
                        p.style.left = `${x}px`; 
                        p.style.top = `${y}px`;
                        trailContainer.appendChild(p);
                        setTimeout(() => p.remove(), 500);
                    };
                    
                    // Smooth cursor animation
                    const lerp = (a, b, n) => (1 - n) * a + n * b;
                    const animateCursor = () => {
                        // Dot follows mouse directly
                        cursorDot.style.left = `${dotX}px`; 
                        cursorDot.style.top = `${dotY}px`;
                        
                        // Circle follows with delay
                        circleX = lerp(circleX, dotX, 0.15); 
                        circleY = lerp(circleY, dotY, 0.15);
                        cursorCircle.style.left = `${circleX}px`; 
                        cursorCircle.style.top = `${circleY}px`;
                        
                        requestAnimationFrame(animateCursor);
                    };
                    animateCursor();
                }

                // Embers (Desktop only)
                const emberContainer = document.getElementById('ember-container');
                if (emberContainer) {
                    setInterval(() => {
                        const ember = document.createElement('div');
                        ember.className = 'ember';
                        const size = Math.random() * 5 + 2;
                        ember.style.width = `${size}px`; 
                        ember.style.height = `${size}px`;
                        ember.style.left = `${Math.random() * 100}%`;
                        const duration = Math.random() * 10 + 5;
                        ember.style.animationDuration = `${duration}s`;
                        emberContainer.appendChild(ember);
                        setTimeout(() => ember.remove(), duration * 1000);
                    }, 250);
                }
                
                // Aura particles (Desktop only)
                const auraContainer = document.getElementById('aura-container');
                if (auraContainer) {
                    for (let i = 0; i < 15; i++) {
                        const aura = document.createElement('div');
                        aura.className = 'aura-particle';
                        const size = Math.random() * 100 + 50;
                        aura.style.width = `${size}px`;
                        aura.style.height = `${size}px`;
                        aura.style.left = `${Math.random() * 100}%`;
                        aura.style.top = `${Math.random() * 100}%`;
                        aura.style.animationDuration = `${Math.random() * 20 + 10}s`;
                        aura.style.animationDelay = `${Math.random() * 5}s`;
                        auraContainer.appendChild(aura);
                    }
                }
            }
            
// CONSTELLATION (All devices)
            const canvas = document.getElementById('constellation-canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                let stars = [];
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                let starsCount = (canvas.width * canvas.height) / 10000;

                // Create stars
                for (let i = 0; i < starsCount; i++) {
                    stars.push({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        radius: Math.random() * 1 + 1,
                        vx: Math.random() * 0.2 - 0.1,
                        vy: Math.random() * 0.2 - 0.1
                    });
                }

                // Draw function
                const draw = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'rgba(255, 239, 160, 0.8)';

                    // Draw stars
                    stars.forEach(star => {
                        ctx.beginPath();
                        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                        ctx.fill();
                    });

                    // Draw connections
                    ctx.beginPath();
                    for(let i = 0; i < stars.length; i++) {
                        for (let j = i; j < stars.length; j++) {
                            let dist = Math.hypot(stars[i].x - stars[j].x, stars[i].y - stars[j].y);
                            if (dist < 100) {
                                ctx.moveTo(stars[i].x, stars[i].y);
                                ctx.lineTo(stars[j].x, stars[j].y);
                            }
                        }
                    }
                    ctx.strokeStyle = 'rgba(255, 154, 0, 0.1)';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                };

                // Update star positions
                const update = () => {
                    stars.forEach(star => {
                        star.x += star.vx;
                        star.y += star.vy;
                        if (star.x < 0 || star.x > canvas.width) star.vx *= -1;
                        if (star.y < 0 || star.y > canvas.height) star.vy *= -1;
                    });
                };

                // Animation loop
                let animationFrame;
                const animate = () => {
                    if (window.innerWidth > 768) { // THIS IS THE LINE TO CHANGE
                        draw();
                        update();
                    }
                    animationFrame = requestAnimationFrame(animate);
                };
                animate();

                // Cleanup on resize
                window.addEventListener('resize', () => {
                    cancelAnimationFrame(animationFrame);
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    animate();
                });
            }
            
            // --- GSAP Animations ---
            // Initialize GSAP animations for scroll-triggered elements
            gsap.registerPlugin(ScrollTrigger);
            
            // Animate on scroll elements
            gsap.utils.toArray('.animate-on-scroll').forEach(el => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: "top 80%",
                        toggleActions: "play none none none",
                        once: true
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out"
                });
            });
            
            // Hero logo animation
            const heroLogo = document.querySelector('.hero-logo');
            if (heroLogo) {
                gsap.from(heroLogo, {
                    duration: 2,
                    scale: 0.5,
                    opacity: 0,
                    ease: "elastic.out(1, 0.5)"
                });
            }
            
            // Title animation
            const title = document.querySelector('.title');
            if (title) {
                gsap.from(title, {
                    duration: 1.5,
                    y: 50,
                    opacity: 0,
                    delay: 0.5,
                    ease: "power3.out"
                });
            }
            
            // --- General Listeners ---
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) { 
                menuToggle.addEventListener('click', () => { 
                    document.body.classList.toggle('nav-open'); 
                }); 
            }
            
            const mobileNavLinks = document.querySelectorAll('#mobile-nav a');
            mobileNavLinks.forEach(link => { 
                link.addEventListener('click', () => { 
                    document.body.classList.remove('nav-open'); 
                }); 
            });
            
            // Header scroll effect (keep this as is)
const header = document.getElementById('site-header');
const backToTopButton = document.getElementById('back-to-top');

let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    // Header scroll effect (keep this as is)
    if (header) {
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
            header.classList.remove('hidden');
        }
    }

    // Back to top button VISIBILITY
    if (backToTopButton) {
        if (currentScroll > window.innerHeight * 0.8) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    lastScroll = currentScroll;
});

// NEW: Back to top button CLICK event listener (Add this after the existing scroll listener)
if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor link behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll to top
        });
    });
}

            // Quote rotation
            const quoteElement = document.getElementById('quote-text');
            if (quoteElement) {
                const quotes = [
					"ስትሞት እንዳትሞት ሳትሞት ሙት!", 
                    "አለማወቅን ማወቅ እውነተኛ ጥበብ ነው!", 
                    "ብልሆች እውቀትን ይከተላሉ ሞኞች ደግሞ ሰውን!", 
                    "ምንም ካልተቀየረ ምንም አይቀየርም",
                    "The journey of a thousand miles begins with a single step.", 
                    "To find yourself, think for yourself.", 
                    "The only true wisdom is in knowing you know nothing.", 
                    "Stillness is the language God speaks.", 
                    "Look within. The secret is inside you."
                ];
                
                let quoteIndex = 0;
                const changeQuote = () => {
                    gsap.to(quoteElement, {
                        duration: 0.5,
                        opacity: 0,
                        y: -10,
                        onComplete: () => {
                            quoteIndex = (quoteIndex + 1) % quotes.length;
                            quoteElement.textContent = quotes[quoteIndex];
                            
                            gsap.to(quoteElement, {
                                duration: 0.5,
                                opacity: 1,
                                y: 0
                            });
                        }
                    });
                };
                
                quoteElement.textContent = quotes[quoteIndex];
                setInterval(changeQuote, 5000);
            }

            // Section title animations
            const sectionTitles = document.querySelectorAll('.section-title');
            sectionTitles.forEach(title => {
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => { 
                        if (entry.isIntersecting) { 
                            entry.target.classList.add('is-visible'); 
                        } 
                    });
                }, { threshold: 0.1 });
                
                observer.observe(title);
            });
            
            // Card hover effects
            document.querySelectorAll('.card-3d').forEach(card => {
                card.addEventListener('mousemove', (e) => {
                    if (!isDesktop) return;
                    
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    card.style.setProperty('--mouse-x', `${x}px`);
                    card.style.setProperty('--mouse-y', `${y}px`);
                });
            });           

        });

fetch("https://github.com/melodamore/Kidusophy/blob/main/hero.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("hero-html").innerHTML = html;
});
