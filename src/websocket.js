class WebSocketClient {
    static connection = null;
    static subscriptions = {};
    
    static connect() {
        if (!Auth.token) return;
        
        // Action Cable uses a specific protocol
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = window.API_BASE_URL.replace(/^https?:/, '').replace(/\/$/, '');
        const wsUrl = `${wsProtocol}//${wsHost}/cable`;
        
        // Use ActionCable JS library if available, otherwise fallback to native WebSocket
        if (typeof ActionCable !== 'undefined') {
            this.consumer = ActionCable.createConsumer(`${wsUrl}?token=${Auth.token}`);
            this.subscribe('projects');
            return;
        }
        
        // Fallback to native WebSocket (simplified Action Cable protocol)
        this.connection = new WebSocket(`${wsUrl}?token=${Auth.token}`);
        
        this.connection.onopen = () => {
            console.log('WebSocket connected');
            this.subscribe('projects');
        };
        
        this.connection.onmessage = (event) => {
            const data = JSON.parse(event.data);
            
            if (data.type === 'ping') {
                return;
            }
            
            if (data.message) {
                this.handleMessage(data.message);
            }
        };
        
        this.connection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        this.connection.onclose = () => {
            console.log('WebSocket disconnected');
            // Reconnect after 3 seconds
            setTimeout(() => this.connect(), 3000);
        };
    }
    
    static subscribe(channel, params = {}) {
        if (!this.connection || this.connection.readyState !== WebSocket.OPEN) {
            setTimeout(() => this.subscribe(channel, params), 1000);
            return;
        }
        
        const identifier = {
            channel: `${channel}Channel`,
            ...params
        };
        
        this.connection.send(JSON.stringify({
            command: 'subscribe',
            identifier: JSON.stringify(identifier)
        }));
        
        this.subscriptions[channel] = identifier;
    }
    
    static handleMessage(message) {
        switch (message.type) {
            case 'project_created':
            case 'project_updated':
                if (typeof ProjectApi !== 'undefined') {
                    ProjectApi.getProjects();
                }
                break;
            case 'project_deleted':
                const projectElement = document.getElementById(`project-${message.project_id}`);
                if (projectElement) {
                    projectElement.remove();
                }
                break;
            case 'new_comment':
                // Refresh comments if modal is open
                const commentsModal = document.getElementById('comments-modal');
                if (commentsModal) {
                    // Trigger comment reload
                    const event = new CustomEvent('commentAdded');
                    document.dispatchEvent(event);
                }
                break;
        }
    }
    
    static disconnect() {
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
    }
}

