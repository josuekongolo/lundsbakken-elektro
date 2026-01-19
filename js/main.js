/* ========================================
   Lundsbakken Elektroservice - Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initScrollEffects();
    initPhoneLinks();
});

/* ========================================
   Mobile Menu
   ======================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMobile = document.querySelector('.nav-mobile');
    const body = document.body;

    if (!menuToggle || !navMobile) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMobile.classList.toggle('active');
        body.classList.toggle('menu-open');
    });

    // Close menu when clicking a link
    const navLinks = navMobile.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navMobile.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMobile.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

/* ========================================
   Smooth Scroll
   ======================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ========================================
   Contact Form
   ======================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.querySelector('.form-success');

    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: form.querySelector('[name="name"]').value,
            email: form.querySelector('[name="email"]').value,
            phone: form.querySelector('[name="phone"]').value,
            address: form.querySelector('[name="address"]').value,
            propertyType: form.querySelector('[name="propertyType"]').value,
            jobType: form.querySelector('[name="jobType"]').value,
            description: form.querySelector('[name="description"]').value,
            wantSiteVisit: form.querySelector('[name="siteVisit"]')?.checked || false
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sender...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(formData);

            // Show success message
            form.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('active');
            }

            // Track form submission (if analytics is set up)
            if (typeof gtag === 'function') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': formData.jobType
                });
            }

        } catch (error) {
            console.error('Form submission error:', error);
            alert('Beklager, noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Vennligst fyll inn navn');
    }

    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Vennligst fyll inn en gyldig e-postadresse');
    }

    if (!data.phone || !isValidPhone(data.phone)) {
        errors.push('Vennligst fyll inn et gyldig telefonnummer');
    }

    if (!data.address || data.address.trim().length < 3) {
        errors.push('Vennligst fyll inn adresse eller område');
    }

    if (!data.description || data.description.trim().length < 10) {
        errors.push('Vennligst beskriv oppdraget (minst 10 tegn)');
    }

    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }

    return true;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    // Norwegian phone numbers: 8 digits, may start with +47 or 0047
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    const re = /^(\+47|0047)?[2-9]\d{7}$/;
    return re.test(cleaned);
}

async function simulateFormSubmission(data) {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(resolve, 1500);
    });

    // REAL IMPLEMENTATION with Resend API:
    /*
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Form submission failed');
    }

    return response.json();
    */
}

/* ========================================
   Scroll Effects
   ======================================== */
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add shadow to header on scroll
        if (currentScroll > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if (animateElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animateElements.forEach(el => observer.observe(el));
    }
}

/* ========================================
   Phone Links
   ======================================== */
function initPhoneLinks() {
    // Make phone links click-to-call on mobile
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone call clicks
            if (typeof gtag === 'function') {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Click'
                });
            }
        });
    });
}

/* ========================================
   Utility Functions
   ======================================== */

// Debounce function for scroll events
function debounce(func, wait) {
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

// Format phone number for display
function formatPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
        return cleaned.replace(/(\d{3})(\d{2})(\d{3})/, '$1 $2 $3');
    }
    return phone;
}

/* ========================================
   Schema.org Structured Data
   ======================================== */
const structuredData = {
    "@context": "https://schema.org",
    "@type": "Electrician",
    "name": "Lundsbakken Elektroservice",
    "description": "Lokal elektriker i Brumunddal. Installasjon og service for bolig og hytte i Ringsaker, Sjusjoen og Budor.",
    "image": "",
    "@id": "https://lundsbakken-elektro.no",
    "url": "https://lundsbakken-elektro.no",
    "telephone": "+47900XXXXX",
    "email": "post@lundsbakken-elektro.no",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Smedsbergvegen 9",
        "addressLocality": "Brumunddal",
        "postalCode": "2388",
        "addressRegion": "Ringsaker",
        "addressCountry": "NO"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": 60.8800,
        "longitude": 10.9400
    },
    "areaServed": [
        "Brumunddal",
        "Ringsaker",
        "Moelv",
        "Hamar",
        "Sjusjoen",
        "Budor",
        "Loten"
    ],
    "priceRange": "$",
    "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "07:00",
        "closes": "16:00"
    },
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Elektrikertjenester",
        "itemListElement": [
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Boliginstallasjon"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Hytteinstallasjon"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Elbillading"}},
            {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "El-sjekk og service"}}
        ]
    },
    "sameAs": []
};

// Inject structured data
function injectStructuredData() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
}

// Call on page load
injectStructuredData();
