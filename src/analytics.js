class Analytics {
    static data = null;
    
    static async fetchAnalytics() {
        const response = await fetch(`${window.API_BASE_URL}/analytics`, {
            headers: Auth.getAuthHeaders()
        });
        
        if (response.ok) {
            this.data = await response.json();
            return this.data;
        }
        return null;
    }
    
    static async renderDashboard() {
        const data = await this.fetchAnalytics();
        if (!data) {
            const container = document.getElementById('analytics-view');
            if (container) {
                container.innerHTML = '<div class="analytics-error">Failed to load analytics data. Please try again later.</div>';
            }
            return;
        }
        
        const container = document.getElementById('analytics-view');
        if (!container) return;
        
        // Calculate additional metrics
        const activeProjects = data.projects.by_status['Active'] || data.projects.by_status['active'] || data.projects.by_status['In Progress'] || 0;
        const completedStories = data.stories.completed || 0;
        const avgStoriesPerProject = data.stories.average_per_project || 0;
        
        container.innerHTML = `
            <div class="analytics-dashboard">
                <div class="analytics-header">
                    <div class="analytics-title-section">
                        <h1 class="analytics-main-title">
                            <i class="fas fa-chart-line"></i>
                            Analytics Dashboard
                        </h1>
                        <p class="analytics-subtitle">Comprehensive insights into your project performance</p>
                    </div>
                    <div class="analytics-refresh">
                        <button class="btn-refresh" onclick="Analytics.renderDashboard()">
                            <i class="fas fa-sync-alt"></i> Refresh
                        </button>
                    </div>
                </div>
                
                <div class="analytics-stats-grid">
                    <div class="stat-card-modern stat-card-primary">
                        <div class="stat-card-icon">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${data.projects.total}</div>
                            <div class="stat-card-label">Total Projects</div>
                            <div class="stat-card-trend">
                                <i class="fas fa-arrow-up"></i>
                                <span>${activeProjects} active</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-modern stat-card-warning">
                        <div class="stat-card-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${data.projects.overdue}</div>
                            <div class="stat-card-label">Overdue Projects</div>
                            <div class="stat-card-trend">
                                <i class="fas fa-clock"></i>
                                <span>Needs attention</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-modern stat-card-success">
                        <div class="stat-card-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${data.projects.completion_rate}%</div>
                            <div class="stat-card-label">Completion Rate</div>
                            <div class="stat-card-trend">
                                <i class="fas fa-chart-line"></i>
                                <span>Performance metric</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="stat-card-modern stat-card-info">
                        <div class="stat-card-icon">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-card-content">
                            <div class="stat-card-value">${data.stories.total}</div>
                            <div class="stat-card-label">Total Stories</div>
                            <div class="stat-card-trend">
                                <i class="fas fa-tasks"></i>
                                <span>${completedStories} completed</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-charts-grid">
                    <div class="chart-card-modern">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <i class="fas fa-pie-chart"></i>
                                <span>Projects by Status</span>
                            </div>
                            <div class="chart-card-legend" id="status-legend"></div>
                        </div>
                        <div class="chart-container">
                            <canvas id="status-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="chart-card-modern">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <i class="fas fa-chart-bar"></i>
                                <span>Projects by Type</span>
                            </div>
                        </div>
                        <div class="chart-container">
                            <canvas id="type-chart"></canvas>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-timeline-section">
                    <div class="chart-card-modern chart-card-full">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <i class="fas fa-calendar-alt"></i>
                                <span>Activity Timeline (Last 30 Days)</span>
                            </div>
                            <div class="chart-card-subtitle">Track project and story creation over time</div>
                        </div>
                        <div class="chart-container chart-container-large">
                            <canvas id="timeline-chart"></canvas>
                        </div>
                    </div>
                </div>
                
                ${data.users && data.users.length > 0 ? `
                <div class="analytics-users-section">
                    <div class="chart-card-modern">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <i class="fas fa-users"></i>
                                <span>User Activity</span>
                            </div>
                        </div>
                        <div class="users-list">
                            ${data.users.map(user => `
                                <div class="user-activity-item">
                                    <div class="user-activity-avatar">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="user-activity-info">
                                        <div class="user-activity-name">${user.user || 'Unknown'}</div>
                                        <div class="user-activity-count">${user.activities} activities</div>
                                    </div>
                                    <div class="user-activity-badge">${user.activities}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}
                
                ${data.ai_insights ? `
                <div class="analytics-ai-insights-section">
                    <div class="chart-card-modern chart-card-full">
                        <div class="chart-card-header">
                            <div class="chart-card-title">
                                <i class="fas fa-brain" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-right: 0.5rem; font-size: 1.5rem;"></i>
                                <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 700;">AI-Powered Insights</span>
                            </div>
                            <div class="chart-card-subtitle">Intelligent analysis of your project data</div>
                        </div>
                        <div class="ai-insights-content">
                            <div class="ai-insights-text">${data.ai_insights.replace(/\n/g, '<br>')}</div>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        // Add custom styles
        this.injectStyles();
        
        // Load Chart.js if not already loaded
        if (typeof Chart === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
            script.onload = () => this.renderCharts(data);
            document.head.appendChild(script);
        } else {
            setTimeout(() => this.renderCharts(data), 100);
        }
    }
    
    static injectStyles() {
        if (document.getElementById('analytics-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'analytics-styles';
        style.textContent = `
            .analytics-dashboard {
                padding: 2rem;
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .analytics-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2.5rem;
                flex-wrap: wrap;
                gap: 1rem;
            }
            
            .analytics-title-section {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
                padding: 1.5rem 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(102, 126, 234, 0.2);
            }
            
            .analytics-main-title {
                font-size: 2.5rem;
                font-weight: 800;
                color: #1a202c;
                margin: 0;
                display: flex;
                align-items: center;
                gap: 1rem;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                letter-spacing: -0.5px;
            }
            
            .analytics-main-title i {
                color: #667eea;
                font-size: 2.2rem;
                filter: drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3));
            }
            
            .analytics-subtitle {
                color: #4a5568;
                font-size: 1.1rem;
                margin: 0.75rem 0 0 0;
                font-weight: 500;
                opacity: 0.9;
            }
            
            .btn-refresh {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            
            .btn-refresh:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
            }
            
            .analytics-stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .stat-card-modern {
                background: white;
                border-radius: 20px;
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .stat-card-modern::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, transparent, currentColor, transparent);
            }
            
            .stat-card-modern:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            }
            
            .stat-card-primary { color: #667eea; }
            .stat-card-warning { color: #f59e0b; }
            .stat-card-success { color: #10b981; }
            .stat-card-info { color: #3b82f6; }
            
            .stat-card-icon {
                width: 60px;
                height: 60px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                background: linear-gradient(135deg, currentColor 0%, currentColor 100%);
                opacity: 0.1;
                flex-shrink: 0;
            }
            
            .stat-card-icon i {
                opacity: 1;
                color: currentColor;
            }
            
            .stat-card-content {
                flex: 1;
            }
            
            .stat-card-value {
                font-size: 2.5rem;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 0.25rem;
            }
            
            .stat-card-label {
                font-size: 0.95rem;
                color: #718096;
                font-weight: 500;
                margin-bottom: 0.5rem;
            }
            
            .stat-card-trend {
                font-size: 0.85rem;
                color: #a0aec0;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .analytics-charts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 1.5rem;
                margin-bottom: 2rem;
            }
            
            .chart-card-modern {
                background: white;
                border-radius: 20px;
                padding: 1.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                transition: all 0.3s ease;
            }
            
            .chart-card-modern:hover {
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            }
            
            .chart-card-full {
                grid-column: 1 / -1;
            }
            
            .chart-card-header {
                margin-bottom: 1.5rem;
                padding-bottom: 1rem;
                border-bottom: 2px solid #f7fafc;
            }
            
            .chart-card-title {
                font-size: 1.25rem;
                font-weight: 700;
                color: #1a202c;
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            
            .chart-card-title i {
                color: #667eea;
            }
            
            .chart-card-subtitle {
                font-size: 0.9rem;
                color: #718096;
                margin-top: 0.5rem;
            }
            
            .chart-container {
                position: relative;
                height: 300px;
            }
            
            .chart-container-large {
                height: 400px;
            }
            
            .analytics-timeline-section {
                margin-bottom: 2rem;
            }
            
            .analytics-users-section {
                margin-top: 2rem;
            }
            
            .users-list {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .user-activity-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: #f7fafc;
                border-radius: 12px;
                transition: all 0.3s ease;
            }
            
            .user-activity-item:hover {
                background: #edf2f7;
                transform: translateX(5px);
            }
            
            .user-activity-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.25rem;
            }
            
            .user-activity-info {
                flex: 1;
            }
            
            .user-activity-name {
                font-weight: 600;
                color: #1a202c;
                margin-bottom: 0.25rem;
            }
            
            .user-activity-count {
                font-size: 0.85rem;
                color: #718096;
            }
            
            .user-activity-badge {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-weight: 600;
                font-size: 0.9rem;
            }
            
            .analytics-error {
                text-align: center;
                padding: 3rem;
                color: #718096;
                font-size: 1.1rem;
            }
            
            .analytics-ai-insights-section {
                margin-top: 2rem;
            }
            
            .ai-insights-content {
                padding: 1rem 0;
            }
            
            .ai-insights-text {
                line-height: 1.8;
                color: #2d3748;
                font-size: 1rem;
                background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
                padding: 1.5rem;
                border-radius: 12px;
                border-left: 4px solid;
                border-image: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%) 1;
            }
            
            .risk-badge {
                padding: 0.5rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                display: inline-block;
            }
            
            .risk-low {
                background: #d1fae5;
                color: #065f46;
            }
            
            .risk-medium {
                background: #fef3c7;
                color: #92400e;
            }
            
            .risk-high {
                background: #fee2e2;
                color: #991b1b;
            }
            
            .risk-critical {
                background: #fecaca;
                color: #7f1d1d;
                font-weight: 700;
            }
            
            @media (max-width: 768px) {
                .analytics-dashboard {
                    padding: 1rem;
                }
                
                .analytics-main-title {
                    font-size: 2rem;
                }
                
                .analytics-title-section {
                    padding: 1rem 1.5rem;
                }
                
                .analytics-charts-grid {
                    grid-template-columns: 1fr;
                }
                
                .stat-card-value {
                    font-size: 2rem;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    static renderCharts(data) {
        // Modern color palette
        const colors = {
            primary: '#667eea',
            secondary: '#764ba2',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6',
            purple: '#8b5cf6',
            pink: '#ec4899'
        };
        
        const gradientColors = [
            ['#667eea', '#764ba2'],
            ['#10b981', '#059669'],
            ['#f59e0b', '#d97706'],
            ['#ef4444', '#dc2626'],
            ['#3b82f6', '#2563eb'],
            ['#8b5cf6', '#7c3aed']
        ];
        
        // Status Chart - Modern Doughnut
        const statusCtx = document.getElementById('status-chart');
        if (statusCtx) {
            const statusLabels = Object.keys(data.projects.by_status);
            const statusData = Object.values(data.projects.by_status);
            const statusColors = statusLabels.map((label, i) => {
                const colors = ['#667eea', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];
                return colors[i % colors.length];
            });
            
            new Chart(statusCtx, {
                type: 'doughnut',
                data: {
                    labels: statusLabels,
                    datasets: [{
                        data: statusData,
                        backgroundColor: statusColors,
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            titleFont: {
                                size: 14,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 13
                            },
                            cornerRadius: 8,
                            displayColors: true,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '70%',
                    animation: {
                        animateRotate: true,
                        animateScale: true,
                        duration: 1500
                    }
                }
            });
            
            // Create custom legend
            const legendContainer = document.getElementById('status-legend');
            if (legendContainer) {
                legendContainer.innerHTML = statusLabels.map((label, i) => `
                    <div class="legend-item" style="display: inline-flex; align-items: center; margin-right: 1.5rem; margin-bottom: 0.5rem;">
                        <span class="legend-color" style="width: 12px; height: 12px; border-radius: 3px; background: ${statusColors[i]}; margin-right: 0.5rem;"></span>
                        <span style="font-size: 0.9rem; color: #718096;">${label}</span>
                        <span style="font-weight: 600; margin-left: 0.5rem; color: #1a202c;">${statusData[i]}</span>
                    </div>
                `).join('');
            }
        }
        
        // Type Chart - Modern Bar Chart
        const typeCtx = document.getElementById('type-chart');
        if (typeCtx) {
            const typeLabels = Object.keys(data.projects.by_type);
            const typeData = Object.values(data.projects.by_type);
            
            const ctx = typeCtx.getContext('2d');
            const gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
            gradient.addColorStop(1, 'rgba(118, 75, 162, 0.8)');
            
            new Chart(typeCtx, {
                type: 'bar',
                data: {
                    labels: typeLabels,
                    datasets: [{
                        label: 'Projects',
                        data: typeData,
                        backgroundColor: gradient,
                        borderRadius: 8,
                        borderSkipped: false,
                        barThickness: 'flex',
                        maxBarThickness: 60
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                title: function(context) {
                                    return context[0].label;
                                },
                                label: function(context) {
                                    return `${context.parsed.y} projects`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#718096',
                                font: {
                                    size: 11
                                }
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: '#718096',
                                font: {
                                    size: 11
                                }
                            }
                        }
                    },
                    animation: {
                        duration: 1500,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }
        
        // Timeline Chart - Modern Line Chart
        const timelineCtx = document.getElementById('timeline-chart');
        if (timelineCtx && data.timeline) {
            const labels = data.timeline.map(d => {
                const date = new Date(d.date);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            
            const ctx = timelineCtx.getContext('2d');
            const gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient1.addColorStop(0, 'rgba(102, 126, 234, 0.3)');
            gradient1.addColorStop(1, 'rgba(102, 126, 234, 0)');
            
            const gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
            gradient2.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
            gradient2.addColorStop(1, 'rgba(16, 185, 129, 0)');
            
            new Chart(timelineCtx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Projects Created',
                        data: data.timeline.map(d => d.projects_created),
                        borderColor: '#667eea',
                        backgroundColor: gradient1,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#764ba2',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3
                    }, {
                        label: 'Stories Created',
                        data: data.timeline.map(d => d.stories_created),
                        borderColor: '#10b981',
                        backgroundColor: gradient2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 7,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverBackgroundColor: '#059669',
                        pointHoverBorderColor: '#fff',
                        pointHoverBorderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top',
                            labels: {
                                usePointStyle: true,
                                padding: 20,
                                font: {
                                    size: 13,
                                    weight: '600'
                                },
                                color: '#1a202c'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: true,
                            titleFont: {
                                size: 13,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 12
                            },
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: '#718096',
                                font: {
                                    size: 11
                                },
                                stepSize: 1
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                drawBorder: false
                            },
                            ticks: {
                                color: '#718096',
                                font: {
                                    size: 11
                                },
                                maxRotation: 45,
                                minRotation: 45
                            }
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeInOutQuart'
                    }
                }
            });
        }
    }
}

