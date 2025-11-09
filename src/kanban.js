class Kanban {
    static columns = [
        { id: 'pending', title: 'Pending', statuses: ['pending', 'planned', 'scheduled', 'new'] },
        { id: 'active', title: 'Active', statuses: ['active', 'in progress', 'in-progress', 'progress'] },
        { id: 'on-hold', title: 'On Hold', statuses: ['hold', 'on hold', 'blocked', 'stalled'] },
        { id: 'completed', title: 'Completed', statuses: ['complete', 'completed', 'done', 'finished'] }
    ];

    static draggedElement = null;
    static draggedColumn = null;

    static init() {
        this.renderKanban();
        this.setupEventListeners();
    }

    static renderKanban() {
        const kanbanView = document.getElementById('kanban-view');
        if (!kanbanView) {
            console.error('Kanban view element not found');
            return;
        }

        try {
            kanbanView.innerHTML = `
                <div class="kanban-container">
                    ${this.columns.map(column => `
                        <div class="kanban-column" data-column-id="${column.id}">
                            <div class="kanban-column-header">
                                <h3>${column.title}</h3>
                                <span class="kanban-count" id="count-${column.id}">0</span>
                            </div>
                            <div class="kanban-column-body" data-status="${column.id}">
                                <!-- Cards will be inserted here -->
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            this.updateKanban();
        } catch (error) {
            console.error('Error rendering Kanban:', error);
        }
    }

    static updateKanban() {
        try {
            // Check if Project class exists
            if (typeof Project === 'undefined' || !Project.all) {
                console.warn('Project class or Project.all not available');
                return;
            }

            // Clear all columns
            this.columns.forEach(column => {
                const columnBody = document.querySelector(`.kanban-column-body[data-status="${column.id}"]`);
                if (columnBody) {
                    columnBody.innerHTML = '';
                }
            });

            // Distribute projects to columns based on status
            if (Array.isArray(Project.all)) {
                Project.all.forEach(project => {
                    const column = this.getColumnForStatus(project.status);
                    if (column) {
                        this.addProjectToColumn(project, column.id);
                    } else {
                        // Default to pending if status doesn't match
                        this.addProjectToColumn(project, 'pending');
                    }
                });
            }

            // Update counts
            this.updateColumnCounts();
        } catch (error) {
            console.error('Error updating Kanban:', error);
        }
    }

    static getColumnForStatus(status) {
        if (!status) return this.columns.find(c => c.id === 'pending');
        
        const statusLower = status.toLowerCase();
        return this.columns.find(column => 
            column.statuses.some(s => statusLower.includes(s))
        ) || this.columns.find(c => c.id === 'pending');
    }

    static addProjectToColumn(project, columnId) {
        const columnBody = document.querySelector(`.kanban-column-body[data-status="${columnId}"]`);
        if (!columnBody) return;

        // Create a simplified card for Kanban
        const card = document.createElement('div');
        card.className = 'kanban-card';
        card.draggable = true;
        card.dataset.projectId = project.id;
        card.dataset.status = project.status || '';

        const statusClass = project.getStatusBadgeClass ? project.getStatusBadgeClass(project.status) : 'status-badge';
        
        card.innerHTML = `
            <div class="kanban-card-header">
                <h4>${project.title || 'Untitled'}</h4>
            </div>
            <div class="kanban-card-body">
                <div class="kanban-card-status">
                    <span class="${statusClass}">${project.status || 'Not set'}</span>
                </div>
                ${project.projectTypeName ? `
                    <div class="kanban-card-type">
                        <i class="fas fa-tag"></i> ${project.projectTypeName}
                    </div>
                ` : ''}
                ${project.targetDate ? `
                    <div class="kanban-card-date">
                        <i class="fas fa-calendar-check"></i> ${project.formatDate ? project.formatDate(project.targetDate) : project.targetDate}
                    </div>
                ` : ''}
                ${project.projectManager ? `
                    <div class="kanban-card-manager">
                        <i class="fas fa-user-tie"></i> ${project.projectManager}
                    </div>
                ` : ''}
                ${project.description ? `
                    <div class="kanban-card-description">
                        ${project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}
                    </div>
                ` : ''}
            </div>
            <div class="kanban-card-footer">
                <button class="btn btn-sm btn-primary kanban-edit-btn" data-project-id="${project.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-sm btn-secondary kanban-view-btn" data-project-id="${project.id}">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        `;

        // Add drag event listeners
        card.addEventListener('dragstart', this.handleDragStart.bind(this));
        card.addEventListener('dragend', this.handleDragEnd.bind(this));
        card.addEventListener('click', this.handleCardClick.bind(this));

        columnBody.appendChild(card);
    }

    static updateColumnCounts() {
        this.columns.forEach(column => {
            const columnBody = document.querySelector(`.kanban-column-body[data-status="${column.id}"]`);
            const count = columnBody ? columnBody.children.length : 0;
            const countElement = document.getElementById(`count-${column.id}`);
            if (countElement) {
                countElement.textContent = count;
            }
        });
    }

    static setupEventListeners() {
        // Column drop zones
        document.querySelectorAll('.kanban-column-body').forEach(columnBody => {
            columnBody.addEventListener('dragover', this.handleDragOver.bind(this));
            columnBody.addEventListener('drop', this.handleDrop.bind(this));
            columnBody.addEventListener('dragenter', this.handleDragEnter.bind(this));
            columnBody.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });

        // Edit and view buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.kanban-edit-btn')) {
                const projectId = parseInt(e.target.closest('.kanban-edit-btn').dataset.projectId);
                const project = Project.all.find(p => p.id === projectId);
                if (project) {
                    project.openEditModal();
                }
            } else if (e.target.closest('.kanban-view-btn')) {
                const projectId = parseInt(e.target.closest('.kanban-view-btn').dataset.projectId);
                const project = Project.all.find(p => p.id === projectId);
                if (project) {
                    // Switch to projects view and scroll to project
                    const projectsTab = document.getElementById('projects-tab');
                    if (projectsTab) {
                        projectsTab.click();
                        setTimeout(() => {
                            project.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            project.element.style.animation = 'pulse 1s ease';
                            setTimeout(() => {
                                project.element.style.animation = '';
                            }, 1000);
                        }, 100);
                    }
                }
            }
        });
    }

    static handleDragStart(e) {
        this.draggedElement = e.target;
        this.draggedColumn = e.target.closest('.kanban-column-body');
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    static handleDragEnd(e) {
        e.target.classList.remove('dragging');
        document.querySelectorAll('.kanban-column-body').forEach(col => {
            col.classList.remove('drag-over');
        });
    }

    static handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    static handleDragEnter(e) {
        e.preventDefault();
        const columnBody = e.currentTarget;
        if (columnBody !== this.draggedColumn) {
            columnBody.classList.add('drag-over');
        }
    }

    static handleDragLeave(e) {
        const columnBody = e.currentTarget;
        columnBody.classList.remove('drag-over');
    }

    static handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const columnBody = e.currentTarget;
        columnBody.classList.remove('drag-over');

        if (!this.draggedElement) return;

        const projectId = parseInt(this.draggedElement.dataset.projectId);
        const project = Project.all.find(p => p.id === projectId);
        
        if (!project) {
            console.error('Project not found for ID:', projectId);
            this.draggedElement = null;
            this.draggedColumn = null;
            return;
        }

        const newColumnId = columnBody.dataset.status;
        const newColumn = this.columns.find(c => c.id === newColumnId);
        
        if (!newColumn) {
            console.error('Column not found for ID:', newColumnId);
            this.draggedElement = null;
            this.draggedColumn = null;
            return;
        }

        // Determine new status based on column
        let newStatus = '';
        if (newColumnId === 'pending') {
            newStatus = 'Pending';
        } else if (newColumnId === 'active') {
            newStatus = 'Active';
        } else if (newColumnId === 'on-hold') {
            newStatus = 'On Hold';
        } else if (newColumnId === 'completed') {
            newStatus = 'Completed';
        }

        // Check if we're moving to a different column
        const currentColumn = this.getColumnForStatus(project.status);
        const isMovingColumn = !currentColumn || currentColumn.id !== newColumnId;

        if (isMovingColumn && project.status !== newStatus) {
            const oldStatus = project.status;
            project.status = newStatus;
            
            // Remove card from old column if it exists
            if (this.draggedElement.parentNode) {
                this.draggedElement.parentNode.removeChild(this.draggedElement);
            }
            
            // Add card to new column
            columnBody.appendChild(this.draggedElement);
            this.updateColumnCounts();
            
            // Save to API
            ProjectApi.patch(project).then(() => {
                // Update the card's data-status attribute
                this.draggedElement.dataset.status = newStatus;
                // Update the status badge in the card
                const statusBadge = this.draggedElement.querySelector('.status-badge');
                if (statusBadge) {
                    const newStatusClass = project.getStatusBadgeClass ? project.getStatusBadgeClass(newStatus) : 'status-badge';
                    statusBadge.className = newStatusClass;
                    statusBadge.textContent = newStatus;
                }
                // Show success feedback
                this.showSaveFeedback(project.title, newStatus);
                // Don't call updateKanban() here - the card is already in the right place
                // Only update if there's an error
            }).catch(error => {
                console.error('Error updating project status:', error);
                // Revert status on error
                project.status = oldStatus;
                // Revert Kanban view to original state
                this.updateKanban();
                alert('Failed to save project status. Please try again.');
            });
        } else {
            // Just move the card visually if status is the same or already in correct column
            if (this.draggedElement.parentNode !== columnBody) {
                if (this.draggedElement.parentNode) {
                    this.draggedElement.parentNode.removeChild(this.draggedElement);
                }
                columnBody.appendChild(this.draggedElement);
                this.updateColumnCounts();
            }
        }

        this.draggedElement = null;
        this.draggedColumn = null;
    }

    static handleCardClick(e) {
        // Don't trigger if clicking on buttons
        if (e.target.closest('button')) {
            return;
        }
        
        const card = e.target.closest('.kanban-card');
        if (card) {
            const projectId = parseInt(card.dataset.projectId);
            const project = Project.all.find(p => p.id === projectId);
            if (project) {
                project.openEditModal();
            }
        }
    }

    static showSaveFeedback(projectTitle, newStatus) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.className = 'kanban-save-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${projectTitle} moved to ${newStatus}</span>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }
}

