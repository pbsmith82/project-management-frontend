const baseURL = 'http://localhost:3000'
const projectsURL = baseURL + '/projects'
const projectTypesURL = baseURL + '/project_types'
const projects = document.getElementById("projects")
const dropdown = document.getElementById('cat-dropdown')
const typeNameInput = document.getElementById("project_type")
const newProjectBttn = document.querySelector("#new_project")
newProjectBttn.addEventListener('click', newProject)


ProjectApi.getProjects()

TypeApi.getTypes()

function newProject(event) {
    Project.newProjectModal(event)

}

dropdown.addEventListener('change', Project.typeOrder)