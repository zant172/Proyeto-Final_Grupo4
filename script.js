document.addEventListener('DOMContentLoaded', function() {

    const titleElement = document.querySelector('.company-title');
    
    if (titleElement) {
        const originalText = titleElement.textContent;
        let charIndex = 0;
        const typingSpeed = 70; 

        titleElement.textContent = ''; 

        function typeWriter() {
            if (charIndex < originalText.length) {
                titleElement.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, typingSpeed); 
            }
        }

        setTimeout(typeWriter, 500); 
    }

    const navLinks = document.querySelectorAll('.nav-menu ul li a[data-target]');
    const headerHeightOffset = 110; 

    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const targetId = this.getAttribute('data-target'); 
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeightOffset, 
                    behavior: 'smooth' 
                });
            }
        });
    });

    const landingButton = document.getElementById('btn-info-landing');
    const targetUrl = "https://infoinfinitytechh.netlify.app/";

    if (landingButton) {
        landingButton.addEventListener('click', function(event) {
            event.preventDefault(); 
            
            if (this.target === '_blank') {
                window.open(targetUrl, '_blank');
            } else {
                window.location.href = targetUrl;
            }
        });
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card-link');
    const productCountElement = document.getElementById('productCount');
    const discountCountElement = document.getElementById('discountCount');

    function updateCounters() {
        filterButtons.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            let count = 0;
            
            if (filterValue === 'all') {
                count = productCards.length;
            } else {
                productCards.forEach(card => {
                    if (card.getAttribute('data-category') === filterValue) {
                        count++;
                    }
                });
            }
            
            const countElement = btn.querySelector('.filter-count');
            if (countElement) {
                countElement.textContent = count;
            }
        });
        
        const visibleProducts = Array.from(productCards).filter(card => 
            card.style.display !== 'none'
        ).length;
        
        if (productCountElement) {
            productCountElement.textContent = visibleProducts;
        }
    }

    updateCounters();

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    card.classList.add('filter-fade-in');
                } else {
                    const category = card.getAttribute('data-category');
                    if (category === filterValue) {
                        card.style.display = 'block';
                        card.classList.add('filter-fade-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('filter-fade-in');
                    }
                }
            });
            
            updateCounters();
        });
    });

    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.getAttribute('data-url');
            
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    function startCountdown() {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 3);
        endDate.setHours(23, 59, 59, 999);

        if (!localStorage.getItem('offerEndDate')) {
            localStorage.setItem('offerEndDate', endDate.toISOString());
        }

        const storedEndDate = new Date(localStorage.getItem('offerEndDate'));

        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        function updateTimer() {
            const now = new Date().getTime();
            const distance = storedEndDate - now;

            if (distance < 0) {
                const newEndDate = new Date();
                newEndDate.setDate(newEndDate.getDate() + 3);
                newEndDate.setHours(23, 59, 59, 999);
                localStorage.setItem('offerEndDate', newEndDate.toISOString());
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.textContent = String(days).padStart(2, '0');
            hoursEl.textContent = String(hours).padStart(2, '0');
            minutesEl.textContent = String(minutes).padStart(2, '0');
            secondsEl.textContent = String(seconds).padStart(2, '0');
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }

    startCountdown();

    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    favoriteButtons.forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (favorites.includes(productId)) {
            btn.classList.add('active');
            btn.querySelector('i').classList.remove('bi-heart');
            btn.querySelector('i').classList.add('bi-heart-fill');
        }
    });

    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productId = this.getAttribute('data-product-id');
            const icon = this.querySelector('i');
            
            if (favorites.includes(productId)) {
                favorites = favorites.filter(id => id !== productId);
                this.classList.remove('active');
                icon.classList.remove('bi-heart-fill');
                icon.classList.add('bi-heart');
                showNotification('Removido de favoritos', 'remove');
            } else {
                favorites.push(productId);
                this.classList.add('active');
                icon.classList.remove('bi-heart');
                icon.classList.add('bi-heart-fill');
                showNotification('¡Agregado a favoritos!', 'add');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `toast-notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2500);
    }

    productCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Efectos 3D para tarjetas del carrusel
    const carouselCards = document.querySelectorAll('.product-card');
    
    carouselCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-20px) scale(1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });

    // Animación de entrada para productos al hacer scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const productObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                productObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const allProducts = document.querySelectorAll('.product-item-simple, .product-card');
    allProducts.forEach(product => {
        product.style.opacity = '0';
        product.style.transform = 'translateY(30px)';
        product.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        productObserver.observe(product);
    });

    const timerUnits = document.querySelectorAll('.timer-unit');
    timerUnits.forEach(unit => {
        unit.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05) rotateZ(2deg)';
        });
        unit.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotateZ(0)';
        });
    });

    const productsSection = document.querySelector('.products-section-simple');
    const carouselSection = document.querySelector('.product-carousel-section');
    
    let scrollTimeout;
    
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollThrottle = 100;
    
    window.addEventListener('scroll', function() {
        const now = Date.now();
        if (now - lastScrollTime < scrollThrottle) return;
        lastScrollTime = now;
        
        const scrolled = window.pageYOffset;
        
        if (productsSection) {
            const productsSectionTop = productsSection.offsetTop;
            const productsSectionHeight = productsSection.offsetHeight;
            const relativeScroll = scrolled - productsSectionTop;
            
            if (relativeScroll > -productsSectionHeight && relativeScroll < productsSectionHeight) {
                const movement = (relativeScroll / productsSectionHeight) * 100;
                productsSection.style.setProperty('--scroll-products', `${movement}px`);
            }
        }
        
        if (carouselSection) {
            const carouselSectionTop = carouselSection.offsetTop;
            const carouselSectionHeight = carouselSection.offsetHeight;
            const relativeScroll = scrolled - carouselSectionTop;
            
            if (relativeScroll > -carouselSectionHeight && relativeScroll < carouselSectionHeight) {
                const movement = (relativeScroll / carouselSectionHeight) * 100;
                carouselSection.style.setProperty('--scroll-carousel', `${movement}px`);
            }
        }
    }, { passive: true });
    
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseTime = 0;
    const mouseThrottle = 50;
    
    document.addEventListener('mousemove', function(e) {
        const now = Date.now();
        if (now - lastMouseTime < mouseThrottle) return;
        lastMouseTime = now;
        
        mouseX = e.clientX;
        mouseY = e.clientY;
    }, { passive: true });
    
    let animationFrameId;
    let lastAnimationTime = 0;
    const animationThrottle = 32;
    
    function animateSectionBackgrounds(timestamp) {
        if (timestamp - lastAnimationTime < animationThrottle) {
            animationFrameId = requestAnimationFrame(animateSectionBackgrounds);
            return;
        }
        lastAnimationTime = timestamp;
        
        if (productsSection) {
            const rect = productsSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const relativeX = ((mouseX - rect.left) / rect.width) * 100;
                const relativeY = ((mouseY - rect.top) / rect.height) * 100;
                
                productsSection.style.setProperty('--mouse-x', `${relativeX}%`);
                productsSection.style.setProperty('--mouse-y', `${relativeY}%`);
            }
        }
        
        if (carouselSection) {
            const rect = carouselSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const relativeX = ((mouseX - rect.left) / rect.width) * 100;
                const relativeY = ((mouseY - rect.top) / rect.height) * 100;
                
                carouselSection.style.setProperty('--mouse-x', `${relativeX}%`);
                carouselSection.style.setProperty('--mouse-y', `${relativeY}%`);
            }
        }
        
        animationFrameId = requestAnimationFrame(animateSectionBackgrounds);
    }
    
    animationFrameId = requestAnimationFrame(animateSectionBackgrounds);
    
    const observerSections = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
            } else {
                entry.target.classList.remove('section-active');
            }
        });
    }, {
        threshold: 0.2
    });
    
    if (productsSection) observerSections.observe(productsSection);
    if (carouselSection) observerSections.observe(carouselSection);
    
    function createParticleTrail(section, x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = `rgba(${Math.random() > 0.5 ? '255, 0, 0' : '147, 43, 52'}, 0.8)`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        particle.style.animation = 'particleFade 1s ease-out forwards';
        
        section.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFade {
            0% {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
            100% {
                opacity: 0;
                transform: scale(0.3) translateY(-30px);
            }
        }
    `;
    document.head.appendChild(style);
    
    let particleTimeout;
    let lastParticleTime = 0;
    const particleThrottle = 100;
    
    if (productsSection) {
        productsSection.addEventListener('mousemove', function(e) {
            const now = Date.now();
            if (now - lastParticleTime < particleThrottle) return;
            
            if (Math.random() > 0.97) {
                lastParticleTime = now;
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                createParticleTrail(this, x, y);
            }
        }, { passive: true });
    }
    
    if (carouselSection) {
        carouselSection.addEventListener('mousemove', function(e) {
            const now = Date.now();
            if (now - lastParticleTime < particleThrottle) return;
            
            if (Math.random() > 0.97) {
                lastParticleTime = now;
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                createParticleTrail(this, x, y);
            }
        }, { passive: true });
    }

    const productButtons = document.querySelectorAll('.product-btn');
    
    productButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            const url = productCard.getAttribute('data-url');
            
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    const carouselPrevButtons = document.querySelectorAll('[data-bs-slide="prev"]');
    const carouselNextButtons = document.querySelectorAll('[data-bs-slide="next"]');
    
    carouselPrevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const carousel = document.querySelector(targetId);
            if (carousel) {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel);
                bsCarousel.prev();
            }
        });
    });
    
    carouselNextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const carousel = document.querySelector(targetId);
            if (carousel) {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel);
                bsCarousel.next();
            }
        });
    });

    const carouselIndicators = document.querySelectorAll('.carousel-indicators button');
    
    carouselIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const slideIndex = this.getAttribute('data-bs-slide-to');
            const carousel = document.querySelector(targetId);
            
            if (carousel) {
                const bsCarousel = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel);
                bsCarousel.to(parseInt(slideIndex));
            }
        });
    });
    
});
document.addEventListener('DOMContentLoaded', () => {

    const tituloContacto = document.getElementById('titulo-contacto');
    const socialIcons = document.querySelectorAll('.custom-social-icon');
    const whatsappButton = document.getElementById('whatsapp-float');
    const form = document.getElementById('contactForm');
    const submitButton = document.querySelector('.contact-btn');
    
    if (tituloContacto) {
        tituloContacto.classList.add('shining-animation');
    }

    const handleRedirect = function () {
        const url = this.getAttribute('data-url');
        if (url) {
            window.open(url, '_blank');
        }
    };

    socialIcons.forEach(icon => {
        icon.addEventListener('click', handleRedirect);
        icon.style.cursor = 'pointer';
    });

    if (whatsappButton) {
        whatsappButton.addEventListener('click', handleRedirect);
        whatsappButton.style.cursor = 'pointer';
    }

    if (form) {
        form.addEventListener('submit', function(event) {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }
        });
    }

});
