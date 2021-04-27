class StoryApi {
    static baseURL = 'http://localhost:3000/stories'

    static getStories(){
        fetch(this.baseURL)
        .then(resp => resp.json())
        .then(data => {

            data["data"].forEach(story => {
                const s = new Story({id: story.id, ...story.attributes} )
                
            })
        })
    }

    static patch(story) {
        let {title, status, acceptanceCriteria, projectId, description} = story
        let acceptance_criteria = acceptanceCriteria
        let project_id = projectId
        const storyDetails = {
            title,
            status,
            acceptance_criteria,
            project_id,
            description
        }
        //debugger
        const configObj = {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(storyDetails)
        }
        fetch(`${this.baseURL}/${story.id}`, configObj)
        .then(r => r.json())
        .then(json => {

            const story = Story.all.find(story => story.id === parseInt(json.data.id))
            
            story.description = json.data.attributes.description
            story.status = json.data.attributes.status
            story.title = json.data.attributes.title
            story.acceptanceCriteria = json.data.attributes.acceptance_criteria
            story.projectId = json.data.attributes.project_id
            story.projectTitle = json.data.attributes.project_title
            
            Story.viewStoriesModal(story.projectId, story.projectTitle)
        })
    }

    static create(story){
        let {title, status, acceptanceCriteria, projectId, description} = story
        let acceptance_criteria = acceptanceCriteria
        let project_id = projectId
        
        const storyDetails = {
            title,
            status,
            acceptance_criteria,
            project_id,
            description
        }
        const configObj = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(storyDetails)
        }
        
        fetch(`${this.baseURL}`, configObj)
        .then(r => r.json())
        .then(json => {
            if(json.data){
                
                const s = new Story({id: json.data.id, ...json.data.attributes} )
                Story.viewStoriesModal(s.projectId, s.projectTitle)
            }else{
                const p = Project.all.find(project => parseInt(project.id) === projectId)
                Story.viewStoriesModal(p.id, p.title)
                alert(json.error)
            }
                
        })
        
        
    }

    static deleteStory(id){
        const configObj = {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            }
        }
        
        fetch(`${this.baseURL}/${id}`, configObj)
            .then(r => r.json())
            .then(json =>  { 

                if(json.message){
                    const story = Story.all.find(story => story.id === parseInt(id))
                    const projectId = story.projectId
                    const projectTitle = story.projectTitle
                    const index = Story.all.indexOf(story)
                    if (index > -1) { Story.all.splice(index, 1) }
                    Story.viewStoriesModal(projectId, projectTitle)
                    alert(json.message)
                } else {
                    alert(json.error)
                }
            })
    }
}