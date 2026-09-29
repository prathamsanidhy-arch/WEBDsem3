document.addEventListener("DOMContentLoaded", () => {
    // 1. Loader & Initialization Sequence
    const loader = document.querySelector('.loader');
    const heroContent = document.querySelector('.hero-content');

    // Simulate initial loading sequence for cinematic feel
    setTimeout(() => {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove(); // Remove from DOM after fade out
                if (heroContent) {
                    heroContent.classList.add('visible');
                }
            }, 1000);
        }
    }, 1500);


    // 2. Subtle Screen-Light Effect for Logo
    const logo = document.getElementById('dynamic-logo');
    
    if (logo) {
        const glowStates = ['glow-normal', 'glow-dim', 'glow-flicker'];
        let currentState = 'glow-normal';
        
        function changeGlow() {
            // Remove current state
            logo.classList.remove(currentState);
            
            // Logic for next state
            const rand = Math.random();
            if (rand < 0.7) {
                // 70% chance to be normal
                currentState = 'glow-normal';
            } else if (rand < 0.95) {
                // 25% chance to be slightly dim
                currentState = 'glow-dim';
            } else {
                // 5% chance to tiny fast flicker
                currentState = 'glow-flicker';
                // Flickers should be very short, so we interrupt and go back to normal quickly
                setTimeout(() => {
                    logo.classList.remove('glow-flicker');
                    logo.classList.add('glow-normal');
                    currentState = 'glow-normal';
                }, 100 + Math.random() * 150);
            }
            
            logo.classList.add(currentState);
            
            // Schedule next change irregularly
            const nextTime = 1000 + Math.random() * 3000;
            setTimeout(changeGlow, nextTime);
        }
        
        // Start loop
        setTimeout(changeGlow, 2000);
    }

    // 3. Smooth Scrolling for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Update active state
                document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // 4. Scroll Intersection Observer for Sections (Fade in effect)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a class that can be used for CSS animations if needed
                entry.target.classList.add('in-view');
                
                // Optionally update nav based on scroll
                const id = entry.target.getAttribute('id');
                if (id) {
                    const navLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                    if (navLink) {
                        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        sectionObserver.observe(section);
    });
});
