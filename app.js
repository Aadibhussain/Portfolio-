// Portfolio App - Modern JavaScript with Enhanced Features
class PortfolioApp {
    constructor() {
        this.isDarkMode = this.getStoredTheme() === 'dark';
        this.isMenuOpen = false;
        this.currentSection = 'home';
        this.intersectionObserver = null;
        this.animationCounter = 0;
        
        this.init();
    }

    // Initialization
    init() {
        this.bindEvents();
        this.initializeTheme();
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeTypingEffect();
        this.hideLoadingScreen();
        this.initializeCounters();
        this.initializeSkillBars();
        this.initializeContactForm();
        this.initializeBackToTop();
        this.initializeProfileImageChanger();
        
        console.log('🚀 Portfolio App initialized successfully!');
    }

    // Event Binding
    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile navigation
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Navigation links
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Back to top button
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            backToTop.addEventListener('click', () => this.scrollToTop());
        }

        // Scroll events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Resize events
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeydown(e));

        // Click outside to close menu
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    // Theme Management
    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio-theme') || 'light';
        } catch (e) {
            return 'light';
        }
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.log('Unable to store theme preference');
        }
    }

    initializeTheme() {
        this.applyTheme();
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        const theme = this.isDarkMode ? 'dark' : 'light';
        this.setStoredTheme(theme);
        this.applyTheme();
        
        // Add visual feedback
        this.showNotification(`Switched to ${theme} mode`, 'info');
    }

    applyTheme() {
        const theme = this.isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.className = this.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Navigation Management
    initializeNavigation() {
        this.setupIntersectionObserver();
        this.updateActiveSection();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-50% 0px',
            threshold: 0
        };

        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavItem(sectionId);
                    this.currentSection = sectionId;
                }
            });
        }, options);

        // Observe all sections
        document.querySelectorAll('section[id]').forEach(section => {
            this.intersectionObserver.observe(section);
        });
    }

    updateActiveNavItem(sectionId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu) {
            navMenu.classList.toggle('active', this.isMenuOpen);
        }
        
        if (navToggle) {
            navToggle.classList.toggle('active', this.isMenuOpen);
            navToggle.setAttribute('aria-expanded', this.isMenuOpen);
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.currentTarget.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            this.scrollToSection(sectionId);
            this.closeMobileMenu();
        }
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const navHeight = 80;
            const offsetTop = section.offsetTop - navHeight;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    updateActiveSection() {
        // Initial active section update
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                this.updateActiveNavItem(id);
                this.currentSection = id;
            }
        });
    }

    // Animation Management
    initializeAnimations() {
        // Initialize AOS (Animate On Scroll)
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }

        // Add staggered animation delays
        const animatedElements = document.querySelectorAll('[data-aos]');
        animatedElements.forEach((el, index) => {
            if (!el.hasAttribute('data-aos-delay')) {
                el.setAttribute('data-aos-delay', Math.min(index * 100, 1000));
            }
        });
    }

    // Typing Effect
    initializeTypingEffect() {
        const typingElement = document.getElementById('typingText');
        if (typingElement) {
            const texts = [
                'Data Analyst & AI Specialist',
                'Machine Learning Engineer',
                'Full-Stack Developer',
                'SQL Database Expert',
                'Blockchain Developer',
                'Computer Vision Engineer',
                'Data Science Professional'
            ];
            
            new TypingEffect(typingElement, texts, 120);
        }
    }

    // Counter Animation
    initializeCounters() {
        const counters = document.querySelectorAll('.stat-number');
        this.counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    this.animateCounter(entry.target);
                    entry.target.classList.add('counted');
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            this.counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            
            if (target === 7.3) {
                element.textContent = Math.min(current, target).toFixed(1);
            } else {
                element.textContent = Math.min(Math.ceil(current), target);
            }
            
            if (current < target) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target === 7.3 ? target.toFixed(1) : target;
            }
        };

        updateCounter();
    }

    // Skill Bars Animation
    initializeSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        this.skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const percentage = entry.target.getAttribute('data-percentage');
                    entry.target.style.width = percentage + '%';
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => {
            this.skillObserver.observe(bar);
        });
    }

    // Contact Form Management
    initializeContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            new ContactFormHandler(contactForm);
        }
    }

    // Back to Top Button
    initializeBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            this.updateBackToTopVisibility();
        }
    }

    updateBackToTopVisibility() {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) {
            const isVisible = window.scrollY > 300;
            backToTop.classList.toggle('visible', isVisible);
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Profile Image Changer
    initializeProfileImageChanger() {
        const changePhotoBtn = document.getElementById('changePhoto');
        const profileImg = document.getElementById('profileImg');
        
        const profileImages = [
            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face&auto=format&q=80',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face&auto=format&q=80',
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face&auto=format&q=80',
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face&auto=format&q=80'
        ];
        
        let currentImageIndex = 0;

        if (changePhotoBtn && profileImg) {
            changePhotoBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % profileImages.length;
                profileImg.src = profileImages[currentImageIndex];
                
                // Add animation effect
                profileImg.style.transform = 'scale(0.8)';
                profileImg.style.opacity = '0.7';
                
                setTimeout(() => {
                    profileImg.style.transform = 'scale(1)';
                    profileImg.style.opacity = '1';
                }, 200);
                
                this.showNotification('Profile photo updated!', 'success');
            });
        }
    }

    // Loading Screen
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1000);
        }
    }

    // Event Handlers
    handleScroll() {
        this.updateNavbarBackground();
        this.updateBackToTopVisibility();
    }

    updateNavbarBackground() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            const isScrolled = window.scrollY > 50;
            navbar.classList.toggle('scrolled', isScrolled);
        }
    }

    handleResize() {
        if (window.innerWidth > 1023 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleKeydown(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        // Arrow keys for section navigation
        if (e.altKey) {
            const sections = ['home', 'about', 'experience', 'projects', 'skills', 'education', 'certificates', 'contact'];
            const currentIndex = sections.indexOf(this.currentSection);
            
            if (e.key === 'ArrowDown' && currentIndex < sections.length - 1) {
                e.preventDefault();
                this.scrollToSection(sections[currentIndex + 1]);
            } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                e.preventDefault();
                this.scrollToSection(sections[currentIndex - 1]);
            }
        }
    }

    handleClickOutside(e) {
        const navbar = document.querySelector('.navbar');
        if (this.isMenuOpen && !navbar.contains(e.target)) {
            this.closeMobileMenu();
        }
    }

    // Utility Functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Notification System
    showNotification(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: this.getNotificationColor(type),
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: '10000',
            maxWidth: '400px',
            fontSize: '0.9rem',
            fontWeight: '500',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, duration);
        
        // Click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    getNotificationColor(type) {
        const colors = {
            success: 'linear-gradient(135deg, #48bb78, #38a169)',
            error: 'linear-gradient(135deg, #f56565, #e53e3e)',
            warning: 'linear-gradient(135deg, #ed8936, #dd6b20)',
            info: 'linear-gradient(135deg, #4299e1, #3182ce)'
        };
        return colors[type] || colors.info;
    }
}

// Typing Effect Class
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;
        
        this.start();
    }

    start() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isWaiting) {
            setTimeout(() => {
                this.isWaiting = false;
                this.type();
            }, 2000);
            return;
        }
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            this.isWaiting = true;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Contact Form Handler Class
class ContactFormHandler {
    constructor(form) {
        this.form = form;
        this.isSubmitting = false;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.setupValidation();
    }

    setupValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing errors
        this.clearFieldError(field);

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required`;
        }

        // Email validation
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }

        // Phone validation
        if (field.type === 'tel' && value && !this.isValidPhone(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }

        // Text length validation
        if (field.type === 'text' && value && value.length < 2) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} must be at least 2 characters`;
        }

        // Textarea length validation
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    getFieldLabel(field) {
        const label = this.form.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent.replace('*', '').trim() : field.name;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #f56565;
            font-size: 0.75rem;
            margin-top: 0.25rem;
            display: block;
        `;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;

        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isFormValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        this.isSubmitting = true;
        this.showLoading(true);

        try {
            // Collect form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call
            await this.simulateSubmission(data);

            this.showMessage('🎉 Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('❌ Sorry, there was an error sending your message. Please try again or contact me directly.', 'error');
        } finally {
            this.isSubmitting = false;
            this.showLoading(false);
        }
    }

    simulateSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure
                if (Math.random() > 0.1) {
                    console.log('Form data:', data);
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    showLoading(isLoading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        const btnText = submitButton.querySelector('.btn-text');
        const btnLoading = submitButton.querySelector('.btn-loading');

        if (isLoading) {
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitButton.disabled = true;
        } else {
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitButton.disabled = false;
        }
    }

    showMessage(message, type) {
        const messageEl = document.getElementById('formMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `form-message ${type}`;
            messageEl.style.display = 'block';

            // Auto hide success messages
            if (type === 'success') {
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 8000);
            }
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[\s\-\(\)0-9]{10,}$/;
        return phoneRegex.test(phone);
    }
}

// Utility Functions
function downloadResume() {
    // Create download experience with fallback
    const app = window.portfolioApp;
    
    // For demo purposes - replace with actual resume file
    const resumeUrl = '#'; // Replace with: './assets/Adib_Hussain_Resume.pdf'
    
    if (resumeUrl === '#') {
        app.showNotification('📄 Resume download will be available soon! Please contact me directly for the latest version.', 'info', 6000);
        return;
    }
    
    // Create download link
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Adib_Hussain_Resume.pdf';
    link.target = '_blank';
    
    // Attempt download
    try {
        link.click();
        app.showNotification('📥 Resume download started!', 'success');
    } catch (error) {
        app.showNotification('❌ Download failed. Please try again.', 'error');
    }
}

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the main portfolio app
    window.portfolioApp = new PortfolioApp();
    
    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`⚡ Portfolio loaded in ${loadTime.toFixed(2)}ms`);
        });
    }
    
    // Add error handling
    window.addEventListener('error', (e) => {
        console.error('Portfolio Error:', e.error);
    });
    
    // Add unhandled promise rejection handling
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
    });
    
    console.log('🎨 Modern Portfolio App Ready!');
});

// Service Worker Registration (Optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('./sw.js')
        //     .then(registration => {
        //         console.log('SW registered: ', registration);
        //     })
        //     .catch(registrationError => {
        //         console.log('SW registration failed: ', registrationError);
        //     });
    });
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, TypingEffect, ContactFormHandler };
}