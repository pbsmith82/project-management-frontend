class Project {

    static all = []

    static container = document.getElementById('projects')

    constructor({id, title, status, target_date, start_date, description, project_manager, project_type_id}){
        this.id = id
        this.title = title 
        this.status = status
        this.targetDate = target_date
        this.startDate = start_date
        this.description = description
        this.projectManager = project_manager  
        this.projectTypeId = project_type_id

        this.element = document.createElement('div')
        this.element.id = `project-${id}`
        this.element.className = "card"
        this.element.dataset.id = id 

        this.element.addEventListener('click', this.handleItemClick)

        Project.all.push(this)
    }

    renderProjects(){ 
        this.element.innerHTML = `
        <div data-id="${this.id}">
            <div id="title-${this.id}" class="card-header">${this.title}</div>
            <div id="status-${this.id}" class="card-body">Status: ${this.status}
            <div id="target_date-${this.id}">Project Type ID: ${this.projectTypeId}</div>
            <div id="target_date-${this.id}">Target Date: ${this.targetDate}</div>
            <div id="start_date-${this.id}">Start Date: ${this.startDate}</div>
            <div id="project_manager-${this.id}">Project Manger: ${this.projectManager}</div>
            <div id="description-${this.id}">Description: ${this.description}
            </div>
            </div> 
        </div>
        <div class="card-footer">
        <button class="btn btn-primary btn-sm" data-id="${this.id}">Edit</button>
        <button class="btn btn-primary btn-sm" data-id="${this.id}">Delete</button>
        </div>
        </div>

    `

        return this.element
    }



    attachToDom(){
        
        projects.appendChild(this.renderProjects())
    }



}