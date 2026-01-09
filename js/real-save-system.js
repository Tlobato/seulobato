/* ===================================
   REAL SAVE SYSTEM
   Sistema que gera arquivos JSON reais para copiar
   =================================== */

class RealSaveSystem {
    constructor() {
        this.setupSaveSystem();
    }

    // Configura o sistema de salvamento real
    setupSaveSystem() {
        // Adiciona botão para gerar arquivos atualizados
        this.addGenerateFilesButton();
    }

    // Adiciona botão para gerar arquivos
    addGenerateFilesButton() {
        // Só adiciona se estivermos na página admin
        if (!window.location.pathname.includes('admin')) return;

        const container = document.querySelector('.admin-container');
        if (!container) return;

        const generateButton = document.createElement('div');
        generateButton.innerHTML = `
            <div class="generate-files-section" style="
                background: rgba(76, 175, 80, 0.1);
                border: 1px solid rgba(76, 175, 80, 0.3);
                border-radius: 10px;
                padding: 1.5rem;
                margin: 2rem 0;
            ">
                <h3 style="color: #4CAF50; margin-bottom: 1rem;">
                    💾 Gerar Arquivos Atualizados
                </h3>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">
                    Clique no botão abaixo para gerar os arquivos JSON atualizados. 
                    Copie o conteúdo e substitua nos arquivos do projeto.
                </p>
                <button id="generateFilesBtn" style="
                    background: #4CAF50;
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--transition-fast);
                ">
                    📁 Gerar Arquivos JSON
                </button>
            </div>
        `;

        container.appendChild(generateButton);

        // Event listener para o botão
        document.getElementById('generateFilesBtn').addEventListener('click', () => {
            this.generateUpdatedFiles();
        });
    }

    // Gera arquivos atualizados
    async generateUpdatedFiles() {
        try {
            // Carrega dados atuais
            const [statsData, teamData] = await Promise.all([
                this.loadCurrentStats(),
                this.loadCurrentTeamData()
            ]);

            // Gera modal com os arquivos
            this.showGeneratedFilesModal(statsData, teamData);

        } catch (error) {
            console.error('Erro ao gerar arquivos:', error);
            this.showNotification('Erro ao gerar arquivos: ' + error.message, 'error');
        }
    }

    // Carrega stats atuais
    async loadCurrentStats() {
        try {
            const response = await fetch('./data/player-stats.json?t=' + Date.now());
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar stats:', error);
            return {
                steam: { premierRank: 'Em breve' },
                faceit: { level: 'Em breve' },
                gc: { rank: 'Em breve' },
                lastUpdate: new Date().toISOString(),
                status: 'success'
            };
        }
    }

    // Carrega dados do time
    async loadCurrentTeamData() {
        try {
            const response = await fetch('./data/team-members.json?t=' + Date.now());
            return await response.json();
        } catch (error) {
            console.error('Erro ao carregar team data:', error);
            return {
                members: [],
                openPositions: [],
                teamSettings: {
                    maxMembers: 5,
                    currentMembers: 0,
                    recruitmentActive: true
                }
            };
        }
    }

    // Mostra modal com arquivos gerados
    showGeneratedFilesModal(statsData, teamData) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>📁 Arquivos JSON Atualizados</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="files-content">
                    <div class="file-section">
                        <h3>📊 data/player-stats.json</h3>
                        <div class="file-actions">
                            <button class="copy-btn" data-target="stats-json">📋 Copiar</button>
                            <button class="download-btn" data-content="${encodeURIComponent(JSON.stringify(statsData, null, 2))}" data-filename="player-stats.json">💾 Download</button>
                        </div>
                        <textarea id="stats-json" readonly style="
                            width: 100%;
                            height: 200px;
                            background: var(--dark-bg);
                            color: var(--text-primary);
                            border: 1px solid var(--border-color);
                            border-radius: 6px;
                            padding: 1rem;
                            font-family: monospace;
                            font-size: 0.9rem;
                            resize: vertical;
                        ">${JSON.stringify(statsData, null, 2)}</textarea>
                    </div>
                    
                    <div class="file-section" style="margin-top: 2rem;">
                        <h3>👥 data/team-members.json</h3>
                        <div class="file-actions">
                            <button class="copy-btn" data-target="team-json">📋 Copiar</button>
                            <button class="download-btn" data-content="${encodeURIComponent(JSON.stringify(teamData, null, 2))}" data-filename="team-members.json">💾 Download</button>
                        </div>
                        <textarea id="team-json" readonly style="
                            width: 100%;
                            height: 300px;
                            background: var(--dark-bg);
                            color: var(--text-primary);
                            border: 1px solid var(--border-color);
                            border-radius: 6px;
                            padding: 1rem;
                            font-family: monospace;
                            font-size: 0.9rem;
                            resize: vertical;
                        ">${JSON.stringify(teamData, null, 2)}</textarea>
                    </div>
                    
                    <div class="instructions" style="
                        background: rgba(102, 192, 244, 0.1);
                        border: 1px solid rgba(102, 192, 244, 0.3);
                        border-radius: 10px;
                        padding: 1.5rem;
                        margin-top: 2rem;
                    ">
                        <h3 style="color: #66c0f4;">📝 Como Usar:</h3>
                        <ol style="color: var(--text-secondary); line-height: 1.6;">
                            <li><strong>Copiar:</strong> Clique em "📋 Copiar" para copiar o conteúdo</li>
                            <li><strong>Download:</strong> Clique em "💾 Download" para baixar o arquivo</li>
                            <li><strong>Substituir:</strong> Substitua o conteúdo dos arquivos no seu projeto</li>
                            <li><strong>Commit:</strong> Faça commit das alterações no GitHub</li>
                            <li><strong>Deploy:</strong> As alterações aparecerão no site automaticamente</li>
                        </ol>
                        <p style="color: var(--text-secondary); margin-top: 1rem;">
                            <strong>💡 Dica:</strong> Você pode usar o GitHub web editor para editar os arquivos diretamente no navegador!
                        </p>
                    </div>
                </div>
                <div class="modal-footer" style="
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 2rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                ">
                    <button class="btn-secondary modal-close">Fechar</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => modal.remove());
        });

        modal.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const textarea = document.getElementById(targetId);
                textarea.select();
                document.execCommand('copy');
                
                btn.textContent = '✅ Copiado!';
                setTimeout(() => {
                    btn.textContent = '📋 Copiar';
                }, 2000);
            });
        });

        modal.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = decodeURIComponent(btn.dataset.content);
                const filename = btn.dataset.filename;
                
                const blob = new Blob([content], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                
                btn.textContent = '✅ Baixado!';
                setTimeout(() => {
                    btn.textContent = '💾 Download';
                }, 2000);
            });
        });

        // Clique fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Mostra notificação
    showNotification(message, type = 'success') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializa o sistema de salvamento real
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin')) {
        setTimeout(() => {
            window.realSaveSystem = new RealSaveSystem();
        }, 1000);
    }
});

// Exporta para uso global
window.RealSaveSystem = RealSaveSystem;