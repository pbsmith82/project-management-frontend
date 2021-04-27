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
                    <h5 class="modal-title">New Story</h5>
                </div>
                <div class="modal-body">
                <div class="projectTitle"> ${projectTitle} </div><br><br>
                <input type="hidden" name="project_id" id="project_id" class="hidden" value="${projectId}">
                Title: <input type="text" name="title" class="title" ><br><br>
                Status: <input type="text" name="status" class="status"><br><br>
                Description: <textarea name="description" class="description"rows="4" cols="55">  </textarea>
                AC: <textarea name="acceptance_criteria" class="acceptance_criteria"rows="4" cols="55">  </textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create_new_story">Save New Story</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
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
                        <h5 class="modal-title">${projectTitle} Stories</h5>
                    </div>
                    <div class="modal-body">
                    <ul id="stories">
                    </ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-success" id="create_new_story">Create New Story</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`

        this.element.addEventListener('click', this.storyListMenu)
        container.append(this.element)
        this.showProjectStories(storyAll)
    }
   



    static showProjectStories(array) {
       array.forEach(story => {
           let title = story.title
           //debugger
           let status = story.status
           let description = story.description
           const storyList = document.getElementById('stories')
           this.element = document.createElement("li")
           this.element.id = story.id
           this.element.innerHTML = `${title} : ${status} <br> Description: ${description}<br> 
           <button type="button" class="btn btn-primary btn-sm" id="edit_story">Edit Story</button>
           <button type="button" class="btn btn-danger btn-sm" id="delete_story">Delete Story</button> <br><br>`
           storyList.append(this.element)
       })
       
    }




    static newStoryMenu = (event) => {
        this.projectTitle = this.element.querySelector(".projectTitle").innerText
        this.projectId = this.element.querySelector("#project_id").value

        if (event.target.innerText === "Cancel"){         
            (document.querySelector(`#projects`)).removeChild(document.querySelector(".modal"))
            this.viewStoriesModal(this.projectId, this.projectTitle)

        }else if (event.target.innerText === "Save New Story"){
            this.savingNewStory(event)
        
        } 
    }

    
    
    
    static savingNewStory = (event) => {
        let modalBody = document.querySelector(".modal-body")
            //debugger
            this.title = modalBody.querySelector(".title").value
            this.status = modalBody.querySelector(".status").value
            this.projectId = parseInt(modalBody.querySelector("#project_id").value)
            this.acceptanceCriteria = modalBody.querySelector(".acceptance_criteria").value
            this.description = modalBody.querySelector(".description").value
            StoryApi.create(this)
            event.currentTarget.remove()
            
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

        if (event.target.innerText === "Close"){
            modal.remove()  
        }else if(event.target.innerText === "Create New Story"){
            //debugger
            const projectTitle = event.currentTarget.dataset.name
            const projectId = event.currentTarget.dataset.id
            this.newStoryModal(projectId, projectTitle)
            modal.remove()  
        }else if (event.target.innerText === "Delete Story"){
            StoryApi.deleteStory(event.target.parentElement.id)
            modal.remove()
        }else if (event.target.innerText === "Edit Story"){
            const projectTitle = event.currentTarget.dataset.name
            const projectId = event.currentTarget.dataset.id
            this.editStoryModal(projectId, projectTitle)
            modal.remove()
            
            //this.element.remove()
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





    static editStoryModal(projectId, projectTitle) {
        const container = document.getElementById('projects')
        this.element =  Story.all.find(story => story.id === parseInt(event.path[1].id)) 
        const div = document.createElement("div")
        div.className = "modal"
        div.id = "edit-modal"
        //debugger
        div.innerHTML = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Story</h5>
                </div>
                <div class="modal-body">
                <div class="projectTitle"> ${projectTitle} </div><br><br>
                <input type="hidden" name="project_id" id="project_id" class="hidden" value="${projectId}">
                <input type="hidden" name="id" id="id" class="hidden" value="${this.element.id}">
                Title: <input type="text" name="title" class="title" value="${this.element.title} " ><br><br>
                Status: <input type="text" name="status" class="status" value="${this.element.status}"><br><br>
                Description: <textarea name="description" class="description"rows="4" cols="55">${this.element.description}</textarea>
                AC: <textarea name="acceptance_criteria" class="acceptance_criteria"rows="4" cols="55">${this.element.acceptanceCriteria}</textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create_new_story">Save</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                </div>
                </div>
            </div>
            </div>`
            div.addEventListener('click', this.editStoryMenu)
        container.append(div)
    }

}