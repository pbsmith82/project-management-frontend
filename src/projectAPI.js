class ProjectApi {
    static baseURL = 'http://localhost:3000/projects'

    static getProjects(){
        fetch(this.baseURL)
        .then(resp => resp.json())
        .then(data => {

            data["data"].forEach(project => {
                const i = new Project({id: project.id, ...project.attributes} )
                i.attachToDom()
            })
        })
    }

    static patch(project) {
        let {title, status, target_date, project_type_id, project_manager, description} = project
        const projectInfo = {
            title,
            status,
            target_date,
            project_type_id,
            project_manager,
            description
        }
        const configObj = {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(projectInfo)
        }
  
        fetch(`${this.baseURL}/${project.id}`, configObj)
        .then(r => r.json())
        .then(json => {
            project.projectManager = json.data.attributes.project_manager
            project.projectTypeId = json.data.attributes.project_type_id
            project.targetDate = json.data.attributes.target_date 
           project.renderProjects()
        })
    }
}
