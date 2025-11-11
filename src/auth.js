class Auth {
    static currentUser = null;
    static token = localStorage.getItem('auth_token') || null;
    
    static async init() {
        // Check if user is already logged in
        if (this.token) {
            await this.getCurrentUser();
        }
    }
    
    static async register(email, password, name) {
        const response = await fetch(`${window.API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: { email, password, name }
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            this.token = data.token;
            this.currentUser = data.user.data.attributes;
            localStorage.setItem('auth_token', this.token);
            return { success: true, user: this.currentUser };
        } else {
            return { success: false, error: data.error || 'Registration failed' };
        }
    }
    
    static async login(email, password) {
        const response = await fetch(`${window.API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            this.token = data.token;
            this.currentUser = data.user.data.attributes;
            localStorage.setItem('auth_token', this.token);
            return { success: true, user: this.currentUser };
        } else {
            return { success: false, error: data.error || 'Login failed' };
        }
    }
    
    static async getCurrentUser() {
        if (!this.token) return null;
        
        try {
            const response = await fetch(`${window.API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.data.attributes;
                return this.currentUser;
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
        
        return null;
    }
    
    static logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('auth_token');
        window.location.reload();
    }
    
    static getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
    
    static isAuthenticated() {
        // Check if we have both token and current user
        return !!(this.token && this.currentUser);
    }
    
    static async waitForAuth() {
        // Wait for authentication to be verified
        if (this.token && !this.currentUser) {
            await this.getCurrentUser();
        }
        return this.isAuthenticated();
    }
}

