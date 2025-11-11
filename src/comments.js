class Comments {
    static async loadComments(resourceType, resourceId) {
        const response = await fetch(
            `${window.API_BASE_URL}/comments/${resourceType}/${resourceId}`,
            { headers: Auth.getAuthHeaders() }
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.data || [];
        }
        return [];
    }
    
    static async createComment(resourceType, resourceId, content) {
        const response = await fetch(
            `${window.API_BASE_URL}/comments/${resourceType}/${resourceId}`,
            {
                method: 'POST',
                headers: Auth.getAuthHeaders(),
                body: JSON.stringify({ comment: { content } })
            }
        );
        
        if (response.ok) {
            const data = await response.json();
            return data.data;
        }
        return null;
    }
    
    static async deleteComment(commentId, resourceType, resourceId) {
        const response = await fetch(
            `${window.API_BASE_URL}/comments/${commentId}`,
            {
                method: 'DELETE',
                headers: Auth.getAuthHeaders()
            }
        );
        
        return response.ok;
    }
    
    static showCommentsModal(resourceType, resourceId, resourceTitle) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'comments-modal';
        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 600px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Comments - ${resourceTitle}</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="comments-list" style="max-height: 400px; overflow-y: auto; margin-bottom: 20px;"></div>
                        <div class="form-group">
                            <textarea class="form-control" id="new-comment" rows="3" placeholder="Add a comment..."></textarea>
                        </div>
                        <button class="btn btn-primary" id="add-comment-btn">
                            <i class="fas fa-comment"></i> Add Comment
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const loadComments = async () => {
            const comments = await this.loadComments(resourceType, resourceId);
            const container = document.getElementById('comments-list');
            
            if (comments.length === 0) {
                container.innerHTML = '<p class="text-muted">No comments yet. Be the first to comment!</p>';
            } else {
                container.innerHTML = comments.map(comment => `
                    <div class="comment-item" style="border-bottom: 1px solid #eee; padding: 10px 0;">
                        <div style="font-weight: bold;">${comment.attributes.user?.data?.attributes?.name || 'Unknown'}</div>
                        <div style="color: #666; font-size: 0.9em;">${comment.attributes.content}</div>
                        <div style="color: #999; font-size: 0.8em;">${new Date(comment.attributes.created_at).toLocaleString()}</div>
                    </div>
                `).join('');
            }
        };
        
        document.getElementById('add-comment-btn').addEventListener('click', async () => {
            const content = document.getElementById('new-comment').value;
            if (content.trim()) {
                await this.createComment(resourceType, resourceId, content);
                document.getElementById('new-comment').value = '';
                loadComments();
            }
        });
        
        loadComments();
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
}

