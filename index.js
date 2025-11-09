// Landing page navigation
const enterAppBtn = document.getElementById('enter-app-btn')
const heroEnterBtn = document.getElementById('hero-enter-btn')
const landingPage = document.getElementById('landing-page')
const mainApp = document.getElementById('main-app')

function enterApp() {
    // Hide landing page with animation
    landingPage.classList.add('hidden')
    
    // Show main app after animation
    setTimeout(() => {
        landingPage.style.display = 'none'
        mainApp.style.display = 'block'
        // Initialize app
        initializeApp()
    }, 800)
}

if (enterAppBtn) {
    enterAppBtn.addEventListener('click', enterApp)
}

if (heroEnterBtn) {
    heroEnterBtn.addEventListener('click', enterApp)
}

// Check if user has visited before (using sessionStorage)
if (sessionStorage.getItem('hasVisited') === 'true') {
    // Skip landing page if user has visited in this session
    if (landingPage) landingPage.style.display = 'none'
    if (mainApp) mainApp.style.display = 'block'
    initializeApp()
} else {
    // Show landing page for first visit
    if (landingPage) landingPage.style.display = 'block'
    if (mainApp) mainApp.style.display = 'none'
}

function initializeApp() {
    // Mark as visited
    sessionStorage.setItem('hasVisited', 'true')
    
    // Initialize all app functionality
    const dropdown = document.getElementById('type_filter')
    const newProjectBttn = document.querySelector("#new_project")
    if (newProjectBttn) {
        newProjectBttn.addEventListener('click', newProject)
    }

    // View switching
    const projectsTab = document.getElementById('projects-tab')
    const kanbanTab = document.getElementById('kanban-tab')
    const calendarTab = document.getElementById('calendar-tab')
    const projectsView = document.getElementById('projects-view')
    const kanbanView = document.getElementById('kanban-view')
    const calendarView = document.getElementById('calendar-view')

    if (projectsTab) {
        projectsTab.addEventListener('click', () => switchView('projects'))
    }
    if (kanbanTab) {
        kanbanTab.addEventListener('click', () => switchView('kanban'))
    }
    if (calendarTab) {
        calendarTab.addEventListener('click', () => switchView('calendar'))
    }

    function switchView(view) {
        // Remove active class from all views and tabs
        const views = [projectsView, kanbanView, calendarView].filter(v => v !== null && v !== undefined);
        const tabs = [projectsTab, kanbanTab, calendarTab].filter(t => t !== null && t !== undefined);
        
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
        }
    }

    // Only initialize if elements exist
    if (dropdown) {
        dropdown.addEventListener('change', Project.typeOrder)
    }

    // Load data
    ProjectApi.getProjects()
    TypeApi.getTypes()
    StoryApi.getStories()

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
