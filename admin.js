// API endpoints
const API_URL = 'http://localhost/ghana-tax-laws/api/api.php';

// DOM Elements
const loginSection = document.querySelector('.login-section');
const contentSection = document.querySelector('.content-section');
const loginForm = document.getElementById('loginForm');
const logoutButton = document.querySelector('.logout-button');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const taxLawForm = document.getElementById('taxLawForm');
const practiceNoteForm = document.getElementById('practiceNoteForm');
const taxLawsList = document.getElementById('taxLawsList');
const practiceNotesList = document.getElementById('practiceNotesList');

// Authentication State
let currentUser = null;

// Check if user is logged in
function checkAuth() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        currentUser = { id: userId };
        showContent();
        loadContent();
    } else {
        showLogin();
    }
}

// Show/Hide Sections
function showLogin() {
    loginSection.style.display = 'flex';
    contentSection.style.display = 'none';
}

function showContent() {
    loginSection.style.display = 'none';
    contentSection.style.display = 'block';
}

// Login Form Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const response = await fetch(`${API_URL}?action=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            currentUser = { id: data.data.user_id };
            localStorage.setItem('userId', data.data.user_id);
            showToast('Logged in successfully', 'success');
            showContent();
            loadContent();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Logout Handler
logoutButton.addEventListener('click', () => {
    localStorage.removeItem('userId');
    currentUser = null;
    showLogin();
});

// Tab Navigation
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        const targetId = button.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
    });
});

// Tax Law Form Handler
taxLawForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        formData.append('created_by', currentUser.id);

        const response = await fetch(`${API_URL}?action=add_tax_law`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Tax law added successfully', 'success');
            e.target.reset();
            loadTaxLaws();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Practice Note Form Handler
practiceNoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        formData.append('created_by', currentUser.id);

        const response = await fetch(`${API_URL}?action=add_practice_note`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        
        if (response.ok) {
            showToast('Practice note added successfully', 'success');
            e.target.reset();
            loadPracticeNotes();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
});

// Load Content
async function loadContent() {
    await Promise.all([loadTaxLaws(), loadPracticeNotes()]);
}

async function loadTaxLaws() {
    try {
        const response = await fetch(`${API_URL}?action=get_tax_laws`);
        const data = await response.json();
        
        if (response.ok) {
            taxLawsList.innerHTML = data.data.map(law => `
                <div class="list-item">
                    <div class="item-info">
                        <h3>${law.title}</h3>
                        <p>${law.description}</p>
                    </div>
                    <div class="item-actions">
                        <button class="action-button" onclick="editTaxLaw(${law.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-button delete-button" onclick="deleteTaxLaw(${law.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function loadPracticeNotes() {
    try {
        const response = await fetch(`${API_URL}?action=get_practice_notes`);
        const data = await response.json();
        
        if (response.ok) {
            practiceNotesList.innerHTML = data.data.map(note => `
                <div class="list-item">
                    <div class="item-info">
                        <h3>${note.title}</h3>
                        <p>${note.description}</p>
                    </div>
                    <div class="item-actions">
                        <button class="action-button" onclick="editPracticeNote(${note.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-button delete-button" onclick="deletePracticeNote(${note.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Delete Handlers
async function deleteTaxLaw(id) {
    if (!confirm('Are you sure you want to delete this tax law?')) return;
    
    try {
        const response = await fetch(`${API_URL}?action=delete_tax_law&id=${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Tax law deleted successfully', 'success');
            loadTaxLaws();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

async function deletePracticeNote(id) {
    if (!confirm('Are you sure you want to delete this practice note?')) return;
    
    try {
        const response = await fetch(`${API_URL}?action=delete_practice_note&id=${id}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast('Practice note deleted successfully', 'success');
            loadPracticeNotes();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showToast(error.message, 'error');
    }
}

// Toast Message Helper
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize app
checkAuth();
