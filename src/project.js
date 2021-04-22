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

        this.element.addEventListener('click', this.modifyProject)

        Project.all.push(this)
    }

    renderProjects(){ 
        this.element.innerHTML = `
        <div id="${this.id}">
            <div id="title-${this.id}" class="card-header">${this.title}</div>
            <div class="card-body"> 
                <h4>Status:</h4><div id="status-${this.id}">${this.status}</div><br>
                <h4>Project Type ID:</h4><div id="project_type-${this.id}">${this.projectTypeId}</div> <br>
                <h4>Target Date:</h4><div id="target_date-${this.id}">${this.targetDate}</div><br>
                <h4>Start Date:</h4><div id="start_date-${this.id}">${this.startDate}</div><br>
                <h4>Project Manger:</h4><div id="project_manager-${this.id}">${this.projectManager}</div><br>
                <h4>Description:</h4><div id="description-${this.id}">${this.description}</div><br>
            </div>
        </div>
        <div class="card-footer">
        <button class="btn btn-primary btn-sm" id="edit-${this.id}" >Edit</button>
        <button class="btn btn-primary btn-sm" id="delete-${this.id}">Delete</button>
        </div>
        </div>

    `

        return this.element
    }

    modifyProject = (event) => {
        if (event.target.innerText === "Edit"){
            this.openEditModal(event.target)

            
        }else if(event.target.innerText === "Delete"){
            this.deleteItem(event)
        }
    }



    attachToDom(){
        
        projects.appendChild(this.renderProjects())
    }

    openEditModal = (e) =>{        
        const elm = this.element
        const div = this.element.querySelector('div')
        const title = elm.querySelector(`#title-${div.id}`).innerText
        const description = elm.querySelector(`#description-${div.id}`).innerText
        const status = elm.querySelector(`#status-${div.id}`).innerText
        const projectType = elm.querySelector(`#project_type-${div.id}`).innerText
        const targetDate = elm.querySelector(`#target_date-${div.id}`).innerText
        const projectManager = elm.querySelector(`#project_manager-${div.id}`).innerText


        let div2 = document.createElement("div")
        div2.className = "modal"
        div2.innerHTML = `
        <div class="modal" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit ${title}</h5>
                </div>
                <div class="modal-body">
                Project Title: <input type="text" name="name" class="title" value="${title}"><br><br>
                Project Status: <input type="text" name="name" class="status" value="${status}"><br><br>
                Project Type: <input type="text" name="name" class="project_type" value="${projectType}"><br><br>
                Target Date: <input type="date" name="name" class="target_date" value="${targetDate}"><br><br>
                Project Manager: <input type="text" name="name" class="project_manager" value="${projectManager}"><br><br>
                Description: <textarea name="name" class="description"rows="4" cols="55"> ${description} </textarea>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary">Save changes</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
            </div>`

            this.element.addEventListener('click', this.updateProject)
        this.element.append(div2)
        
    }

    updateProject = (event) => {
        if (event.target.innerText === "Close"){
            const modalParent = document.querySelector(`#project-${this.id}`)
            modalParent.removeChild(document.querySelector(".modal"))
            
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

}