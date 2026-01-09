/* ===================================
   TEAM MANAGEMENT SYSTEM - REAL SAVE
   Sistema para gerenciar membros do time com salvamento real
   =================================== */

class TeamManager {
    constructor() {
        this.teamData = null;
        this.initializeManager();
    }

    // Inicializa o gerenciador
    async initializeManager() {
        await this.loadTeamData();
        this.setupEventListeners();
        this.renderTeamManagement();
    }

    // Carrega dados do time
    async loadTeamData() {
        try {
            const response = await fetch('./data/team-members.json?t=' + Date.now());
            if (!response.ok) {
                throw new Error('Erro ao carregar dados do time');
            }
            this.teamData = await response.json();
        } catch (error) {
            console.error('Erro ao carregar dados do time:', error);
            // Dados fallback
            this.teamData = {
                members: [
                    {
                        id: "lobato",
                        nickname: "Lobato",
                        realName: "Thyago Lobato",
                        role: "AWPer",
                        roleDescription: "AWPer Principal",
                        description: "Entusiasta da AWP e apaixonado pela arma. Treino diariamente focando em flickshots, tiros de longa distância e reflexos rápidos. Gosto de jogar posicionado, fazendo picks decisivos e dando suporte ao time com eliminações estratégicas nos momentos cruciais.",
                        image: "lobato.jpeg",
                        stats: {
                            availability: "2h/dia + fins de semana",
                            specialty: "Flickshots e picks de longa distância"
                        },
                        contact: {
                            steam: "76561199403242930",
                            whatsapp: "(15) 98122-9370",
                            email: "thyagollobato@gmail.com"
                        },
                        status: "active",
                        joinDate: "2025-01-01",
                        lastUpdate: new Date().toISOString()
                    }
                ],
                openPositions: [
                    {
                        id: "entry-fragger",
                        role: "Entry Fragger",
                        description: "Procuramos alguém corajoso para abrir os sites! Ideal para quem gosta de ser o primeiro a entrar e não tem medo de trocar bala. Treinos 3x por semana (seg/qua/sex) + fins de semana opcionais.",
                        requirements: [
                            "Disponibilidade seg/qua/sex",
                            "Coragem para entry frags",
                            "Boa mira e reflexos"
                        ],
                        priority: 1,
                        status: "open"
                    },
                    {
                        id: "igl",
                        role: "IGL",
                        roleDescription: "In-Game Leader",
                        description: "Precisamos de um líder para organizar as jogadas! Ideal para quem gosta de pensar estratégias, fazer calls e coordenar o time. Experiência é bem-vinda, mas vontade de aprender também vale!",
                        requirements: [
                            "Liderança natural",
                            "Conhecimento tático",
                            "Boa comunicação"
                        ],
                        priority: 2,
                        status: "open"
                    },
                    {
                        id: "support",
                        role: "Support",
                        roleDescription: "Support Player",
                        description: "Buscamos alguém para dar suporte ao time! Especialista em utilitários, smokes, flashes e sempre presente para ajudar os companheiros. Perfeito para quem gosta de jogar em equipe.",
                        requirements: [
                            "Conhecimento de utilitários",
                            "Jogo em equipe",
                            "Paciência e dedicação"
                        ],
                        priority: 3,
                        status: "open"
                    },
                    {
                        id: "rifler",
                        role: "Rifler",
                        roleDescription: "Rifler Versátil",
                        description: "Procuramos um rifler versátil para completar o time! Alguém que se adapte a diferentes situações e possa jogar em várias posições conforme a necessidade da partida.",
                        requirements: [
                            "Versatilidade",
                            "Adaptabilidade",
                            "Boa mira com rifles"
                        ],
                        priority: 4,
                        status: "open"
                    }
                ],
                teamSettings: {
                    maxMembers: 5,
                    currentMembers: 1,
                    recruitmentActive: true,
                    lastUpdate: new Date().toISOString()
                }
            };
        }
    }

    // Configura event listeners
    setupEventListeners() {
        // Botões de ação
        document.addEventListener('click', (e) => {
            if (e.target.matches('.add-member-btn')) {
                this.showAddMemberModal();
            } else if (e.target.matches('.edit-member-btn')) {
                const memberId = e.target.dataset.memberId;
                this.showEditMemberModal(memberId);
            } else if (e.target.matches('.remove-member-btn')) {
                const memberId = e.target.dataset.memberId;
                this.confirmRemoveMember(memberId);
            } else if (e.target.matches('.add-position-btn')) {
                this.showAddPositionModal();
            } else if (e.target.matches('.edit-position-btn')) {
                const positionId = e.target.dataset.positionId;
                this.showEditPositionModal(positionId);
            } else if (e.target.matches('.remove-position-btn')) {
                const positionId = e.target.dataset.positionId;
                this.confirmRemovePosition(positionId);
            }
        });
    }

    // Renderiza interface de gerenciamento
    renderTeamManagement() {
        const container = document.getElementById('team-management-container');
        if (!container) return;

        container.innerHTML = `
            <div class="team-management">
                <!-- Estatísticas do Time -->
                <div class="team-stats-overview">
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <span class="stat-number">${this.teamData.members.length}</span>
                            <span class="stat-label">Membros Ativos</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📋</div>
                        <div class="stat-info">
                            <span class="stat-number">${this.teamData.openPositions.length}</span>
                            <span class="stat-label">Vagas Abertas</span>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-info">
                            <span class="stat-number">${this.teamData.teamSettings.maxMembers}</span>
                            <span class="stat-label">Máximo de Membros</span>
                        </div>
                    </div>
                </div>

                <!-- Aviso sobre Salvamento -->
                <div class="save-info" style="
                    background: rgba(255, 193, 7, 0.1);
                    border: 1px solid rgba(255, 193, 7, 0.3);
                    border-radius: 10px;
                    padding: 1rem;
                    margin-bottom: 2rem;
                ">
                    <h4 style="color: #ffc107; margin-bottom: 0.5rem;">💡 Como Salvar as Alterações</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">
                        Após fazer alterações, role para baixo e clique em <strong>"📁 Gerar Arquivos JSON"</strong> 
                        para obter os arquivos atualizados e substituir no seu projeto GitHub.
                    </p>
                </div>

                <!-- Membros Atuais -->
                <div class="management-section">
                    <div class="section-header">
                        <h3>👥 Membros do Time</h3>
                        <button class="add-member-btn btn-primary">
                            <i class="fas fa-plus"></i> Adicionar Membro
                        </button>
                    </div>
                    <div class="members-list">
                        ${this.renderMembersList()}
                    </div>
                </div>

                <!-- Vagas Abertas -->
                <div class="management-section">
                    <div class="section-header">
                        <h3>📋 Vagas Abertas</h3>
                        <button class="add-position-btn btn-secondary">
                            <i class="fas fa-plus"></i> Adicionar Vaga
                        </button>
                    </div>
                    <div class="positions-list">
                        ${this.renderPositionsList()}
                    </div>
                </div>
            </div>
        `;
    }

    // Renderiza lista de membros
    renderMembersList() {
        if (this.teamData.members.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>Nenhum membro cadastrado ainda</p>
                </div>
            `;
        }

        return this.teamData.members.map(member => `
            <div class="member-card">
                <div class="member-avatar">
                    <img src="${member.image || 'default-avatar.png'}" alt="${member.nickname}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiMzMzMiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDEyQzE0LjIwOTEgMTIgMTYgMTAuMjA5MSAxNiA4QzE2IDUuNzkwODYgMTQuMjA5MSA0IDEyIDRDOS43OTA4NiA0IDggNS43OTA4NiA4IDhDOCAxMC4yMDkxIDkuNzkwODYgMTIgMTIgMTJaIiBmaWxsPSIjNjY2Ii8+CjxwYXRoIGQ9Ik0xMiAxNEM5LjMzIDEzLjk5IDcuMDEgMTUuNjIgNiAxOEMxMC4wMSAyMCAxMy45OSAyMCAxOCAxOEMxNi45OSAxNS42MiAxNC42NyAxMy45OSAxMiAxNFoiIGZpbGw9IiM2NjYiLz4KPC9zdmc+Cjwvc3ZnPgo='">
                </div>
                <div class="member-info">
                    <h4>${member.nickname}</h4>
                    <p class="member-role">${member.role}</p>
                    <p class="member-description">${member.description.substring(0, 100)}...</p>
                    <div class="member-meta">
                        <span class="join-date">Entrou em: ${new Date(member.joinDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                </div>
                <div class="member-actions">
                    <button class="edit-member-btn btn-small" data-member-id="${member.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="remove-member-btn btn-small btn-danger" data-member-id="${member.id}">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Renderiza lista de vagas
    renderPositionsList() {
        if (this.teamData.openPositions.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-briefcase"></i>
                    <p>Nenhuma vaga aberta no momento</p>
                </div>
            `;
        }

        return this.teamData.openPositions.map(position => `
            <div class="position-card">
                <div class="position-info">
                    <h4>${position.role}</h4>
                    <p class="position-description">${position.description}</p>
                    <div class="position-requirements">
                        <strong>Requisitos:</strong>
                        <ul>
                            ${position.requirements.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="position-meta">
                        <span class="priority">Prioridade: ${position.priority}</span>
                        <span class="status status-${position.status}">${position.status === 'open' ? 'Aberta' : 'Fechada'}</span>
                    </div>
                </div>
                <div class="position-actions">
                    <button class="edit-position-btn btn-small" data-position-id="${position.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="remove-position-btn btn-small btn-danger" data-position-id="${position.id}">
                        <i class="fas fa-trash"></i> Remover
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Modal para adicionar membro
    showAddMemberModal() {
        this.showMemberModal('add');
    }

    // Modal para editar membro
    showEditMemberModal(memberId) {
        const member = this.teamData.members.find(m => m.id === memberId);
        if (member) {
            this.showMemberModal('edit', member);
        }
    }

    // Modal genérico para membro
    showMemberModal(mode, member = null) {
        const isEdit = mode === 'edit';
        const title = isEdit ? 'Editar Membro' : 'Adicionar Novo Membro';
        
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <form class="member-form" id="memberForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="nickname">Nickname *</label>
                            <input type="text" id="nickname" required value="${member?.nickname || ''}">
                        </div>
                        <div class="form-group">
                            <label for="realName">Nome Real</label>
                            <input type="text" id="realName" value="${member?.realName || ''}">
                        </div>
                        <div class="form-group">
                            <label for="role">Função *</label>
                            <select id="role" required>
                                <option value="">Selecione uma função</option>
                                <option value="AWPer" ${member?.role === 'AWPer' ? 'selected' : ''}>AWPer</option>
                                <option value="Entry Fragger" ${member?.role === 'Entry Fragger' ? 'selected' : ''}>Entry Fragger</option>
                                <option value="IGL" ${member?.role === 'IGL' ? 'selected' : ''}>IGL</option>
                                <option value="Support" ${member?.role === 'Support' ? 'selected' : ''}>Support</option>
                                <option value="Rifler" ${member?.role === 'Rifler' ? 'selected' : ''}>Rifler</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="roleDescription">Descrição da Função</label>
                            <input type="text" id="roleDescription" value="${member?.roleDescription || ''}">
                        </div>
                        <div class="form-group full-width">
                            <label for="description">Descrição do Jogador *</label>
                            <textarea id="description" required rows="4">${member?.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="image">Imagem (nome do arquivo)</label>
                            <input type="text" id="image" placeholder="ex: jogador.jpg" value="${member?.image || ''}">
                        </div>
                        <div class="form-group">
                            <label for="availability">Disponibilidade</label>
                            <input type="text" id="availability" value="${member?.stats?.availability || ''}">
                        </div>
                        <div class="form-group">
                            <label for="specialty">Especialidade</label>
                            <input type="text" id="specialty" value="${member?.stats?.specialty || ''}">
                        </div>
                        <div class="form-group">
                            <label for="steamId">Steam ID</label>
                            <input type="text" id="steamId" value="${member?.contact?.steam || ''}">
                        </div>
                        <div class="form-group">
                            <label for="whatsapp">WhatsApp</label>
                            <input type="text" id="whatsapp" value="${member?.contact?.whatsapp || ''}">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" value="${member?.contact?.email || ''}">
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-primary">
                            ${isEdit ? 'Atualizar' : 'Adicionar'} Membro
                        </button>
                        <button type="button" class="btn-secondary modal-close">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('#memberForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMember(modal, isEdit ? member.id : null);
        });

        // Clique fora do modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Salva membro
    async saveMember(modal, memberId = null) {
        const form = modal.querySelector('#memberForm');
        const formData = new FormData(form);
        
        const memberData = {
            id: memberId || this.generateId(form.nickname.value),
            nickname: form.nickname.value,
            realName: form.realName.value,
            role: form.role.value,
            roleDescription: form.roleDescription.value,
            description: form.description.value,
            image: form.image.value,
            stats: {
                availability: form.availability.value,
                specialty: form.specialty.value
            },
            contact: {
                steam: form.steamId.value,
                whatsapp: form.whatsapp.value,
                email: form.email.value
            },
            status: 'active',
            joinDate: memberId ? this.teamData.members.find(m => m.id === memberId)?.joinDate : new Date().toISOString(),
            lastUpdate: new Date().toISOString()
        };

        try {
            if (memberId) {
                // Editar membro existente
                const index = this.teamData.members.findIndex(m => m.id === memberId);
                if (index !== -1) {
                    this.teamData.members[index] = memberData;
                }
            } else {
                // Adicionar novo membro
                this.teamData.members.push(memberData);
                this.teamData.teamSettings.currentMembers = this.teamData.members.length;
            }

            // Atualiza timestamp geral
            this.teamData.teamSettings.lastUpdate = new Date().toISOString();

            modal.remove();
            this.renderTeamManagement();
            this.showNotification(`Membro ${memberId ? 'atualizado' : 'adicionado'} com sucesso! Lembre-se de gerar os arquivos JSON atualizados.`);
        } catch (error) {
            this.showNotification('Erro ao salvar membro: ' + error.message, 'error');
        }
    }

    // Confirma remoção de membro
    confirmRemoveMember(memberId) {
        const member = this.teamData.members.find(m => m.id === memberId);
        if (!member) return;

        if (confirm(`Tem certeza que deseja remover ${member.nickname} do time?`)) {
            this.removeMember(memberId);
        }
    }

    // Remove membro
    async removeMember(memberId) {
        try {
            this.teamData.members = this.teamData.members.filter(m => m.id !== memberId);
            this.teamData.teamSettings.currentMembers = this.teamData.members.length;
            this.teamData.teamSettings.lastUpdate = new Date().toISOString();
            
            this.renderTeamManagement();
            this.showNotification('Membro removido com sucesso! Lembre-se de gerar os arquivos JSON atualizados.');
        } catch (error) {
            this.showNotification('Erro ao remover membro: ' + error.message, 'error');
        }
    }

    // Gera ID único
    generateId(nickname) {
        return nickname.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
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

// Exporta para uso global
window.TeamManager = TeamManager;