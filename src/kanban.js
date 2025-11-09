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
        // Ensure project ID is stored as string for dataset
        card.dataset.projectId = String(project.id);
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

        // Add drag event listeners - use capture phase to ensure we get the card
        card.addEventListener('dragstart', (e) => {
            e.stopPropagation();
            this.handleDragStart(e);
        }, true);
        card.addEventListener('dragend', (e) => {
            this.handleDragEnd(e);
        });
        card.addEventListener('click', (e) => {
            this.handleCardClick(e);
        });

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
        // Make sure we get the card element, not a child element
        const card = e.target.closest('.kanban-card');
        if (!card) {
            console.error('Drag started on non-card element');
            return;
        }
        
        this.draggedElement = card;
        this.draggedColumn = card.closest('.kanban-column-body');
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', card.outerHTML);
        
        // Store the project ID in dataTransfer for backup
        const projectId = card.dataset.projectId;
        if (projectId) {
            e.dataTransfer.setData('text/plain', projectId);
        }
    }

    static handleDragEnd(e) {
        // Remove dragging class from the card, not just the target
        const card = e.target.closest('.kanban-card') || e.target;
        if (card && card.classList) {
            card.classList.remove('dragging');
        }
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

        // Get project ID from dataset, handling both string and number
        const projectIdStr = this.draggedElement.dataset.projectId;
        if (!projectIdStr) {
            console.error('No project ID found on dragged element');
            this.draggedElement = null;
            this.draggedColumn = null;
            return;
        }

        const projectId = parseInt(projectIdStr);
        if (isNaN(projectId)) {
            console.error('Invalid project ID:', projectIdStr);
            this.draggedElement = null;
            this.draggedColumn = null;
            return;
        }

        // Try to find project with flexible ID comparison
        const project = Project.all.find(p => {
            const pId = typeof p.id === 'string' ? parseInt(p.id) : p.id;
            return pId === projectId;
        });
        
        if (!project) {
            console.error('Project not found for ID:', projectId);
            console.log('Available project IDs:', Project.all.map(p => p.id));
            console.log('Dragged element:', this.draggedElement);
            console.log('Dataset:', this.draggedElement.dataset);
            // Still move the card visually, but don't save
            if (this.draggedElement.parentNode !== columnBody) {
                if (this.draggedElement.parentNode) {
                    this.draggedElement.parentNode.removeChild(this.draggedElement);
                }
                columnBody.appendChild(this.draggedElement);
                this.updateColumnCounts();
            }
            alert('Project not found. Card moved visually but not saved. Please refresh the page.');
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
            
            // Store reference to the card element before async operation
            const cardElement = this.draggedElement;
            
            // Save to API
            ProjectApi.patch(project).then(() => {
                // Check if card element still exists in DOM
                if (cardElement && cardElement.parentNode) {
                    // Update the card's data-status attribute
                    cardElement.dataset.status = newStatus;
                    // Update the status badge in the card
                    const statusBadge = cardElement.querySelector('.status-badge');
                    if (statusBadge) {
                        const newStatusClass = project.getStatusBadgeClass ? project.getStatusBadgeClass(newStatus) : 'status-badge';
                        statusBadge.className = newStatusClass;
                        statusBadge.textContent = newStatus;
                    }
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

