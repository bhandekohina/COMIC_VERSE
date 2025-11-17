let loggedInUser = null;

// Auth Functionality
function initAuthUI() {
    const storedUser = localStorage.getItem('comicverse-user');
    loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    renderAuthArea();

    const openAuthBtn = document.getElementById('openAuthBtn');
    if (openAuthBtn) {
        openAuthBtn.addEventListener('click', () => {
            showSignin();
            openAuthModal();
        });
    }

    // Also add event listeners to any existing auth buttons
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'openAuthBtn') {
            showSignin();
            openAuthModal();
        }
    });
}

function renderAuthArea() {
    const userArea = document.getElementById('userArea');
    if (!userArea) return;

    userArea.innerHTML = '';

    if (loggedInUser) {
        const nameDiv = document.createElement('div');
        nameDiv.className = 'user-name';
        nameDiv.textContent = loggedInUser.name;

        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'user-btn';
        logoutBtn.textContent = 'Logout';
        logoutBtn.onclick = logout;

        userArea.appendChild(nameDiv);
        userArea.appendChild(logoutBtn);
    } else {
        const signInBtn = document.createElement('button');
        signInBtn.id = 'openAuthBtn';
        signInBtn.className = 'user-btn';
        signInBtn.textContent = 'Sign In';
        signInBtn.onclick = () => {
            showSignin();
            openAuthModal();
        };

        userArea.appendChild(signInBtn);
    }
}

function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('active');
    }
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.remove('active');
    }
}

function showSignin() {
    const authTitle = document.getElementById('authTitle');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    if (authTitle) authTitle.textContent = 'Sign In';
    if (signInForm) signInForm.classList.add('active');
    if (signUpForm) signUpForm.classList.remove('active');
}

function showSignup() {
    const authTitle = document.getElementById('authTitle');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    
    if (authTitle) authTitle.textContent = 'Create Account';
    if (signInForm) signInForm.classList.remove('active');
    if (signUpForm) signUpForm.classList.add('active');
}

function submitSignUp() {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-pass');
    
    if (!nameInput || !emailInput || !passwordInput) {
        alert('Form elements not found');
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!name || !email || !password || password.length < 4) {
        alert('Please enter name, valid email and password (minimum 4 characters)');
        return;
    }

    // Save to local user list
    let users = JSON.parse(localStorage.getItem('comicverse-users') || '[]');
    
    if (users.find(user => user.email === email)) {
        alert('An account with this email already exists. Please sign in instead.');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('comicverse-users', JSON.stringify(users));

    // Auto-login
    loggedInUser = { name, email };
    localStorage.setItem('comicverse-user', JSON.stringify(loggedInUser));
    
    renderAuthArea();
    closeAuthModal();
    alert(`Account created successfully! Welcome, ${name}!`);
}

function submitSignIn() {
    const emailInput = document.getElementById('signin-email');
    const passwordInput = document.getElementById('signin-pass');
    
    if (!emailInput || !passwordInput) {
        alert('Form elements not found');
        return;
    }

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    const users = JSON.parse(localStorage.getItem('comicverse-users') || '[]');
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (!foundUser) {
        alert('No matching account found. Please check your credentials or sign up.');
        return;
    }

    loggedInUser = { name: foundUser.name, email: foundUser.email };
    localStorage.setItem('comicverse-user', JSON.stringify(loggedInUser));
    
    renderAuthArea();
    closeAuthModal();
    alert(`Welcome back, ${foundUser.name}!`);
}

function logout() {
    localStorage.removeItem('comicverse-user');
    loggedInUser = null;
    renderAuthArea();
    alert('You have been logged out successfully.');
}

function skipAuth() {
    closeAuthModal();
    localStorage.setItem('comicverse-skipped-auth', 'true');
    console.log('User skipped authentication - continuing as guest');
}

// Make functions globally available
window.initAuthUI = initAuthUI;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.showSignin = showSignin;
window.showSignup = showSignup;
window.submitSignUp = submitSignUp;
window.submitSignIn = submitSignIn;
window.logout = logout;
window.skipAuth = skipAuth;