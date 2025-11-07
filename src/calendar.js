class Calendar {
    static currentDate = new Date();
    static projects = [];

    static init() {
        this.setupEventListeners();
        this.renderCalendar();
    }

    static setupEventListeners() {
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');
        const todayBtn = document.getElementById('today-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.navigateMonth(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.navigateMonth(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
    }

    static navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
    }

    static goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    static updateProjects(projects) {
        // Ensure IDs are numbers for consistency
        this.projects = projects.map(p => ({
            ...p,
            id: typeof p.id === 'string' ? parseInt(p.id) : p.id
        }));
        this.renderCalendar();
    }

    static renderCalendar() {
        const container = document.getElementById('calendar-container');
        if (!container) return;

        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // Update month/year display
        const monthYearEl = document.getElementById('calendar-month-year');
        if (monthYearEl) {
            monthYearEl.textContent = this.currentDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
            });
        }

        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Create calendar HTML
        let calendarHTML = '<div class="calendar-grid">';
        
        // Day headers
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarHTML += '<div class="calendar-day empty"></div>';
        }

        // Days of the month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = this.formatDateString(date);
            const isToday = this.isSameDay(date, today);
            const isPast = date < today && !isToday;
            
            const projectsOnThisDay = this.getProjectsForDate(dateString);
            
            calendarHTML += `<div class="calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''}">`;
            calendarHTML += `<div class="calendar-day-number">${day}</div>`;
            
            if (projectsOnThisDay.length > 0) {
                calendarHTML += '<div class="calendar-projects">';
                projectsOnThisDay.forEach(project => {
                    const statusClass = this.getStatusClass(project.status);
                    calendarHTML += `
                        <div class="calendar-project ${statusClass}" 
                             data-project-id="${project.id}" 
                             title="${project.title} - ${project.status}"
                             style="cursor: pointer;">
                            <i class="fas fa-project-diagram"></i>
                            <span class="calendar-project-title">${this.truncateText(project.title, 15)}</span>
                        </div>
                    `;
                });
                calendarHTML += '</div>';
            }
            
            calendarHTML += '</div>';
        }

        calendarHTML += '</div>';
        container.innerHTML = calendarHTML;
        
        // Add click event listeners to calendar projects
        this.attachProjectClickHandlers();
    }

    static attachProjectClickHandlers() {
        const projectElements = document.querySelectorAll('.calendar-project[data-project-id]');
        projectElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectIdStr = element.getAttribute('data-project-id');
                const projectId = projectIdStr ? parseInt(projectIdStr) : null;
                
                if (!projectId || isNaN(projectId)) {
                    console.error('Invalid project ID:', projectIdStr);
                    alert('Invalid project ID');
                    return;
                }
                
                this.showProjectDetails(projectId);
            });
        });
    }

    static showProjectDetails(projectId) {
        // Normalize projectId to number for comparison
        const searchId = typeof projectId === 'string' ? parseInt(projectId) : projectId;
        
        if (isNaN(searchId)) {
            console.error('Invalid project ID:', projectId);
            alert('Invalid project ID');
            return;
        }
        
        // First try to find in Calendar.projects (simplified data)
        let project = this.projects.find(p => {
            const pId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
            return pId === searchId;
        });
        
        // If not found, try to find in Project.all (full data)
        if (!project && Project.all && Project.all.length > 0) {
            const fullProject = Project.all.find(p => {
                const pId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
                return pId === searchId;
            });
            
            if (fullProject) {
                project = {
                    id: fullProject.id,
                    title: fullProject.title,
                    targetDate: fullProject.targetDate,
                    startDate: fullProject.startDate,
                    status: fullProject.status,
                    description: fullProject.description,
                    projectManager: fullProject.projectManager,
                    projectTypeName: fullProject.projectTypeName,
                    projectTypeId: fullProject.projectTypeId
                };
            }
        }
        
        if (!project) {
            console.error('Project not found. Searched for ID:', searchId);
            console.error('Calendar.projects count:', this.projects.length);
            console.error('Project.all count:', Project.all ? Project.all.length : 0);
            console.error('Available project IDs in Calendar.projects:', this.projects.map(p => ({ id: p.id, title: p.title })));
            if (Project.all && Project.all.length > 0) {
                console.error('Available project IDs in Project.all:', Project.all.map(p => ({ id: p.id, title: p.title })));
            }
            alert(`Project not found (ID: ${searchId}). The project may not be loaded yet. Please try clicking again or refresh the page.`);
            return;
        }

        // Get status badge class
        const statusClass = this.getStatusBadgeClass(project.status);
        
        // Format dates
        const formatDate = (dateString) => {
            if (!dateString) return 'Not set';
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        };

        // Create modal - append to body to ensure it's on top
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'calendar-project-modal';
        modal.innerHTML = `
            <div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document" style="max-width: 600px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                <i class="fas fa-project-diagram"></i> ${project.title}
                            </h5>
                        </div>
                        <div class="modal-body">
                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 0.5rem;">
                                    <i class="fas fa-info-circle"></i> Status
                                </h4>
                                <span class="${statusClass}" style="display: inline-block;">${project.status || 'Not set'}</span>
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 0.5rem;">
                                    <i class="fas fa-tag"></i> Project Type
                                </h4>
                                <span class="project-type-badge">${project.projectTypeName || 'Not set'}</span>
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 0.5rem;">
                                    <i class="fas fa-calendar-check"></i> Target Date
                                </h4>
                                <div>${formatDate(project.targetDate)}</div>
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 0.5rem;">
                                    <i class="fas fa-calendar-alt"></i> Start Date
                                </h4>
                                <div>${formatDate(project.startDate)}</div>
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 0.5rem;">
                                    <i class="fas fa-user-tie"></i> Project Manager
                                </h4>
                                <div>${project.projectManager || 'Not assigned'}</div>
                            </div>

                            <div style="margin-bottom: 1.5rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; color: #718096; text-transform: uppercase; margin-bottom: 0.5rem;">
                                    <i class="fas fa-align-left"></i> Description
                                </h4>
                                <div style="line-height: 1.6; color: #2d3748;">${project.description || 'No description provided'}</div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="edit-project-from-calendar">
                                <i class="fas fa-edit"></i> Edit Project
                            </button>
                            <button type="button" class="btn btn-secondary" id="close-calendar-modal">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Add event listeners
        const closeBtn = modal.querySelector('#close-calendar-modal');
        const editBtn = modal.querySelector('#edit-project-from-calendar');

        closeBtn.addEventListener('click', () => {
            modal.remove();
        });

        editBtn.addEventListener('click', () => {
            modal.remove();
            // Switch to projects view and trigger edit
            if (typeof switchView === 'function') {
                switchView('projects');
                setTimeout(() => {
                    const projectElement = document.getElementById(`project-${projectId}`);
                    if (projectElement) {
                        const editButton = projectElement.querySelector(`#edit-${projectId}`);
                        if (editButton) {
                            editButton.click();
                        }
                    }
                }, 300);
            }
        });

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal')) {
                modal.remove();
            }
        });
    }

    static getStatusBadgeClass(status) {
        if (!status) return 'status-badge';
        const statusLower = status.toLowerCase();
        if (statusLower.includes('active') || statusLower.includes('progress') || statusLower.includes('in-progress')) {
            return 'status-badge active';
        } else if (statusLower.includes('complete') || statusLower.includes('done') || statusLower.includes('finished')) {
            return 'status-badge completed';
        } else if (statusLower.includes('pending') || statusLower.includes('planned') || statusLower.includes('scheduled')) {
            return 'status-badge pending';
        } else if (statusLower.includes('hold') || statusLower.includes('block')) {
            return 'status-badge on-hold';
        }
        return 'status-badge';
    }

    static getProjectsForDate(dateString) {
        return this.projects.filter(project => {
            if (!project.targetDate) return false;
            try {
                const projectDate = this.formatDateString(new Date(project.targetDate));
                return projectDate === dateString;
            } catch (e) {
                console.error('Error parsing date for project:', project, e);
                return false;
            }
        });
    }

    static formatDateString(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    static getStatusClass(status) {
        if (!status) return '';
        const statusLower = status.toLowerCase();
        if (statusLower.includes('active') || statusLower.includes('progress') || statusLower.includes('in-progress')) {
            return 'status-active';
        } else if (statusLower.includes('complete') || statusLower.includes('done') || statusLower.includes('finished')) {
            return 'status-completed';
        } else if (statusLower.includes('pending') || statusLower.includes('planned') || statusLower.includes('scheduled')) {
            return 'status-pending';
        } else if (statusLower.includes('hold') || statusLower.includes('block')) {
            return 'status-on-hold';
        }
        return '';
    }

    static truncateText(text, maxLength) {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
}

