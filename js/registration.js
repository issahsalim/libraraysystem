document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('form-signup');
    const loginForm = document.getElementById('form-login');
    const signupCard = document.getElementById('signup-form');
    const loginCard = document.getElementById('login-form');

    // Show login form link click event
    document.getElementById('show-login-form').addEventListener('click', (event) => {
        event.preventDefault();
        signupCard.style.display = 'none';
        loginCard.style.display = 'block';
    });

    // Show signup form link click event
    document.getElementById('show-signup-form').addEventListener('click', (event) => {
        event.preventDefault();
        loginCard.style.display = 'none';
        signupCard.style.display = 'block';
    });

    // Show/Hide Password in Signup Form
    document.getElementById('show-signup-password').addEventListener('change', function () {
        const signupPassword = document.getElementById('signup-password');
        const confirmPassword = document.getElementById('c_password');
        const type = this.checked ? 'text' : 'password';
        signupPassword.type = type;
        confirmPassword.type = type;
    });

    // Show/Hide Password in Login Form
    document.getElementById('show-login-password').addEventListener('change', function () {
        const loginPassword = document.getElementById('login-password');
        loginPassword.type = this.checked ? 'text' : 'password';
    });

    // Signup form submission
    signupForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('signup-username').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('c_password').value;

        // Check if passwords match
        if (password !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Mismatch Password',
                text: 'Passwords do not match. Please try again.',
            });
            return;
        }

        // Check if user already exists
        if (localStorage.getItem(username)) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'User already exists!',
            });
        } else {
            // Store user in LocalStorage
            localStorage.setItem(username, password);
            Swal.fire({
                icon: 'success',
                title: 'Signup Successful',
                text: 'You can now log in!',
            }).then(() => {
                signupCard.style.display = 'none'; // Hide signup form
                loginCard.style.display = 'block'; // Show login form
            });
        }

        // Clear input fields
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';
        document.getElementById('c_password').value = '';
    });

    // Login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        // Authenticate user
        const storedPassword = localStorage.getItem(username);
        if (storedPassword && storedPassword === password) {
            window.location.href = 'home.html'; // Redirect to home page after successful login
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Credentials',
                text: 'Incorrect username or password!',
            });
        }

        // Clear input fields
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    });
});
