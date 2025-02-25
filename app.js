// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Check if user has already paid
    const accessData = localStorage.getItem('gtl_access');
    if (accessData) {
        try {
            const { paid, timestamp } = JSON.parse(accessData);
            if (paid) {
                // Skip splash and welcome screens, go straight to main
                setTimeout(() => {
                    document.getElementById('splash-screen').classList.remove('active');
                    document.getElementById('main-screen').classList.add('active');
                }, 2000);
                return;
            }
        } catch (e) {
            console.error('Error checking payment status:', e);
        }
    }

    // If no payment, show normal flow
    setTimeout(() => {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('welcome-screen').classList.add('active');
    }, 2000);
});

// Navigation functions
function navigateToMain() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('paywall-screen').classList.add('active');
}

function goBack() {
    document.getElementById('paywall-screen').classList.remove('active');
    document.getElementById('welcome-screen').classList.add('active');
}

function showSuccessPopup() {
    const popup = document.getElementById('success-popup');
    popup.classList.add('active');
}

function hideSuccessPopup() {
    const popup = document.getElementById('success-popup');
    popup.classList.remove('active');
    navigateToMainContent();
}

function navigateToMainContent() {
    document.getElementById('paywall-screen').classList.remove('active');
    document.getElementById('main-screen').classList.add('active');
}

// Section Navigation
function switchSection(sectionId) {
    // Update nav buttons
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(button => {
        button.classList.remove('active');
        if (button.textContent.trim().toLowerCase().includes(sectionId)) {
            button.classList.add('active');
        }
    });

    // Update content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${sectionId}-section`) {
            section.classList.add('active');
        }
    });
}

// Paystack integration
function handlePayment() {
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter your email address');
        return;
    }

    const handler = window.PaystackPop.setup({
        key: 'pk_test_69641eb5ac7fe49353fab0c5c41ac33d713e644e',
        email: email,
        amount: 10000, // Amount in pesewas (100 GHS = 10000 pesewas)
        currency: 'GHS',
        ref: 'gtl_' + Math.floor((Math.random() * 1000000000) + 1),
        callback: function(response) {
            // Handle successful payment
            if (response.status === 'success') {
                // Store payment info in localStorage
                localStorage.setItem('gtl_access', JSON.stringify({
                    email: email,
                    paid: true,
                    timestamp: new Date().toISOString()
                }));
                // Show success popup
                showSuccessPopup();
            }
        },
        onClose: function() {
            // Handle popup closed
        }
    });
    handler.openIframe();
}
