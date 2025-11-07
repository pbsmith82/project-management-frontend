const dropdown = document.getElementById('type_filter')
const newProjectBttn = document.querySelector("#new_project")
newProjectBttn.addEventListener('click', newProject)

// View switching
const projectsTab = document.getElementById('projects-tab')
const calendarTab = document.getElementById('calendar-tab')
const projectsView = document.getElementById('projects-view')
const calendarView = document.getElementById('calendar-view')

if (projectsTab) {
    projectsTab.addEventListener('click', () => switchView('projects'))
}
if (calendarTab) {
    calendarTab.addEventListener('click', () => switchView('calendar'))
}

function switchView(view) {
    if (view === 'projects') {
        projectsView.classList.add('active')
        calendarView.classList.remove('active')
        projectsTab.classList.add('active')
        calendarTab.classList.remove('active')
    } else if (view === 'calendar') {
        calendarView.classList.add('active')
        projectsView.classList.remove('active')
        calendarTab.classList.add('active')
        projectsTab.classList.remove('active')
        Calendar.renderCalendar()
    }
}

ProjectApi.getProjects()
TypeApi.getTypes()
StoryApi.getStories()

// Initialize calendar
Calendar.init()

function newProject(event) {
    Project.newProjectModal(event)
}

dropdown.addEventListener('change', Project.typeOrder)

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

// Update calendar after a short delay to allow projects to load
setTimeout(() => {
    updateCalendar()
}, 500)

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

// Initial stats update
setTimeout(() => {
    updateHeroStats()
}, 1000)