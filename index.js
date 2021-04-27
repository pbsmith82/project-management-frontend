const dropdown = document.getElementById('type_filter')
const newProjectBttn = document.querySelector("#new_project")
newProjectBttn.addEventListener('click', newProject)


ProjectApi.getProjects()
TypeApi.getTypes()
StoryApi.getStories()

function newProject(event) {
    Project.newProjectModal(event)

}

dropdown.addEventListener('change', Project.typeOrder)