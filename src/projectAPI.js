class ItemApi {
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
}
