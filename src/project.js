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

    renderProjects(){ 
        
        this.element.innerHTML = 
        `<div id="${this.id}">
            <div id="title-${this.id}" class="card-header">
                <div class="row row-cols-2">
                   <div> <h3> ${this.title} </h3> </div>
                   <div align="right"> 
                    <button class="btn btn-primary btn-sm" id="edit-${this.id}" >Edit</button>
                    <button class="btn btn-danger btn-sm" id="delete-${this.id}">Delete</button>
                    </div>
                </div>
            </div>
            <div class="card-body"> 
                <h4>Status:</h4><div id="status-${this.id}">${this.status}</div><br>
                <h4>Project Type:</h4><div id="project_type-${this.id}">${this.projectTypeName}</div> <br>
                <h4>Target Date:</h4><div id="target_date-${this.id}">${this.targetDate}</div><br>
                <h4>Start Date:</h4><div id="start_date-${this.id}">${this.startDate}</div><br>
                <h4>Project Manger:</h4><div id="project_manager-${this.id}">${this.projectManager}</div><br>
                <h4>Description:</h4><div id="description-${this.id}">${this.description}</div><br>
            </div>
        </div>
        <div class="card-footer">
            <div class="row row-cols-2">
                    <button class="btn btn-secondary btn-sm" id="delete-${this.id}">View Stories</button>
                    <button class="btn btn-success btn-sm" id="delete-${this.id}">Add Story</button>   
            </div>
        </div>`

        return this.element
    }

    menuProject = (event) => {
        
        if (event.target.innerText === "Edit"){
            this.openEditModal(event.target)

            
        }else if(event.target.innerText === "Delete"){
            this.element.remove() 
            ProjectApi.deleteProject(this.id)

        }else if(event.target.innerText === "Add Story"){
    
            Story.newStoryModal(this.id, this.title) 

        }else if(event.target.innerText === "View Stories"){
    
            Story.viewStoriesModal(this.id, this.title) 
        }
    }



    displayProjects(){
        
        projects.appendChild(this.renderProjects())
    }

    openEditModal = () =>{        
        let div = document.createElement("div")
        div.className = "modal"
        div.innerHTML = `
            <div class="modal" tabindex="-1" role="dialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit ${this.title}</h5>
                        </div>
                        <div class="modal-body">
                            Project Title: <input type="text" name="name" class="title" value="${this.title}"><br><br>
                            Project Status: <input type="text" name="name" class="status" value="${this.status}"><br><br>
                            Project Type: <select name="name" class="project_type" id="types-selector" value="${this.projectTypeId}"></select><br><br>
                            Target Date: <input type="date" name="name" class="target_date" value="${this.targetDate}"><br><br>
                            Project Manager: <input type="text" name="name" class="project_manager" value="${this.projectManager}"><br><br>
                            Description: <textarea name="name" class="description"rows="4" cols="55">${this.description}</textarea>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary">Save changes</button>
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>`
        this.element.addEventListener('click', this.updateProject)
        this.element.append(div)
        TypeApi.getTypes(div.className)
    }

    updateProject = (event) => {
        if (event.target.innerText === "Close"){
         (document.querySelector(`#project-${this.id}`)).removeChild(document.querySelector(".modal"))
            
        }
        else if(event.target.innerText === "Save changes"){
            this.title = this.element.querySelector(".title").value
            this.status = this.element.querySelector(".status").value
            this.target_date = this.element.querySelector(".target_date").value
            this.project_type_id = parseInt(this.element.querySelector(".project_type").value)
            this.project_manager = this.element.querySelector(".project_manager").value
            this.description = this.element.querySelector(".description").value
            
        ProjectApi.patch(this)
        }
    }
    
    static newProjectModal(event) {

        const container = document.getElementById('projects')
        
        
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
                Project Title: <input type="text" name="title" class="title" ><br><br>
                Project Status: <input type="text" name="status" class="status"><br><br>
                Project Type: <select name="project_type" class="project_type" id="types-selector"></select><br><br>
                Target Date: <input type="date" name="target_date" class="target_date"><br><br>
                Start Date: <input type="date" name="start_date" class="start_date"><br><br>
                Project Manager: <input type="text" name="project_manager" class="project_manager"><br><br>
                Description: <textarea name="description" class="description"rows="4" cols="55">  </textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="create_new_record">Create New Record</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>`
            this.element.addEventListener('click', this.recordNewProject)
        container.append(this.element)
        TypeApi.getTypes(this.element.className)
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
            ProjectApi.create(this)
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