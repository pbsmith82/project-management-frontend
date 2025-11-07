class Story {

    static all = []

    constructor({id, title, description, status, acceptance_criteria, project_id, project_title}) {
        this.id = id
        this.title = title
        this.description = description
        this.status = status
        this.acceptanceCriteria = acceptance_criteria
        this.projectId = project_id
        this.projectTitle = project_title
        Story.all.push(this)
    }




    static newStoryModal(projectId, projectTitle) {
        const container = document.getElementById('projects')
        
        
        this.element = document.createElement("div")
        this.element.className = "modal"
        this.element.innerHTML = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-book"></i> New Story</h5>
                </div>
                <div class="modal-body">
                    <div class="projectTitle"><i class="fas fa-project-diagram"></i> ${projectTitle}</div>
                    <input type="hidden" name="project_id" id="project_id" class="hidden" value="${projectId}">
                    
                    <label><i class="fas fa-heading"></i> Title</label>
                    <input type="text" name="title" class="title" placeholder="Enter story title">
                    
                    <label><i class="fas fa-info-circle"></i> Status</label>
                    <input type="text" name="status" class="status" placeholder="e.g., To Do, In Progress, Done">
                    
                    <label><i class="fas fa-align-left"></i> Description</label>
                    <textarea name="description" class="description" rows="4" placeholder="Enter story description"></textarea>
                    
                    <label><i class="fas fa-check-circle"></i> Acceptance Criteria</label>
                    <textarea name="acceptance_criteria" class="acceptance_criteria" rows="4" placeholder="Enter acceptance criteria"></textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create_new_story">
                        <i class="fas fa-save"></i> Save New Story
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
                </div>
            </div>
            </div>`
            this.element.addEventListener('click', this.newStoryMenu)
        container.append(this.element)
    }
    


    static viewStoriesModal(projectId, projectTitle) {

        const container = document.getElementById('projects')
        const storyAll =  Story.all.filter(story => story.projectId === parseInt(projectId))
        //debugger
        this.element = document.createElement("div")
        this.element.className = "modal"
        this.element.id ="storyListModal"
        this.element.dataset.id = `${projectId}`
        this.element.dataset.name = `${projectTitle}`
        this.element.innerHTML = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-list"></i> ${projectTitle} Stories</h5>
                    </div>
                    <div class="modal-body">
                        <ul id="stories">
                        </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" id="create_new_story">
                            <i class="fas fa-plus-circle"></i> Create New Story
                        </button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>
            </div>
        </div>`

        this.element.addEventListener('click', this.storyListMenu)
        container.append(this.element)
        this.showProjectStories(storyAll)
    }
   



    static getStatusBadgeClass(status) {
        if (!status) return 'status-badge';
        const statusLower = status.toLowerCase();
        if (statusLower.includes('active') || statusLower.includes('progress') || statusLower.includes('in-progress')) {
            return 'status-badge active';
        } else if (statusLower.includes('complete') || statusLower.includes('done') || statusLower.includes('finished')) {
            return 'status-badge completed';
        } else if (statusLower.includes('pending') || statusLower.includes('planned') || statusLower.includes('to do')) {
            return 'status-badge pending';
        } else if (statusLower.includes('hold') || statusLower.includes('block')) {
            return 'status-badge on-hold';
        }
        return 'status-badge';
    }

    static showProjectStories(array) {
       array.forEach(story => {
           let title = story.title
           let status = story.status
           let description = story.description
           let acceptanceCriteria = story.acceptanceCriteria || 'Not specified'
           const statusClass = this.getStatusBadgeClass(status)
           const storyList = document.getElementById('stories')
           this.element = document.createElement("li")
           this.element.id = story.id
           this.element.innerHTML = `
               <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                   <div style="flex: 1; min-width: 200px;">
                       <strong style="font-size: 1.125rem; color: #2d3748; display: block; margin-bottom: 0.5rem;">
                           <i class="fas fa-book"></i> ${title}
                       </strong>
                       <span class="${statusClass}" style="display: inline-block; margin-bottom: 0.5rem;">${status || 'Not set'}</span>
                   </div>
                   <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                       <button type="button" class="btn btn-primary btn-sm" id="edit_story_${story.id}">
                           <i class="fas fa-edit"></i> Edit
                       </button>
                       <button type="button" class="btn btn-danger btn-sm" id="delete_story_${story.id}">
                           <i class="fas fa-trash"></i> Delete
                       </button>
                   </div>
               </div>
               <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #e2e8f0;">
                   <p style="margin: 0.5rem 0; color: #4a5568;">
                       <i class="fas fa-align-left"></i> <strong>Description:</strong> ${description || 'No description'}
                   </p>
                   <p style="margin: 0.5rem 0; color: #4a5568;">
                       <i class="fas fa-check-circle"></i> <strong>Acceptance Criteria:</strong> ${acceptanceCriteria}
                   </p>
               </div>`
           storyList.append(this.element)
       })
       
    }




    static newStoryMenu = (event) => {
        let modalBody = document.querySelector(".modal-body")
            //debugger
            this.title = modalBody.querySelector(".title").value
            this.status = modalBody.querySelector(".status").value
            this.projectId = parseInt(modalBody.querySelector("#project_id").value)
            this.acceptanceCriteria = modalBody.querySelector(".acceptance_criteria").value
            this.description = modalBody.querySelector(".description").value
            this.projectTitle = this.element.querySelector(".projectTitle").innerText

        if (event.target.innerText === "Cancel"){         
            (document.querySelector(`#projects`)).removeChild(document.querySelector(".modal"))
            this.viewStoriesModal(this.projectId, this.projectTitle)

        }else if (event.target.innerText === "Save New Story"){
            StoryApi.create(this)
            event.currentTarget.remove()
        
        } 
    }



    static savingEditStory = (event) => {
        const modalBody = document.querySelector("#edit-modal")
            //debugger
            this.id = modalBody.querySelector("#id").value
            this.title = modalBody.querySelector(".title").value
            this.status = modalBody.querySelector(".status").value
            this.projectId = parseInt(modalBody.querySelector("#project_id").value)
            this.projectTitle = modalBody.querySelector(".projectTitle").innerText
            this.acceptanceCriteria = modalBody.querySelector(".acceptance_criteria").value
            this.description = modalBody.querySelector(".description").value
            
            StoryApi.patch(this)
            
            modalBody.remove()
            //viewStoriesModal(this.projectId, this.projectTitle)
    }




    static storyListMenu = (event) => {
        const modal = document.getElementById("storyListModal")
        if (!modal) return;

        const target = event.target;
        const buttonText = target.innerText?.trim() || target.textContent?.trim() || '';
        const isCloseButton = target.closest('button[data-dismiss="modal"]') || 
                             buttonText === "Close" || 
                             (target.closest('button') && target.closest('button').textContent?.includes('Close'));

        if (isCloseButton){
            modal.remove()  
        }else if(buttonText === "Create New Story" || target.closest('#create_new_story')){
            const projectTitle = event.currentTarget.dataset.name
            const projectId = event.currentTarget.dataset.id
            this.newStoryModal(projectId, projectTitle)
            modal.remove()  
        }else if (buttonText === "Delete" || target.closest('[id^="delete_story_"]')){
            const storyId = target.closest('[id^="delete_story_"]')?.id.replace('delete_story_', '') || 
                          target.closest('li')?.id;
            if (storyId && confirm('Are you sure you want to delete this story?')) {
                StoryApi.deleteStory(storyId)
                modal.remove()
            }
        }else if (buttonText === "Edit" || target.closest('[id^="edit_story_"]')){
            const projectTitle = event.currentTarget.dataset.name
            const projectId = event.currentTarget.dataset.id
            const storyId = target.closest('[id^="edit_story_"]')?.id.replace('edit_story_', '') || 
                          target.closest('li')?.id;
            if (storyId) {
                // Store the story ID for the edit modal
                window.currentEditStoryId = storyId;
                this.editStoryModal(projectId, projectTitle)
                modal.remove()
            }
        }
    
    }




    static editStoryMenu = (event) => {
        const modal = document.getElementById('edit-modal')

        if (event.target.innerText === "Cancel"){
            this.viewStoriesModal(this.element.projectId, this.element.projectTitle)
            modal.remove()

        }else if (event.target.innerText === "Save"){
            this.savingEditStory()
            modal.remove()
        }    
    }





    static editStoryModal (projectId, projectTitle) {
        const container = document.getElementById('projects')
        const storyId = window.currentEditStoryId || (event && event.path && event.path[1] && event.path[1].id ? parseInt(event.path[1].id) : null);
        this.element = Story.all.find(story => story.id === parseInt(storyId)) 
        
        if (!this.element) {
            console.error('Story not found');
            return;
        }
        
        const div = document.createElement("div")
        div.className = "modal"
        div.id = "edit-modal"
        div.innerHTML = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"><i class="fas fa-edit"></i> Edit Story</h5>
                </div>
                <div class="modal-body">
                    <div class="projectTitle"><i class="fas fa-project-diagram"></i> ${projectTitle}</div>
                    <input type="hidden" name="project_id" id="project_id" class="hidden" value="${projectId}">
                    <input type="hidden" name="id" id="id" class="hidden" value="${this.element.id}">
                    
                    <label><i class="fas fa-heading"></i> Title</label>
                    <input type="text" name="title" class="title" value="${this.element.title || ''}">
                    
                    <label><i class="fas fa-info-circle"></i> Status</label>
                    <input type="text" name="status" class="status" value="${this.element.status || ''}" placeholder="e.g., To Do, In Progress, Done">
                    
                    <label><i class="fas fa-align-left"></i> Description</label>
                    <textarea name="description" class="description" rows="4">${this.element.description || ''}</textarea>
                    
                    <label><i class="fas fa-check-circle"></i> Acceptance Criteria</label>
                    <textarea name="acceptance_criteria" class="acceptance_criteria" rows="4">${this.element.acceptanceCriteria || ''}</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create_new_story">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
                </div>
            </div>
            </div>`
            div.addEventListener('click', this.editStoryMenu)
        container.append(div)
    }

}