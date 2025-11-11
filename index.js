// Landing page navigation
const enterAppBtn = document.getElementById('enter-app-btn')
const heroEnterBtn = document.getElementById('hero-enter-btn')
const landingPage = document.getElementById('landing-page')
const mainApp = document.getElementById('main-app')

async function enterApp() {
    // Initialize auth first
    await Auth.init()
    
    // Check if user is authenticated
    if (Auth.token) {
        // Try to get current user to verify token is valid
        const user = await Auth.getCurrentUser()
        if (user && Auth.isAuthenticated()) {
            // User is authenticated, proceed to app
            landingPage.classList.add('hidden')
            setTimeout(() => {
                landingPage.style.display = 'none'
                mainApp.style.display = 'block'
                initializeApp()
            }, 800)
        } else {
            // Token is invalid, show login
            Auth.token = null
            Auth.currentUser = null
            localStorage.removeItem('auth_token')
            showAuthRequired()
        }
    } else {
        // Not authenticated, show login/register modal
        showAuthRequired()
    }
}

function showAuthRequired() {
    // Show login modal with message
    setTimeout(() => {
        AuthAPI.showLoginModal()
        // Add a message to the modal about needing to login
        setTimeout(() => {
            const modal = document.getElementById('auth-modal')
            if (modal) {
                const modalBody = modal.querySelector('.modal-body')
                if (modalBody && !modalBody.querySelector('.auth-required-message')) {
                    const message = document.createElement('div')
                    message.className = 'alert alert-info auth-required-message'
                    message.style.marginBottom = '1rem'
                    message.innerHTML = '<i class="fas fa-info-circle"></i> Please login or register to access the application.'
                    modalBody.insertBefore(message, modalBody.firstChild)
                }
            }
        }, 100)
    }, 100)
}

if (enterAppBtn) {
    enterAppBtn.addEventListener('click', enterApp)
}

if (heroEnterBtn) {
    heroEnterBtn.addEventListener('click', enterApp)
}

// Check authentication on page load
(async function checkAuthOnLoad() {
    // Initialize auth first
    await Auth.init()
    
    // Check if user has visited before (using sessionStorage)
    const hasVisited = sessionStorage.getItem('hasVisited') === 'true'
    
    if (hasVisited && Auth.token) {
        // Try to verify token is still valid
        const user = await Auth.getCurrentUser()
        if (user && Auth.isAuthenticated()) {
            // User is authenticated, skip landing page
            if (landingPage) landingPage.style.display = 'none'
            if (mainApp) mainApp.style.display = 'block'
            initializeApp()
        } else {
            // Token invalid, show landing page
            if (landingPage) landingPage.style.display = 'block'
            if (mainApp) mainApp.style.display = 'none'
            sessionStorage.removeItem('hasVisited')
            Auth.token = null
            Auth.currentUser = null
            localStorage.removeItem('auth_token')
        }
    } else {
        // Show landing page for first visit or if not authenticated
        if (landingPage) landingPage.style.display = 'block'
        if (mainApp) mainApp.style.display = 'none'
        // Clear any invalid session data
        if (!Auth.isAuthenticated()) {
            sessionStorage.removeItem('hasVisited')
        }
    }
})()

function initializeApp() {
    // Check authentication before initializing
    if (!Auth.isAuthenticated()) {
        // Not authenticated, redirect to landing page
        const landingPage = document.getElementById('landing-page')
        const mainApp = document.getElementById('main-app')
        if (landingPage) landingPage.style.display = 'block'
        if (mainApp) mainApp.style.display = 'none'
        sessionStorage.removeItem('hasVisited')
        showAuthRequired()
        return
    }
    
    // Mark as visited
    sessionStorage.setItem('hasVisited', 'true')
    
    // Initialize authentication UI
    updateAuthUI()
    
    // Initialize WebSocket
    if (Auth.isAuthenticated()) {
        WebSocketClient.connect()
    }
    
    // Initialize all app functionality
    const dropdown = document.getElementById('type_filter')
    const newProjectBttn = document.querySelector("#new_project")
    if (newProjectBttn) {
        newProjectBttn.addEventListener('click', newProject)
    }
    
    // Auth buttons
    const loginBtn = document.getElementById('login-btn')
    const logoutBtn = document.getElementById('logout-btn')
    if (loginBtn) {
        loginBtn.addEventListener('click', () => AuthAPI.showLoginModal())
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => Auth.logout())
    }
    
    // Search button
    const searchBtn = document.getElementById('search-btn')
    if (searchBtn) {
        searchBtn.addEventListener('click', () => Search.showSearchModal())
    }

    // View switching
    const projectsTab = document.getElementById('projects-tab')
    const kanbanTab = document.getElementById('kanban-tab')
    const calendarTab = document.getElementById('calendar-tab')
    const analyticsTab = document.getElementById('analytics-tab')
    const projectsView = document.getElementById('projects-view')
    const kanbanView = document.getElementById('kanban-view')
    const calendarView = document.getElementById('calendar-view')
    const analyticsView = document.getElementById('analytics-view')

    if (projectsTab) {
        projectsTab.addEventListener('click', () => switchView('projects'))
    }
    if (kanbanTab) {
        kanbanTab.addEventListener('click', () => switchView('kanban'))
    }
    if (calendarTab) {
        calendarTab.addEventListener('click', () => switchView('calendar'))
    }
    if (analyticsTab) {
        analyticsTab.addEventListener('click', () => switchView('analytics'))
    }

    function switchView(view) {
        // Remove active class from all views and tabs
        const views = [projectsView, kanbanView, calendarView, analyticsView].filter(v => v !== null && v !== undefined);
        const tabs = [projectsTab, kanbanTab, calendarTab, analyticsTab].filter(t => t !== null && t !== undefined);
        
        views.forEach(v => {
            if (v && v.classList) v.classList.remove('active');
        });
        tabs.forEach(t => {
            if (t && t.classList) t.classList.remove('active');
        });

        if (view === 'projects') {
            if (projectsView && projectsView.classList) projectsView.classList.add('active');
            if (projectsTab && projectsTab.classList) projectsTab.classList.add('active');
        } else if (view === 'kanban') {
            if (kanbanView && kanbanView.classList) kanbanView.classList.add('active');
            if (kanbanTab && kanbanTab.classList) kanbanTab.classList.add('active');
            // Initialize and render Kanban
            if (typeof Kanban !== 'undefined' && Kanban.init) {
                try {
                    Kanban.init();
                } catch (error) {
                    console.error('Error initializing Kanban:', error);
                }
            }
        } else if (view === 'calendar') {
            if (calendarView && calendarView.classList) calendarView.classList.add('active');
            if (calendarTab && calendarTab.classList) calendarTab.classList.add('active');
            if (typeof Calendar !== 'undefined' && Calendar.renderCalendar) {
                Calendar.renderCalendar();
            }
        } else if (view === 'analytics') {
            if (analyticsView && analyticsView.classList) analyticsView.classList.add('active');
            if (analyticsTab && analyticsTab.classList) analyticsTab.classList.add('active');
            if (typeof Analytics !== 'undefined' && Analytics.renderDashboard) {
                Analytics.renderDashboard();
            }
        }
    }
    
    function updateAuthUI() {
        const userMenu = document.getElementById('user-menu')
        const loginBtn = document.getElementById('login-btn')
        const userName = document.getElementById('user-name')
        
        if (Auth.isAuthenticated() && Auth.currentUser) {
            if (userMenu) userMenu.style.display = 'flex'
            if (loginBtn) loginBtn.style.display = 'none'
            if (userName) userName.textContent = Auth.currentUser.name || Auth.currentUser.email
        } else {
            if (userMenu) userMenu.style.display = 'none'
            if (loginBtn) loginBtn.style.display = 'block'
        }
    }

    // Only initialize if elements exist
    if (dropdown) {
        dropdown.addEventListener('change', Project.typeOrder)
    }

    // Load data only if authenticated
    if (Auth.isAuthenticated()) {
        ProjectApi.getProjects().catch(error => {
            console.error('Error loading projects:', error);
            if (error.message === 'Authentication required') {
                // Redirect to landing page if auth fails
                const landingPage = document.getElementById('landing-page');
                const mainApp = document.getElementById('main-app');
                if (landingPage) landingPage.style.display = 'block';
                if (mainApp) mainApp.style.display = 'none';
                sessionStorage.removeItem('hasVisited');
                showAuthRequired();
            }
        });
        TypeApi.getTypes();
        StoryApi.getStories().catch(error => {
            console.error('Error loading stories:', error);
        });
    }

    // Initialize calendar
    Calendar.init()
    
    // Update calendar after a short delay to allow projects to load
    setTimeout(() => {
        updateCalendar()
    }, 500)
    
    // Initial stats update
    setTimeout(() => {
        updateHeroStats()
    }, 1000)
}

function newProject(event) {
    Project.newProjectModal(event)
}

// Function to update calendar with current projects
function updateCalendar() {
    const projectsData = Project.all.map(p => ({
        id: p.id,
        title: p.title,
        targetDate: p.targetDate,
        startDate: p.startDate,
        status: p.status,
        description: p.description,
        projectManager: p.projectManager,
        projectTypeName: p.projectTypeName,
        projectTypeId: p.projectTypeId
    }))
    Calendar.updateProjects(projectsData)
}

// Update hero banner stats
function updateHeroStats() {
    const totalProjects = Project.all.length
    const totalStories = Story.all.length
    
    const projectsEl = document.getElementById('total-projects')
    const storiesEl = document.getElementById('total-stories')
    
    if (projectsEl) {
        projectsEl.textContent = totalProjects
        // Animate number change
        projectsEl.style.transform = 'scale(1.1)'
        setTimeout(() => {
            projectsEl.style.transform = 'scale(1)'
        }, 200)
    }
    
    if (storiesEl) {
        storiesEl.textContent = totalStories
        // Animate number change
        storiesEl.style.transform = 'scale(1.1)'
        setTimeout(() => {
            storiesEl.style.transform = 'scale(1)'
        }, 200)
    }
}

// Update stats when projects/stories are loaded
const originalGetProjects = ProjectApi.getProjects
ProjectApi.getProjects = function() {
    const result = originalGetProjects.call(this)
    setTimeout(() => {
        updateHeroStats()
    }, 300)
    return result
}

const originalGetStories = StoryApi.getStories
StoryApi.getStories = function() {
    const result = originalGetStories.call(this)
    setTimeout(() => {
        updateHeroStats()
    }, 300)
    return result
}
