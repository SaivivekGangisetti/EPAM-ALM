document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signup-form');
    const signinForm = document.getElementById('signin-form');
    const toggleFormText = document.getElementById('toggle-form-text');
    const formTitle = document.getElementById('form-title');
    const authAlert = document.getElementById('auth-alert');

    if (localStorage.getItem('currentUser')) {
        redirectToHome();
    }

    toggleFormText.addEventListener('click', function(e) {
        if (e.target.classList.contains('form-toggle')) {
            const isSignUpVisible = signupForm.style.display !== 'none';

            if (isSignUpVisible) {
                signupForm.style.display = 'none';
                signinForm.style.display = 'block';
                formTitle.textContent = 'Sign In';
                toggleFormText.innerHTML = 'Don\'t have an account? <span class="form-toggle">Sign Up</span>';
            } else {
                signinForm.style.display = 'none';
                signupForm.style.display = 'block';
                formTitle.textContent = 'Sign Up';
                toggleFormText.innerHTML = 'Already have an account? <span class="form-toggle">Sign In</span>';
            }

            authAlert.style.display = 'none';
        }
    });

    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        document.getElementById('name-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('password-error').textContent = '';
        document.getElementById('confirm-password-error').textContent = '';

        let isValid = true;

        if (name.length < 3) {
            document.getElementById('name-error').textContent = 'Name must be at least 3 characters';
            isValid = false;
        }

        if (!validateEmail(email)) {
            document.getElementById('email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        if (password.length < 6) {
            document.getElementById('password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById('confirm-password-error').textContent = 'Passwords do not match';
            isValid = false;
        }

        if (!isValid) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userExists = users.some(user => user.email === email);

        if (userExists) {
            showAlert('A user with this email already exists', 'danger');
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        showAlert('Account created successfully! Redirecting...', 'success');
        signupForm.reset();
        setTimeout(redirectToHome, 1500);
    });

    signinForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;

        document.getElementById('signin-email-error').textContent = '';
        document.getElementById('signin-password-error').textContent = '';

        let isValid = true;

        if (!validateEmail(email)) {
            document.getElementById('signin-email-error').textContent = 'Please enter a valid email address';
            isValid = false;
        }

        if (password.length < 6) {
            document.getElementById('signin-password-error').textContent = 'Password must be at least 6 characters';
            isValid = false;
        }

        if (!isValid) return;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);

        if (!user) {
            showAlert('No account found with this email', 'danger');
            return;
        }

        if (user.password !== password) {
            showAlert('Incorrect password', 'danger');
            return;
        }

        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('Login successful! Redirecting...', 'success');
        signinForm.reset();
        setTimeout(redirectToHome, 1500);
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function showAlert(message, type) {
        authAlert.textContent = message;
        authAlert.className = `alert alert-${type}`;
        authAlert.style.display = 'block';
        setTimeout(() => {
            authAlert.style.display = 'none';
        }, 3000);
    }

    function redirectToHome() {
        window.location.href = 'home.html';
    }
});

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function redirectToHome() {
    window.location.href = 'home.html';
}
