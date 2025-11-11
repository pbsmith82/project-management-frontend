class AIService {
    static async generateDescription(title, projectType, projectManager) {
        const response = await fetch(`${window.API_BASE_URL}/ai/generate_description`, {
            method: 'POST',
            headers: {
                ...Auth.getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                project_type: projectType,
                project_manager: projectManager
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const error = await response.json();
            return { error: error.error || 'Failed to generate description' };
        }
    }
    
    static async generateAcceptanceCriteria(title, description) {
        const response = await fetch(`${window.API_BASE_URL}/ai/generate_acceptance_criteria`, {
            method: 'POST',
            headers: {
                ...Auth.getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const error = await response.json();
            return { error: error.error || 'Failed to generate acceptance criteria' };
        }
    }
    
    static async suggestTags(content) {
        const response = await fetch(`${window.API_BASE_URL}/ai/suggest_tags`, {
            method: 'POST',
            headers: {
                ...Auth.getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content: content })
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.tags || [];
        }
        return [];
    }
    
    static async calculateRisk(projectId) {
        const response = await fetch(`${window.API_BASE_URL}/ai/calculate_risk/${projectId}`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (response.ok) {
            return await response.json();
        }
        return null;
    }
    
    static async semanticSearch(query, limit = 10) {
        const response = await fetch(`${window.API_BASE_URL}/ai/semantic_search?q=${encodeURIComponent(query)}&limit=${limit}`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        }
        return [];
    }
    
    static async findSimilar(projectId) {
        const response = await fetch(`${window.API_BASE_URL}/ai/find_similar/${projectId}`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return { data: [] };
    }
    
    static async detectDuplicates(projectId) {
        const response = await fetch(`${window.API_BASE_URL}/ai/detect_duplicates/${projectId}`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return { data: [] };
    }
}

