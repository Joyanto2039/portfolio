document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle Logic
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-item, .nav-btn');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.querySelector('i').classList.toggle('fa-bars');
            hamburger.querySelector('i').classList.toggle('fa-times');
        });

        // Close navigation menu when a link is clicked
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.add('fa-bars');
                hamburger.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    // 2. Scroll Behavior: Add Box-Shadow to Navbar when scrolled
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 30px -10px rgba(0, 0, 0, 0.7)';
            navbar.style.height = '75px';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.height = '85px';
        }
    });

    // 3. Smooth Scroll for Anchor Links
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
            }
        });
    });

    // 4. Design gallery lightbox
    const cards = Array.from(document.querySelectorAll('.design-card'));
    const lightbox = document.getElementById('lightbox');

    if (cards.length && lightbox) {
        const imgEl = document.getElementById('lightbox-img');
        const titleEl = document.getElementById('lightbox-title');
        const descEl = document.getElementById('lightbox-desc');
        const countEl = document.getElementById('lightbox-count');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        let current = 0;
        let lastFocused = null;

        const preload = (i) => {
            const card = cards[(i + cards.length) % cards.length];
            const img = new Image();
            img.src = card.dataset.full;
        };

        const show = (index) => {
            current = (index + cards.length) % cards.length;
            const card = cards[current];
            imgEl.src = card.dataset.full;
            imgEl.alt = card.dataset.title + ' for Requin BD';
            titleEl.textContent = card.dataset.title;
            descEl.textContent = card.dataset.desc;
            countEl.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
            preload(current + 1);
            preload(current - 1);
        };

        const open = (index) => {
            lastFocused = document.activeElement;
            show(index);
            lightbox.hidden = false;
            document.body.classList.add('lightbox-open');
            closeBtn.focus();
        };

        const close = () => {
            lightbox.hidden = true;
            document.body.classList.remove('lightbox-open');
            imgEl.removeAttribute('src');
            if (lastFocused) lastFocused.focus();
        };

        cards.forEach((card, i) => card.addEventListener('click', () => open(i)));
        closeBtn.addEventListener('click', close);
        prevBtn.addEventListener('click', () => show(current - 1));
        nextBtn.addEventListener('click', () => show(current + 1));

        // Click on the dark backdrop closes the viewer
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) close();
        });

        document.addEventListener('keydown', (e) => {
            if (lightbox.hidden) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(current - 1);
            else if (e.key === 'ArrowRight') show(current + 1);
            else if (e.key === 'Tab') {
                // Keep keyboard focus inside the viewer while it is open
                const focusable = [closeBtn, prevBtn, nextBtn];
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        });

        // Swipe left/right on touch screens
        let touchStartX = null;
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(dx) > 50) show(dx < 0 ? current + 1 : current - 1);
        }, { passive: true });
    }

});