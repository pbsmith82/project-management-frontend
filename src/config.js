// API Configuration
// Uses environment variable for backend URL, falls back to localhost for development
if (!window.API_BASE_URL || window.API_BASE_URL === '') {
    // Check if we're on localhost - use local backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.API_BASE_URL = 'http://localhost:3000';
    } else {
        // For deployed frontend, use the Heroku backend URL
        // You can override this by setting API_BASE_URL environment variable on Heroku
        window.API_BASE_URL = 'https://project-manager-backend-app-61e30c0e5428.herokuapp.com';
    }
}

// Remove trailing slash if present
if (window.API_BASE_URL && window.API_BASE_URL.endsWith('/')) {
    window.API_BASE_URL = window.API_BASE_URL.slice(0, -1);
}

console.log('API Base URL:', window.API_BASE_URL);

