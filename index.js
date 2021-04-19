const baseURL = 'http://localhost:3000'
const projectsURL = baseURL + '/projects'
const projectTypesURL = baseURL + '/project_types'
const projects = document.getElementById("projects")

ItemApi.getProjects()