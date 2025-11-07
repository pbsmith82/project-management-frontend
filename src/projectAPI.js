class ProjectApi {
    static get baseURL() {
        const base = window.API_BASE_URL;
        return base ? `${base}/projects` : '/projects';
    }

    static getProjects(){
        console.log('Fetching projects from:', this.baseURL);
        return fetch(this.baseURL)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(`HTTP error! status: ${resp.status}`);
            }
            const contentType = resp.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return resp.text().then(text => {
                    console.error('Expected JSON but got:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response. Check API URL.');
                });
            }
            return resp.json();
        })
        .then(data => {
            // Clear existing projects first
            Project.all = []
            
            data["data"].forEach(project => {
                const p = new Project({id: project.id, ...project.attributes} )
                p.displayProjects()
            })
            
            // Update calendar after projects are loaded
            if (typeof updateCalendar === 'function') {
                setTimeout(() => {
                    updateCalendar()
                }, 200)
            }
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            console.error('Attempted URL:', this.baseURL);
            alert(`Failed to load projects. Please check that the backend API is running.\n\nError: ${error.message}\n\nURL: ${this.baseURL}`);
        })
    }




    static createProject(project){
        let {title, status, target_date, start_date, project_type_id, project_manager, description} = project
        const projectInfo = {
            title,
            status,
            target_date,
            start_date,
            project_type_id,
            project_manager,
            description
        }
        const configObj = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(projectInfo)
        }
  
        fetch(`${this.baseURL}`, configObj)
        .then(r => r.json())
        .then(json => {
            if(json.data){
                const project = new Project({id: json.data.id, ...json.data.attributes} )
                project.displayProjects()
                // Update calendar
                if (typeof updateCalendar === 'function') {
                    updateCalendar()
                }
                // Update hero stats
                if (typeof updateHeroStats === 'function') {
                    updateHeroStats()
                }
            }else{
                alert(json.error)
            }

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
            project.title = json.data.attributes.title
            project.status = json.data.attributes.status
            project.projectManager = json.data.attributes.project_manager
            project.projectTypeId = json.data.attributes.project_type_id
            project.projectTypeName = json.data.attributes.project_type_name
            project.targetDate = json.data.attributes.target_date
            project.description = json.data.attributes.description
            // Remove old element and re-render with updated data
            const oldElement = project.element
            const parent = oldElement.parentNode
            oldElement.remove()
            project.supplyProjects()
            parent.appendChild(project.element)
            // Update calendar
            if (typeof updateCalendar === 'function') {
                updateCalendar()
            }
        })
    }


    static deleteProject(id){
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
                alert(json.message)
                // Update calendar after deletion
                if (typeof updateCalendar === 'function') {
                    updateCalendar()
                }
                // Update hero stats
                if (typeof updateHeroStats === 'function') {
                    updateHeroStats()
                }
            })
    }
}
