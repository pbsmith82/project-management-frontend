class Project {

    static all = []

    constructor({id, title, status, target_date, start_date, description, project_manager, project_type_id, project_type_name}){
        this.id = id
        this.title = title 
        this.status = status
        this.targetDate = target_date
        this.startDate = start_date
        this.description = description
        this.projectManager = project_manager  
        this.projectTypeId = project_type_id
        this.projectTypeName = project_type_name
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
                            <textarea name="name" class="description" rows="4">${this.description || ''}</textarea>
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
        
        closeBtn.addEventListener('click', () => {
            div.remove()
        })
        
        saveBtn.addEventListener('click', (event) => {
            event.stopPropagation()
            this.updateProject(event, div)
        })
        
        // Close on backdrop click
        div.addEventListener('click', (e) => {
            if (e.target === div || e.target.classList.contains('modal')) {
                div.remove()
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
            this.target_date = targetDateInput.value
            this.project_type_id = parseInt(projectTypeSelect.value)
            this.project_manager = projectManagerInput.value
            this.description = descriptionInput.value
            
            ProjectApi.patch(this)
            
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
                    <textarea name="description" class="description" rows="4" placeholder="Enter project description"></textarea>
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
        
        this.element.addEventListener('click', this.recordNewProject)
        TypeApi.getTypes(this.element, 'types-selector', null)
    }

    static recordNewProject(event) {
        
        const modal = document.querySelector("#newProjectModal")
        
        if (event.target.innerText === "Create New Record"){
            
            this.title = this.querySelector(".title").value
            this.status = this.querySelector(".status").value
            this.target_date = this.querySelector(".target_date").value
            this.start_date = this.querySelector(".start_date").value
            this.project_type_id = parseInt(this.querySelector(".project_type").value)
            this.project_manager = this.querySelector(".project_manager").value
            this.description = this.querySelector(".description").value
            ProjectApi.createProject(this)
            modal.remove()

        }
        else if (event.target.innerText === "Close"){
            modal.remove()
        }        
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