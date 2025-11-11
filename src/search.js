class Search {
    static results = { projects: [], stories: [] };
    
    static async performSearch(query, filters = {}) {
        const params = new URLSearchParams({ q: query, ...filters });
        const response = await fetch(`${window.API_BASE_URL}/search?${params}`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            this.results = data;
            return data;
        }
        return null;
    }
    
    static showSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'search-modal';
        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 800px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-search"></i> Advanced Search</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>Search Query</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" class="form-control" id="search-query" placeholder="Search projects and stories..." style="flex: 1;">
                                <button type="button" class="btn btn-sm" id="ai-semantic-search" title="AI Semantic Search" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); border: none; color: white; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
                                    <i class="fas fa-brain" style="color: white;"></i> AI Search
                                </button>
                            </div>
                            <small class="text-muted"><i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;"></i> Use AI Search for semantic understanding of your query</small>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Status</label>
                                    <select class="form-control" id="search-status">
                                        <option value="">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Tags (comma-separated)</label>
                                    <input type="text" class="form-control" id="search-tags" placeholder="tag1, tag2">
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>Start Date</label>
                                    <input type="date" class="form-control" id="search-start-date">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="form-group">
                                    <label>End Date</label>
                                    <input type="date" class="form-control" id="search-end-date">
                                </div>
                            </div>
                        </div>
                        <button class="btn btn-primary" id="perform-search-btn">
                            <i class="fas fa-search"></i> Search
                        </button>
                        <div id="search-results" style="margin-top: 20px;"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('perform-search-btn').addEventListener('click', async () => {
            const query = document.getElementById('search-query').value;
            const filters = {
                status: document.getElementById('search-status').value,
                tags: document.getElementById('search-tags').value,
                start_date: document.getElementById('search-start-date').value,
                end_date: document.getElementById('search-end-date').value
            };
            
            const results = await this.performSearch(query, filters);
            this.displayResults(results);
        });
        
        // AI Semantic Search
        document.getElementById('ai-semantic-search').addEventListener('click', async () => {
            const query = document.getElementById('search-query').value;
            if (!query.trim()) {
                alert('Please enter a search query');
                return;
            }
            
            const btn = document.getElementById('ai-semantic-search');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="color: white;"></i> Searching...';
            
            const results = await AIService.semanticSearch(query, 10);
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-brain" style="color: white;"></i> AI Search';
            
            if (results.length > 0) {
                this.displayAIResults(results, query);
            } else {
                document.getElementById('search-results').innerHTML = '<div class="alert alert-info">No results found with AI search</div>';
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    static displayResults(results) {
        const container = document.getElementById('search-results');
        if (!results) {
            container.innerHTML = '<div class="alert alert-danger">Search failed</div>';
            return;
        }
        
        let html = '<h5>Search Results</h5>';
        
        if (results.projects && results.projects.data && results.projects.data.length > 0) {
            html += '<h6>Projects</h6><ul>';
            results.projects.data.forEach(project => {
                html += `<li><a href="#" onclick="Project.all.find(p => p.id == ${project.id})?.element.scrollIntoView(); return false;">${project.attributes.title}</a></li>`;
            });
            html += '</ul>';
        }
        
        if (results.stories && results.stories.data && results.stories.data.length > 0) {
            html += '<h6>Stories</h6><ul>';
            results.stories.data.forEach(story => {
                html += `<li>${story.attributes.title}</li>`;
            });
            html += '</ul>';
        }
        
        if ((!results.projects || !results.projects.data || results.projects.data.length === 0) &&
            (!results.stories || !results.stories.data || results.stories.data.length === 0)) {
            html += '<div class="alert alert-info">No results found</div>';
        }
        
        container.innerHTML = html;
    }
    
    static displayAIResults(results, query) {
        const container = document.getElementById('search-results');
        let html = `
            <h5><i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: 0.5rem;"></i> AI Semantic Search Results for "${query}"</h5>
            <p style="color: #718096; font-size: 0.9rem; margin-bottom: 1rem;">Found ${results.length} semantically similar projects</p>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
        `;
        
        results.forEach(project => {
            html += `
                <div class="ai-search-result" style="padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s;" 
                     onmouseover="this.style.borderColor='#667eea'; this.style.boxShadow='0 2px 8px rgba(102,126,234,0.2)'"
                     onmouseout="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none'"
                     onclick="Project.all.find(p => p.id == ${project.id})?.element.scrollIntoView({behavior: 'smooth'}); document.getElementById('search-modal').querySelector('.close').click();">
                    <h6 style="margin: 0 0 0.5rem 0; color: #1a202c; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: 0.25rem;"></i>
                        <i class="fas fa-project-diagram" style="color: #667eea;"></i>
                        ${project.attributes.title}
                    </h6>
                    <p style="margin: 0; color: #718096; font-size: 0.9rem;">
                        ${project.attributes.description ? project.attributes.description.substring(0, 150) + '...' : 'No description'}
                    </p>
                    ${project.attributes.status ? `
                        <span class="status-badge" style="margin-top: 0.5rem; display: inline-block;">${project.attributes.status}</span>
                    ` : ''}
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }
}

