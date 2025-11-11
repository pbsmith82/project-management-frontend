class Project {

    static all = []

    constructor({id, title, status, target_date, start_date, description, project_manager, project_type_id, project_type_name, attachments, tag_list, risk_score, risk_level, predicted_completion_date, risk_factors}){
        this.id = id
        this.title = title 
        this.status = status
        this.targetDate = target_date
        this.startDate = start_date
        this.description = description
        this.projectManager = project_manager  
        this.projectTypeId = project_type_id
        this.projectTypeName = project_type_name
        this.attachments = attachments || []
        this.tagList = tag_list || ''
        this.riskScore = risk_score
        this.riskLevel = risk_level
        this.predictedCompletionDate = predicted_completion_date
        this.riskFactors = risk_factors || []
        this.element = document.createElement('div')
        this.element.id = `project-${id}`
        this.element.className = "card"
        this.element.dataset.id = id 

        this.element.addEventListener('click', this.menuProject)

        Project.all.push(this)
    }

    getStatusBadgeClass(status) {
        if (!status) return 'status-badge';
        const statusLower = status.toLowerCase();
        if (statusLower.includes('active') || statusLower.includes('progress') || statusLower.includes('in-progress')) {
            return 'status-badge active';
        } else if (statusLower.includes('complete') || statusLower.includes('done') || statusLower.includes('finished')) {
            return 'status-badge completed';
        } else if (statusLower.includes('pending') || statusLower.includes('planned') || statusLower.includes('scheduled')) {
            return 'status-badge pending';
        } else if (statusLower.includes('hold') || statusLower.includes('block') || statusLower.includes('stalled')) {
            return 'status-badge on-hold';
        }
        return 'status-badge';
    }

    formatDate(dateString) {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    supplyProjects(){ 
        const statusClass = this.getStatusBadgeClass(this.status);
        
        this.element.innerHTML = 
        `<div id="${this.id}">
            <div id="title-${this.id}" class="card-header">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                   <div style="flex: 1;"> 
                       <h3>${this.title}</h3>
                   </div>
                   <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;"> 
                       <button class="btn btn-primary btn-sm" id="edit-${this.id}">
                           <i class="fas fa-edit"></i> Edit
                       </button>
                       <button class="btn btn-danger btn-sm" id="delete-${this.id}">
                           <i class="fas fa-trash"></i> Delete
                       </button>
                   </div>
                </div>
            </div>
            <div class="card-body"> 
                <h4><i class="fas fa-info-circle"></i> Status</h4>
                <div id="status-${this.id}">
                    <span class="${statusClass}">${this.status || 'Not set'}</span>
                </div>
                
                ${this.riskScore !== undefined && this.riskScore !== null ? `
                <h4><i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: 0.5rem;"></i> AI Risk Assessment</h4>
                <div id="risk-${this.id}">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                        <span class="risk-badge risk-${this.riskLevel || 'low'}" style="font-weight: 600;">
                            ${this.riskLevel ? this.riskLevel.toUpperCase() : 'LOW'} Risk (${this.riskScore || 0}%)
                        </span>
                        ${this.predictedCompletionDate ? `
                            <span style="font-size: 0.9rem; color: #718096;">
                                <i class="fas fa-crystal-ball" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i> AI Predicted: ${this.formatDate(this.predictedCompletionDate)}
                            </span>
                        ` : ''}
                    </div>
                    ${this.riskFactors && this.riskFactors.length > 0 ? `
                        <div style="font-size: 0.85rem; color: #718096;">
                            ${this.riskFactors.map(factor => `<div><i class="fas fa-circle" style="font-size: 0.5rem;"></i> ${factor}</div>`).join('')}
                        </div>
                    ` : ''}
                </div>
                ` : ''}
                
                <h4><i class="fas fa-tag"></i> Project Type</h4>
                <div id="project_type-${this.id}">
                    <span class="project-type-badge">${this.projectTypeName || 'Not set'}</span>
                </div>
                
                <h4><i class="fas fa-calendar-check"></i> Target Date</h4>
                <div id="target_date-${this.id}">${this.formatDate(this.targetDate)}</div>
                
                <h4><i class="fas fa-calendar-alt"></i> Start Date</h4>
                <div id="start_date-${this.id}">${this.formatDate(this.startDate)}</div>
                
                <h4><i class="fas fa-user-tie"></i> Project Manager</h4>
                <div id="project_manager-${this.id}">${this.projectManager || 'Not assigned'}</div>
                
                <h4 class="description-label"><i class="fas fa-align-left"></i> Description</h4>
                <div id="description-${this.id}" class="description-text">${this.description || 'No description provided'}</div>
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-secondary btn-sm" id="view-stories-${this.id}">
                <i class="fas fa-list"></i> View Stories
            </button>
            <button class="btn btn-success btn-sm" id="add-story-${this.id}">
                <i class="fas fa-plus-circle"></i> Add Story
            </button>
            <button class="btn btn-info btn-sm" id="comments-${this.id}">
                <i class="fas fa-comments"></i> Comments
            </button>
            <button class="btn btn-warning btn-sm" id="attachments-${this.id}">
                <i class="fas fa-paperclip"></i> Files
            </button>
            <button class="btn btn-sm" id="similar-projects-${this.id}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); border: none; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                <i class="fas fa-brain" style="color: white;"></i> AI Similar
            </button>
        </div>`

        return this.element
    }

    menuProject = (event) => {
        const target = event.target;
        const buttonText = target.innerText.trim();
        const buttonId = target.id;
        
        if (buttonText === "Edit" || target.closest('#edit-' + this.id)){
            this.openEditModal(event.target)
        } else if(buttonText === "Delete" || target.closest('#delete-' + this.id)){
            if (confirm(`Are you sure you want to delete "${this.title}"?`)) {
                this.element.remove() 
                ProjectApi.deleteProject(this.id)
            }
        } else if(buttonText === "Add Story" || buttonId === `add-story-${this.id}` || target.closest(`#add-story-${this.id}`)){
            Story.newStoryModal(this.id, this.title) 
        } else if(buttonText === "View Stories" || buttonId === `view-stories-${this.id}` || target.closest(`#view-stories-${this.id}`)){
            Story.viewStoriesModal(this.id, this.title) 
        } else if(buttonText === "Comments" || buttonId === `comments-${this.id}` || target.closest(`#comments-${this.id}`)){
            Comments.showCommentsModal('Project', this.id, this.title)
        } else if(buttonText === "Files" || buttonId === `attachments-${this.id}` || target.closest(`#attachments-${this.id}`)){
            const attachments = this.attachments || []
            Attachments.showAttachmentsModal('Project', this.id, attachments, this.title)
        } else if(buttonText === "AI Similar" || buttonText === "Similar" || buttonId === `similar-projects-${this.id}` || target.closest(`#similar-projects-${this.id}`)){
            this.showSimilarProjects()
        }
    }



    displayProjects(){
        
        projects.appendChild(this.supplyProjects())
    }

    openEditModal = () =>{        
        let div = document.createElement("div")
        div.className = "modal"
        div.id = `edit-project-modal-${this.id}`
        div.innerHTML = `
            <div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit ${this.title}</h5>
                        </div>
                        <div class="modal-body">
                            <label><i class="fas fa-heading"></i> Project Title</label>
                            <input type="text" name="name" class="title" value="${this.title}">
                            
                            <label><i class="fas fa-info-circle"></i> Project Status</label>
                            <input type="text" name="name" class="status" value="${this.status}" placeholder="e.g., Active, In Progress, Completed">
                            
                            <label><i class="fas fa-tag"></i> Project Type</label>
                            <select name="name" class="project_type" id="types-selector-${this.id}" value="${this.projectTypeId}"></select>
                            
                            <label><i class="fas fa-calendar-check"></i> Target Date</label>
                            <input type="date" name="name" class="target_date" value="${this.targetDate}">
                            
                            <label><i class="fas fa-user-tie"></i> Project Manager</label>
                            <input type="text" name="name" class="project_manager" value="${this.projectManager}">
                            
                            <label><i class="fas fa-align-left"></i> Description</label>
                            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <textarea name="name" class="description" rows="4" style="flex: 1;">${this.description || ''}</textarea>
                                <button type="button" class="btn btn-sm" id="ai-enhance-description-${this.id}" title="Enhance with AI" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); border: none; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                    <i class="fas fa-brain" style="color: white;"></i>
                                </button>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" id="save-project-${this.id}">
                                <i class="fas fa-save"></i> Save changes
                            </button>
                            <button type="button" class="btn btn-secondary" id="close-edit-modal-${this.id}" data-dismiss="modal">
                                <i class="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>`
        
        // Append to body instead of card element
        document.body.appendChild(div)
        
        // Add event listeners
        const closeBtn = div.querySelector(`#close-edit-modal-${this.id}`)
        const saveBtn = div.querySelector(`#save-project-${this.id}`)
        
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation()
            div.remove()
            // Update Kanban if we're in Kanban view
            if (typeof Kanban !== 'undefined' && Kanban.updateKanban) {
                Kanban.updateKanban()
            }
        })
        
        saveBtn.addEventListener('click', (event) => {
            event.stopPropagation()
            this.updateProject(event, div)
        })
        
        // Add AI enhancement button
        const aiEnhanceBtn = div.querySelector(`#ai-enhance-description-${this.id}`);
        if (aiEnhanceBtn) {
            aiEnhanceBtn.addEventListener('click', async () => {
                const titleInput = div.querySelector('.title');
                const descriptionInput = div.querySelector('.description');
                const typeSelect = div.querySelector('.project_type');
                const managerInput = div.querySelector('.project_manager');
                
                if (!titleInput.value.trim()) {
                    alert('Please enter a project title first');
                    return;
                }
                
                aiEnhanceBtn.disabled = true;
                aiEnhanceBtn.innerHTML = '<i class="fas fa-spinner fa-spin" style="color: white;"></i>';
                
                const projectType = typeSelect.options[typeSelect.selectedIndex]?.text || null;
                const projectManager = managerInput.value || null;
                
                const result = await AIService.generateDescription(
                    titleInput.value,
                    projectType,
                    projectManager
                );
                
                aiEnhanceBtn.disabled = false;
                aiEnhanceBtn.innerHTML = '<i class="fas fa-brain" style="color: white;"></i>';
                
                if (result.description) {
                    descriptionInput.value = result.description;
                    descriptionInput.style.borderColor = '#10b981';
                    setTimeout(() => {
                        descriptionInput.style.borderColor = '';
                    }, 2000);
                } else {
                    alert(result.error || 'Failed to generate description');
                }
            });
        }
        
        // Close on backdrop click
        div.addEventListener('click', (e) => {
            // Only close if clicking directly on the modal backdrop, not on modal content
            if (e.target === div && !e.target.closest('.modal-dialog')) {
                div.remove()
                // Update Kanban if we're in Kanban view
                if (typeof Kanban !== 'undefined' && Kanban.updateKanban) {
                    Kanban.updateKanban()
                }
            }
        })
        
        // Get types for the dropdown
        const selectorId = `types-selector-${this.id}`
        TypeApi.getTypes(div, selectorId, this.projectTypeId)
    }

    updateProject = (event, modalElement) => {
        const modal = modalElement || document.querySelector(`#edit-project-modal-${this.id}`)
        
        if (!modal) return
        
        // Check if close button was clicked
        if (event && event.target) {
            const target = event.target.closest('button')
            if (target && (target.id === `close-edit-modal-${this.id}` || target.textContent.includes('Close'))) {
                modal.remove()
                return
            }
        }
        
        // Check if save button was clicked (by ID or text content)
        const isSaveClick = !event || 
                           (event.target && (
                               event.target.id === `save-project-${this.id}` ||
                               event.target.closest(`#save-project-${this.id}`) ||
                               event.target.textContent.includes('Save changes') ||
                               event.target.closest('button')?.textContent.includes('Save changes')
                           ))
        
        if (isSaveClick) {
            // Get form values
            const titleInput = modal.querySelector(".title")
            const statusInput = modal.querySelector(".status")
            const targetDateInput = modal.querySelector(".target_date")
            const projectTypeSelect = modal.querySelector(".project_type")
            const projectManagerInput = modal.querySelector(".project_manager")
            const descriptionInput = modal.querySelector(".description")
            
            if (!titleInput || !statusInput || !targetDateInput || !projectTypeSelect || !projectManagerInput || !descriptionInput) {
                console.error('Form fields not found')
                return
            }
            
            this.title = titleInput.value
            this.status = statusInput.value
            this.targetDate = targetDateInput.value
            this.startDate = this.startDate || this.start_date // Preserve existing start_date
            this.project_type_id = parseInt(projectTypeSelect.value)
            this.project_manager = projectManagerInput.value
            this.description = descriptionInput.value
            
            ProjectApi.patch(this).then(() => {
                // Update Kanban if we're in Kanban view
                if (typeof Kanban !== 'undefined' && Kanban.updateKanban) {
                    Kanban.updateKanban()
                }
            }).catch(error => {
                console.error('Error updating project:', error)
                alert('Failed to save project. Please try again.')
            })
            
            // Remove modal after saving
            modal.remove()
            
            // Update the status badge after saving
            const statusElement = this.element.querySelector(`#status-${this.id}`);
            if (statusElement) {
                const statusClass = this.getStatusBadgeClass(this.status);
                statusElement.innerHTML = `<span class="${statusClass}">${this.status || 'Not set'}</span>`;
            }
        }
    }
    
    static newProjectModal(event) {
        this.element = document.createElement("div")
        this.element.className = "modal"
        this.element.id = "newProjectModal"
        this.element.innerHTML = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">New Project</h5>
                </div>
                <div class="modal-body">
                    <label><i class="fas fa-heading"></i> Project Title</label>
                    <input type="text" name="title" class="title" placeholder="Enter project title">
                    
                    <label><i class="fas fa-info-circle"></i> Project Status</label>
                    <input type="text" name="status" class="status" placeholder="e.g., Active, In Progress, Completed">
                    
                    <label><i class="fas fa-tag"></i> Project Type</label>
                    <select name="project_type" class="project_type" id="types-selector"></select>
                    
                    <label><i class="fas fa-calendar-check"></i> Target Date</label>
                    <input type="date" name="target_date" class="target_date">
                    
                    <label><i class="fas fa-calendar-alt"></i> Start Date</label>
                    <input type="date" name="start_date" class="start_date">
                    
                    <label><i class="fas fa-user-tie"></i> Project Manager</label>
                    <input type="text" name="project_manager" class="project_manager" placeholder="Enter project manager name">
                    
                    <label><i class="fas fa-align-left"></i> Description</label>
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <textarea name="description" class="description" rows="4" placeholder="Enter project description" style="flex: 1;"></textarea>
                        <button type="button" class="btn btn-sm" id="ai-generate-description" title="Generate with AI" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); border: none; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                            <i class="fas fa-brain" style="color: white;"></i>
                        </button>
                    </div>
                    <div id="ai-description-loading" style="display: none; font-size: 0.9rem; padding: 0.5rem; background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); border-radius: 8px; border-left: 3px solid #667eea; margin-top: 0.5rem;">
                        <i class="fas fa-spinner fa-spin" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: 0.5rem;"></i> <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 600;">AI Generating description...</span>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create_new_record">
                        <i class="fas fa-plus-circle"></i> Create New Record
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        <i class="fas fa-times"></i> Close
                    </button>
                </div>
                </div>
            </div>
            </div>`
        
        // Append to body instead of projects container
        document.body.appendChild(this.element)
        
        // Add AI description generation
        const aiBtn = this.element.querySelector('#ai-generate-description');
        if (aiBtn) {
            aiBtn.addEventListener('click', async () => {
                const titleInput = this.element.querySelector('.title');
                const descriptionInput = this.element.querySelector('.description');
                const typeSelect = this.element.querySelector('.project_type');
                const managerInput = this.element.querySelector('.project_manager');
                const loadingDiv = this.element.querySelector('#ai-description-loading');
                
                if (!titleInput.value.trim()) {
                    alert('Please enter a project title first');
                    return;
                }
                
                loadingDiv.style.display = 'block';
                aiBtn.disabled = true;
                
                const projectType = typeSelect.options[typeSelect.selectedIndex]?.text || null;
                const projectManager = managerInput.value || null;
                
                const result = await AIService.generateDescription(
                    titleInput.value,
                    projectType,
                    projectManager
                );
                
                loadingDiv.style.display = 'none';
                aiBtn.disabled = false;
                
                if (result.description) {
                    descriptionInput.value = result.description;
                    descriptionInput.style.borderColor = '#10b981';
                    setTimeout(() => {
                        descriptionInput.style.borderColor = '';
                    }, 2000);
                } else {
                    alert(result.error || 'Failed to generate description. Make sure OPENAI_API_KEY is configured.');
                }
            });
        }
        
        // Add direct event listeners to buttons
        const createBtn = this.element.querySelector('#create_new_record');
        const closeBtn = this.element.querySelector('[data-dismiss="modal"]');
        
        if (createBtn) {
            createBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleCreateProject(this.element);
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.element.remove();
            });
        }
        
        // Also handle backdrop clicks (only if clicking the backdrop, not modal content)
        const innerModal = this.element.querySelector('.modal');
        if (innerModal) {
            innerModal.addEventListener('click', (e) => {
                // Only close if clicking directly on the modal backdrop, not on modal content
                if (e.target === innerModal || (e.target.classList.contains('modal') && !e.target.closest('.modal-dialog'))) {
                    this.element.remove();
                }
            });
        }
        
        TypeApi.getTypes(this.element, 'types-selector', null)
    }

    static handleCreateProject(modalElement) {
        const modal = modalElement || document.querySelector("#newProjectModal");
        if (!modal) return;
        
        // Get form values
        const titleInput = modal.querySelector(".title");
        const statusInput = modal.querySelector(".status");
        const targetDateInput = modal.querySelector(".target_date");
        const startDateInput = modal.querySelector(".start_date");
        const projectTypeSelect = modal.querySelector(".project_type");
        const projectManagerInput = modal.querySelector(".project_manager");
        const descriptionInput = modal.querySelector(".description");
        
        if (!titleInput || !statusInput || !targetDateInput || !startDateInput || !projectTypeSelect || !projectManagerInput || !descriptionInput) {
            console.error('Form fields not found');
            return;
        }
        
        // Create project data object
        const projectData = {
            title: titleInput.value,
            status: statusInput.value,
            target_date: targetDateInput.value,
            start_date: startDateInput.value,
            project_type_id: parseInt(projectTypeSelect.value) || null,
            project_manager: projectManagerInput.value,
            description: descriptionInput.value
        };
        
        // Validate required fields
        if (!projectData.title || !projectData.status || !projectData.start_date) {
            alert('Please fill in all required fields: Title, Status, and Start Date');
            return;
        }
        
        // Create the project
        ProjectApi.createProject(projectData).then(() => {
            modal.remove();
            // Refresh projects list
            ProjectApi.getProjects();
        }).catch(error => {
            console.error('Error creating project:', error);
            alert('Failed to create project. Please try again.');
        });
    }

    showSimilarProjects = async () => {
        const response = await AIService.findSimilar(this.id)
        const similar = response.data || []
        
        if (similar.length === 0) {
            alert('No similar projects found')
            return
        }
        
        const modal = document.createElement('div')
        modal.className = 'modal'
        modal.id = 'similar-projects-modal'
        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 600px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: 0.5rem;"></i> AI-Powered Similar Projects to "${this.title}"</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="similar-projects-list"></div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        `
        
        document.body.appendChild(modal)
        
        const listContainer = modal.querySelector('#similar-projects-list')
        listContainer.innerHTML = similar.map(project => `
            <div class="similar-project-item" style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 1rem; cursor: pointer; transition: all 0.2s;" 
                 onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 2px 8px rgba(102,126,234,0.2)'"
                 onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                 onclick="const p = Project.all.find(p => p.id == ${project.id}); if(p) { p.element.scrollIntoView({behavior: 'smooth'}); document.getElementById('similar-projects-modal').remove(); }">
                <h6 style="margin: 0 0 0.5rem 0; color: #1a202c; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i>
                    ${project.attributes.title}
                </h6>
                <p style="margin: 0; color: #718096; font-size: 0.9rem;">${project.attributes.description ? project.attributes.description.substring(0, 100) + '...' : 'No description'}</p>
            </div>
        `).join('')
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.closest('.close') || e.target.closest('[data-dismiss="modal"]')) {
                modal.remove()
            }
        })
    }
    
    static typeOrder(event){
        let filteredType = event.target.value
        if (filteredType && !parseInt(filteredType) == 0){
            for (const project of Project.all){
                if(project.projectTypeId === parseInt(filteredType)){
                    project.element.style.display = ""
                } else {
                    project.element.style.display = "none"
                }
            }
        } else {
   
            
            for (const project of Project.all){
                project.element.style.display = ""
            }
        }
    }




}