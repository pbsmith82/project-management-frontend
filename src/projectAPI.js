class ProjectApi {
    static get baseURL() {
        const base = window.API_BASE_URL;
        return base ? `${base}/projects` : '/projects';
    }

    static getProjects(){
        if (!Auth.isAuthenticated()) {
            console.warn('User not authenticated, cannot fetch projects');
            return Promise.reject(new Error('Authentication required'));
        }
        console.log('Fetching projects from:', this.baseURL);
        return fetch(this.baseURL, {
            headers: Auth.getAuthHeaders()
        })
        .then(resp => {
            if (resp.status === 401) {
                // Unauthorized - redirect to landing page
                Auth.logout();
                throw new Error('Authentication required');
            }
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
            // Update Kanban after projects are loaded
            if (typeof Kanban !== 'undefined' && Kanban.updateKanban) {
                setTimeout(() => {
                    Kanban.updateKanban()
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
            project: {
                title,
                status,
                target_date,
                start_date,
                project_type_id,
                project_manager,
                description
            }
        }
        const configObj = {
            method: 'POST',
            headers: {
                ...Auth.getAuthHeaders(),
                'Content-Type': 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify(projectInfo)
        }
  
        return fetch(`${this.baseURL}`, configObj)
        .then(r => {
            if (!r.ok) {
                return r.json().then(errorData => {
                    console.error('API Error:', errorData);
                    throw new Error(errorData.error || `HTTP error! status: ${r.status}`);
                }).catch(() => {
                    throw new Error(`HTTP error! status: ${r.status}`);
                });
            }
            return r.json();
        })
        .then(async json => {
            if(json.data){
                const project = new Project({id: json.data.id, ...json.data.attributes} )
                project.displayProjects()
                
                // Check for duplicates after creation
                try {
                    const duplicateResponse = await AIService.detectDuplicates(json.data.id)
                    const duplicates = duplicateResponse.data || []
                    if (duplicates && duplicates.length > 0) {
                        const duplicateTitles = duplicates.map(d => d.attributes.title).join(', ')
                        if (confirm(`Warning: Similar projects found: ${duplicateTitles}\n\nDo you want to view them?`)) {
                            // Show similar projects modal
                            setTimeout(() => project.showSimilarProjects(), 500)
                        }
                    }
                } catch (e) {
                    console.error('Error checking duplicates:', e)
                }
                
                // Update calendar
                if (typeof updateCalendar === 'function') {
                    updateCalendar()
                }
                // Update Kanban
                if (typeof Kanban !== 'undefined' && Kanban.updateKanban) {
                    Kanban.updateKanban()
                }
                // Update hero stats
                if (typeof updateHeroStats === 'function') {
                    updateHeroStats()
                }
                return json;
            }else{
                const errorMsg = json.error || 'Failed to create project';
                alert(errorMsg);
                throw new Error(errorMsg);
            }

        })
        .catch(error => {
            console.error('Error creating project:', error);
            throw error;
        });
    }



    static patch(project) {
        // Extract all project properties, handling both camelCase and snake_case
        const title = project.title
        const status = project.status
        const target_date = project.targetDate || project.target_date
        const start_date = project.startDate || project.start_date
        const project_type_id = project.projectTypeId || project.project_type_id
        const project_manager = project.projectManager || project.project_manager
        const description = project.description
        
        const projectInfo = {
            project: {
                title,
                status,
                target_date,
                start_date,
                project_type_id,
                project_manager,
                description
            }
        }
        const configObj = {
            method: 'PATCH',
            headers: {
                ...Auth.getAuthHeaders(),
                'Content-Type': 'application/json',
                Accept: "application/json"
            },
            body: JSON.stringify(projectInfo)
        }
  
        return fetch(`${this.baseURL}/${project.id}`, configObj)
        .then(r => {
            if (!r.ok) {
                return r.json().then(errorData => {
                    console.error('API Error:', errorData);
                    throw new Error(errorData.error || `HTTP error! status: ${r.status}`);
                }).catch(() => {
                    throw new Error(`HTTP error! status: ${r.status}`);
                });
            }
            const contentType = r.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return r.text().then(text => {
                    console.error('Expected JSON but got:', text.substring(0, 200));
                    throw new Error('Server returned non-JSON response.');
                });
            }
            return r.json();
        })
        .then(json => {
            project.title = json.data.attributes.title
            project.status = json.data.attributes.status
            project.projectManager = json.data.attributes.project_manager
            project.projectTypeId = json.data.attributes.project_type_id
            project.projectTypeName = json.data.attributes.project_type_name
            project.targetDate = json.data.attributes.target_date
            project.startDate = json.data.attributes.start_date
            project.description = json.data.attributes.description
            // Remove old element and re-render with updated data
            const oldElement = project.element
            const parent = oldElement.parentNode
            if (parent) {
                oldElement.remove()
                project.supplyProjects()
                parent.appendChild(project.element)
            }
            // Update calendar
            if (typeof updateCalendar === 'function') {
                updateCalendar()
            }
            // Don't update Kanban here - let the drag handler manage it
            // This prevents cards from jumping around after drag and drop
            return json;
        })
        .catch(error => {
            console.error('Error updating project:', error);
            throw error;
        })
    }


    static deleteProject(id){
        const configObj = {
            method: 'DELETE',
            headers: Auth.getAuthHeaders()
        }
        
        fetch(`${this.baseURL}/${id}`, configObj)
            .then(r => r.json())
            .then(json =>  { 
                alert(json.message)
                // Update calendar after deletion
                if (typeof updateCalendar === 'function') {
                    updateCalendar()
                }
                // Update Kanban after deletion
                if (typeof Kanban !== 'undefined' && Kanban.updateKanban) {
                    Kanban.updateKanban()
                }
                // Update hero stats
                if (typeof updateHeroStats === 'function') {
                    updateHeroStats()
                }
            })
    }
}
