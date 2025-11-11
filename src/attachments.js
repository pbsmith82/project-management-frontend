class Attachments {
    static async uploadFiles(resourceType, resourceId, files) {
        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files[]', file);
        });
        
        const response = await fetch(
            `${window.API_BASE_URL}/attachments/${resourceType}/${resourceId}`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${Auth.token}`
                },
                body: formData
            }
        );
        
        return response.ok;
    }
    
    static async deleteAttachment(resourceType, resourceId, attachmentId) {
        const response = await fetch(
            `${window.API_BASE_URL}/attachments/${resourceType}/${resourceId}/${attachmentId}`,
            {
                method: 'DELETE',
                headers: Auth.getAuthHeaders()
            }
        );
        
        return response.ok;
    }
    
    static showAttachmentsModal(resourceType, resourceId, attachments, resourceTitle) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'attachments-modal';
        modal.innerHTML = `
            <div class="modal-dialog" style="max-width: 600px;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Attachments - ${resourceTitle}</h5>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="attachments-list" style="margin-bottom: 20px;"></div>
                        <div class="form-group">
                            <label>Upload Files</label>
                            <input type="file" class="form-control" id="file-input" multiple>
                        </div>
                        <button class="btn btn-primary" id="upload-files-btn">
                            <i class="fas fa-upload"></i> Upload
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const renderAttachments = () => {
            const container = document.getElementById('attachments-list');
            if (!attachments || attachments.length === 0) {
                container.innerHTML = '<p class="text-muted">No attachments</p>';
            } else {
                container.innerHTML = attachments.map(att => `
                    <div class="attachment-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #eee; margin-bottom: 10px;">
                        <div>
                            <i class="fas fa-file"></i> 
                            <a href="${window.API_BASE_URL}${att.url}" target="_blank">${att.filename}</a>
                            <span class="text-muted" style="font-size: 0.9em;">(${(att.byte_size / 1024).toFixed(2)} KB)</span>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="Attachments.deleteAttachment('${resourceType}', ${resourceId}, ${att.id}, this)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        };
        
        renderAttachments();
        
        document.getElementById('upload-files-btn').addEventListener('click', async () => {
            const files = document.getElementById('file-input').files;
            if (files.length > 0) {
                const success = await this.uploadFiles(resourceType, resourceId, files);
                if (success) {
                    alert('Files uploaded successfully');
                    modal.remove();
                } else {
                    alert('Upload failed');
                }
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    static async deleteAttachment(resourceType, resourceId, attachmentId, button) {
        if (confirm('Delete this attachment?')) {
            const success = await this.deleteAttachment(resourceType, resourceId, attachmentId);
            if (success) {
                button.closest('.attachment-item').remove();
            }
        }
    }
}

