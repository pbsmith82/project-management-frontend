class AuthAPI {
    static showLoginModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Login</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="auth-error" class="alert alert-danger" style="display: none;"></div>
                        <form id="login-form">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" class="form-control" id="login-email" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" class="form-control" id="login-password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Login</button>
                        </form>
                        <hr>
                        <p class="text-center">Don't have an account? <a href="#" id="show-register">Register</a></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const result = await Auth.login(email, password);
            if (result.success) {
                modal.remove();
                // Hide landing page and show main app
                const landingPage = document.getElementById('landing-page');
                const mainApp = document.getElementById('main-app');
                if (landingPage) landingPage.style.display = 'none';
                if (mainApp) mainApp.style.display = 'block';
                // Initialize app
                if (typeof initializeApp === 'function') {
                    initializeApp();
                } else {
                    location.reload();
                }
            } else {
                document.getElementById('auth-error').textContent = result.error;
                document.getElementById('auth-error').style.display = 'block';
            }
        });
        
        document.getElementById('show-register').addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            this.showRegisterModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    static showRegisterModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 400px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Register</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="auth-error" class="alert alert-danger" style="display: none;"></div>
                        <form id="register-form">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" class="form-control" id="register-name" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" class="form-control" id="register-email" required>
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" class="form-control" id="register-password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Register</button>
                        </form>
                        <hr>
                        <p class="text-center">Already have an account? <a href="#" id="show-login">Login</a></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            
            const result = await Auth.register(email, password, name);
            if (result.success) {
                modal.remove();
                // Hide landing page and show main app
                const landingPage = document.getElementById('landing-page');
                const mainApp = document.getElementById('main-app');
                if (landingPage) landingPage.style.display = 'none';
                if (mainApp) mainApp.style.display = 'block';
                // Initialize app
                if (typeof initializeApp === 'function') {
                    initializeApp();
                } else {
                    location.reload();
                }
            } else {
                document.getElementById('auth-error').textContent = result.error;
                document.getElementById('auth-error').style.display = 'block';
            }
        });
        
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            modal.remove();
            this.showLoginModal();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

