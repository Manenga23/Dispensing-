// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Form submission handler
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Here you would normally send to your backend
            // For now, we'll use Netlify Forms
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            showNotification('Success! We\'ll send you payment details within 24 hours.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Track conversion (if using analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL',
                    'value': data.package === 'essential' ? 999 : data.package === 'professional' ? 1499 : 2999,
                    'currency': 'ZAR'
                });
            }
            
        } catch (error) {
            showNotification('Error sending request. Please try again or email us directly.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#0EA5E9',
        color: '#FFFFFF',
        fontWeight: '600',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Pricing calculator (if you want to add dynamic pricing)
function calculatePrice(packageType, addOns = []) {
    const basePrices = {
        essential: 999,
        professional: 1499,
        enterprise: 2999
    };
    
    const addOnPrices = {
        scanner: 1500,
        training: 1200,
        audit: 2500
    };
    
    let total = basePrices[packageType] || 0;
    
    addOns.forEach(addOn => {
        total += addOnPrices[addOn] || 0;
    });
    
    return total;
}

// Track scroll depth for analytics
let maxScroll = 0;
window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestones
        if (maxScroll > 25 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', { depth: '25%' });
        }
        if (maxScroll > 50 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', { depth: '50%' });
        }
        if (maxScroll > 75 && typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', { depth: '75%' });
        }
    }
});

// CTA button click tracking
document.querySelectorAll('.btn-hero, .btn-primary, .btn-pricing, .btn-pricing-featured').forEach(button => {
    button.addEventListener('click', (e) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                button_text: e.target.textContent,
                button_location: e.target.closest('section')?.className || 'unknown'
            });
        }
    });
});

// Package selection tracking
const packageSelect = document.getElementById('package');
if (packageSelect) {
    packageSelect.addEventListener('change', (e) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'package_selected', {
                package: e.target.value
            });
        }
    });
}

// Video modal (if you add a demo video)
function openVideoModal(videoId) {
    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.innerHTML = `
        <div class="video-modal-overlay"></div>
        <div class="video-modal-content">
            <button class="video-modal-close">&times;</button>
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close handlers
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = '';
    };
    
    modal.querySelector('.video-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.video-modal-overlay').addEventListener('click', closeModal);
}

// FAQ accordion (optional enhancement)
document.querySelectorAll('.faq-item h3').forEach(question => {
    question.style.cursor = 'pointer';
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display === 'block';
        
        // Close all other answers
        document.querySelectorAll('.faq-item p').forEach(p => {
            p.style.display = 'none';
        });
        
        // Toggle current answer
        answer.style.display = isOpen ? 'none' : 'block';
    });
});

// Lazy loading for images (if you add product screenshots)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
}

// Add viewport animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .step-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Add animation class
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyle);

console.log('SA Compliance Tracker website loaded successfully! 🚀');
