// ========================================================================
// CUSTOMER PORTAL - AUTHENTICATION & DASHBOARD
// ========================================================================

// Simple in-memory user database (replace with real backend)
// In production, use Firebase, Supabase, or your own backend
const DEMO_USERS = {
    'demo@practice.co.za': {
        password: 'demo123',
        firstName: 'Jane',
        lastName: 'Smith',
        practice: 'Smith Family Practice',
        phone: '082 123 4567',
        package: 'Professional',
        purchaseDate: '2026-01-15',
        orderNumber: 'TRACKER-SMITH-001'
    }
};

// Current logged-in user
let currentUser = null;

// ========================================================================
// PAGE NAVIGATION
// ========================================================================

function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('forgotPasswordPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

function showRegister() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'flex';
    document.getElementById('forgotPasswordPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'none';
}

function showForgotPassword() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('forgotPasswordPage').style.display = 'flex';
    document.getElementById('dashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('forgotPasswordPage').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// ========================================================================
// AUTHENTICATION FORMS
// ========================================================================

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo authentication (replace with real backend)
    if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
        currentUser = { email, ...DEMO_USERS[email] };
        
        // Save to localStorage (simple persistence)
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Load dashboard
        loadDashboard();
        showDashboard();
        showNotification('Welcome back! Logged in successfully.', 'success');
    } else {
        showNotification('Invalid email or password', 'error');
    }
});

// Registration Form
document.getElementById('registerForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Validate passwords match
    if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Validate password strength
    if (data.password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }
    
    // In production: Send to backend API for verification and account creation
    // For now, simulate registration
    
    showNotification('Account created! Please wait for verification (we\'ll email you within 24 hours)', 'success');
    
    // After verification, user would login normally
    setTimeout(() => {
        showLogin();
    }, 3000);
});

// Forgot Password Form
document.getElementById('forgotPasswordPage')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    // In production: Send password reset email
    showNotification('Password reset link sent to ' + email, 'success');
    
    setTimeout(() => {
        showLogin();
    }, 2000);
});

// ========================================================================
// DASHBOARD MANAGEMENT
// ========================================================================

function loadDashboard() {
    if (!currentUser) return;
    
    // Update user name displays
    document.querySelectorAll('#userName, #userName2').forEach(el => {
        el.textContent = `Dr. ${currentUser.firstName} ${currentUser.lastName}`;
    });
    
    // Update package display
    document.querySelectorAll('#userPackage, #accountPackage').forEach(el => {
        el.textContent = currentUser.package;
    });
    
    // Update account info
    document.getElementById('accountName').textContent = `Dr. ${currentUser.firstName} ${currentUser.lastName}`;
    document.getElementById('accountEmail').textContent = currentUser.email;
    document.getElementById('accountPractice').textContent = currentUser.practice;
    document.getElementById('accountPhone').textContent = currentUser.phone;
    document.getElementById('accountPurchaseDate').textContent = currentUser.purchaseDate;
    
    // Calculate support expiry (1 year for Professional/Enterprise, 6 months for Essential)
    const purchaseDate = new Date(currentUser.purchaseDate);
    const supportMonths = currentUser.package === 'Essential' ? 6 : 12;
    const supportUntil = new Date(purchaseDate);
    supportUntil.setMonth(supportUntil.getMonth() + supportMonths);
    document.getElementById('accountSupportUntil').textContent = supportUntil.toLocaleDateString('en-ZA');
    
    // Member since
    document.getElementById('memberSince').textContent = purchaseDate.toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' });
    
    // Support response time based on package
    const responseTime = {
        'Essential': '48 hours',
        'Professional': '24 hours',
        'Enterprise': '12 hours'
    };
    document.getElementById('supportResponseTime').textContent = responseTime[currentUser.package] || '24-48 hours';
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionName + 'Section').style.display = 'block';
    
    // Update sidebar active state
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Logout
function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
    showNotification('Logged out successfully', 'success');
}

// ========================================================================
// DASHBOARD ACTIONS
// ========================================================================

function downloadFile(type) {
    const files = {
        'tracker': 'SA_DISPENSARY_COMPLIANCE_TRACKER.xlsx',
        'documentation': 'Documentation_Package.zip',
        'script': 'COMPLIANCE_TRACKER_APPS_SCRIPT.gs'
    };
    
    // In production: Generate signed download URL from backend
    // For now, show message
    showNotification(`Downloading ${files[type]}...`, 'success');
    
    // Simulate download
    // In production, would be:
    // window.location.href = 'https://your-cdn.com/downloads/' + currentUser.email + '/' + files[type];
}

function openVideoTutorial() {
    showNotification('Opening video tutorial library...', 'success');
    // In production: Open video portal or redirect to YouTube playlist
    // window.open('https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID', '_blank');
}

function editAccount() {
    showNotification('Account editing feature coming soon', 'info');
    // In production: Show modal with editable form
}

function upgradePackage() {
    showNotification('Redirecting to upgrade page...', 'info');
    // In production: Redirect to payment page with upgrade options
    // window.location.href = '/upgrade?from=' + currentUser.package;
}

function changePassword() {
    showNotification('Password change feature coming soon', 'info');
    // In production: Show modal with password change form
}

// ========================================================================
// NOTIFICATION SYSTEM
// ========================================================================

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style notification
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        info: '#0EA5E9',
        warning: '#F59E0B'
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '24px',
        right: '24px',
        padding: '16px 24px',
        borderRadius: '8px',
        backgroundColor: colors[type] || colors.info,
        color: '#FFFFFF',
        fontWeight: '600',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// CSS Animations
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
`;
document.head.appendChild(style);

// ========================================================================
// INITIALIZATION
// ========================================================================

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            loadDashboard();
            showDashboard();
        } catch (e) {
            localStorage.removeItem('currentUser');
            showLogin();
        }
    } else {
        showLogin();
    }
});

console.log('Customer Portal loaded! 🎉');
console.log('Demo login: demo@practice.co.za / demo123');
