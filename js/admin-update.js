/* ===================================
   ADMIN UPDATE SYSTEM - MULTI-PLAYER
   Sistema para atualizar ranks de múltiplos jogadores
   =================================== */

class AdminUpdateManager {
    constructor() {
        this.currentPlayerId = null;
        this.playersData = null;
        this.initializeForm();
        this.loadCurrentStats();
    }

    // Inicializa o formulário
    initializeForm() {
        const form = document.getElementById('updateForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Event listener para seletor de jogador
        document.addEventListener('change', (e) => {
            if (e.target.id === 'playerSelector') {
                this.currentPlayerId = e.target.value;
                this.updateFormForPlayer();
            }
        });
    }

    // Carrega stats atuais
    async loadCurrentStats() {
        try {
            const response = await fetch('../data/player-stats.json?t=' + Date.now());
            const data = await response.json();
            
            this.playersData = data;
            this.createPlayerSelector(data);
            this.displayCurrentStats(data);
            
        } catch (error) {
            console.error('Erro ao carregar stats:', error);
            this.showNotification('Erro ao carregar dados atuais', 'error');
        }
    }

    // Cria seletor de jogadores
    createPlayerSelector(data) {
        const container = document.getElementById('current-stats-content');
        if (!container) return;

        // Verifica se é estrutura nova ou antiga
        let players = {};
        if (data.players) {
            players = data.players;
        } else if (data.steam) {
            // Estrutura antiga - converte
            players = {
                'default': {
                    nickname: 'Jogador Principal',
                    steam: data.steam,
                    faceit: data.faceit,
                    gc: data.gc
                }
            };
        }

        // Cria seletor
        let selectorHTML = `
            <div class="player-selector-container" style="margin-bottom: 2rem;">
                <label for="playerSelector" style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-primary);">
                    👤 Selecionar Jogador:
                </label>
                <select id="playerSelector" style="
                    width: 100%;
                    padding: 0.75rem;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--dark-bg);
                    color: var(--text-primary);
                    font-size: 1rem;
                ">
                    <option value="">Selecione um jogador...</option>
        `;

        Object.keys(players).forEach(playerId => {
            const player = players[playerId];
            selectorHTML += `<option value="${playerId}">${player.nickname || 'Jogador'}</option>`;
        });

        selectorHTML += `
                </select>
            </div>
            <div id="player-stats-display"></div>
        `;

        container.innerHTML = selectorHTML;

        // Auto-seleciona primeiro jogador se houver apenas um
        if (Object.keys(players).length === 1) {
            const firstPlayerId = Object.keys(players)[0];
            document.getElementById('playerSelector').value = firstPlayerId;
            this.currentPlayerId = firstPlayerId;
            this.updateFormForPlayer();
        }
    }

    // Atualiza formulário para jogador selecionado
    updateFormForPlayer() {
        if (!this.currentPlayerId || !this.playersData) return;

        const players = this.playersData.players || {};
        const playerData = players[this.currentPlayerId];

        if (!playerData) return;

        // Atualiza display dos stats atuais
        this.displayPlayerStats(playerData);

        // Preenche formulário
        this.populateForm(playerData);
    }

    // Exibe stats do jogador selecionado
    displayPlayerStats(playerData) {
        const container = document.getElementById('player-stats-display');
        if (!container) return;

        const formatDate = (dateStr) => {
            if (!dateStr) return 'Nunca';
            return new Date(dateStr).toLocaleString('pt-BR');
        };

        const getUpdateType = (platformData) => {
            if (!platformData?.updateType) return '';
            return platformData.updateType === 'automatic' ? ' (Auto)' : ' (Manual)';
        };

        container.innerHTML = `
            <div style="
                background: rgba(212, 165, 116, 0.1);
                border: 1px solid rgba(212, 165, 116, 0.3);
                border-radius: 10px;
                padding: 1.5rem;
                margin-bottom: 1rem;
            ">
                <h4 style="color: var(--primary-color); margin-bottom: 1rem;">
                    📊 Stats Atuais - ${playerData.nickname}
                </h4>
                <div class="stat-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(212, 165, 116, 0.2);">
                    <span>🎯 CS2 Premier:</span>
                    <span>${playerData.steam?.premierRank || 'Em breve'}${getUpdateType(playerData.steam)}</span>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(212, 165, 116, 0.2);">
                    <span>🏆 FACEIT:</span>
                    <span>${playerData.faceit?.level || 'Em breve'}${getUpdateType(playerData.faceit)}</span>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(212, 165, 116, 0.2);">
                    <span>🎮 GamersClub:</span>
                    <span>${playerData.gc?.rank || 'Em breve'}${getUpdateType(playerData.gc)}</span>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(212, 165, 116, 0.2);">
                    <span>📅 Premier atualizado:</span>
                    <span>${formatDate(playerData.steam?.lastUpdate)}</span>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid rgba(212, 165, 116, 0.2);">
                    <span>📅 FACEIT atualizado:</span>
                    <span>${formatDate(playerData.faceit?.lastUpdate)}</span>
                </div>
                <div class="stat-row" style="display: flex; justify-content: space-between; padding: 0.5rem 0;">
                    <span>📅 GC atualizado:</span>
                    <span>${formatDate(playerData.gc?.lastUpdate)}</span>
                </div>
            </div>
        `;
    }

    // Exibe stats gerais (quando nenhum jogador selecionado)
    displayCurrentStats(data) {
        const container = document.getElementById('player-stats-display');
        if (!container) return;

        const playersCount = data.players ? Object.keys(data.players).length : 1;
        
        container.innerHTML = `
            <div style="
                background: rgba(102, 192, 244, 0.1);
                border: 1px solid rgba(102, 192, 244, 0.3);
                border-radius: 10px;
                padding: 1.5rem;
                text-align: center;
            ">
                <h4 style="color: #66c0f4; margin-bottom: 1rem;">📊 Resumo do Time</h4>
                <p style="color: var(--text-secondary);">
                    <strong>${playersCount}</strong> jogador(es) cadastrado(s)
                </p>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                    Selecione um jogador acima para ver e editar seus ranks
                </p>
            </div>
        `;
    }

    // Preenche o formulário
    populateForm(playerData) {
        const premierInput = document.getElementById('premierRank');
        const gcInput = document.getElementById('gcRank');
        
        if (premierInput) {
            premierInput.value = (playerData.steam?.premierRank && playerData.steam.premierRank !== 'Em breve') 
                ? playerData.steam.premierRank : '';
        }
        
        if (gcInput) {
            gcInput.value = (playerData.gc?.rank && playerData.gc.rank !== 'Em breve') 
                ? playerData.gc.rank : '';
        }
    }

    // Manipula envio do formulário
    async handleFormSubmit(e) {
        e.preventDefault();
        
        if (!this.currentPlayerId) {
            this.showNotification('Selecione um jogador primeiro!', 'error');
            return;
        }

        const premierRank = document.getElementById('premierRank').value.trim();
        const gcRank = document.getElementById('gcRank').value.trim();
        
        if (!premierRank) {
            this.showNotification('Premier Rank é obrigatório!', 'error');
            return;
        }

        try {
            // Carrega dados atuais
            const currentData = await this.getCurrentData();
            
            // Atualiza dados do jogador específico
            if (!currentData.players) {
                currentData.players = {};
            }

            if (!currentData.players[this.currentPlayerId]) {
                currentData.players[this.currentPlayerId] = {
                    nickname: 'Jogador',
                    steam: {},
                    faceit: {},
                    gc: {}
                };
            }

            const playerData = currentData.players[this.currentPlayerId];
            
            // Atualiza com novos valores
            playerData.steam = {
                ...playerData.steam,
                premierRank: premierRank,
                lastUpdate: new Date().toISOString(),
                updateType: 'manual'
            };

            playerData.gc = {
                ...playerData.gc,
                rank: gcRank || 'Em breve',
                lastUpdate: gcRank ? new Date().toISOString() : playerData.gc?.lastUpdate,
                updateType: 'manual'
            };

            // Atualiza timestamp geral
            currentData.teamSettings = {
                ...currentData.teamSettings,
                lastUpdate: new Date().toISOString()
            };

            // Simula salvamento
            await this.saveData(currentData);
            
            this.showNotification(`Ranks de ${playerData.nickname} atualizados com sucesso! 🎉`);
            
            // Recarrega dados após 1 segundo
            setTimeout(() => {
                this.loadCurrentStats();
            }, 1000);
            
            // Limpa campos editáveis
            document.getElementById('premierRank').value = '';
            document.getElementById('gcRank').value = '';
            
        } catch (error) {
            console.error('Erro ao atualizar:', error);
            this.showNotification('Erro ao atualizar ranks: ' + error.message, 'error');
        }
    }

    // Obtém dados atuais
    async getCurrentData() {
        const response = await fetch('../data/player-stats.json?t=' + Date.now());
        if (!response.ok) {
            throw new Error('Erro ao carregar dados atuais');
        }
        return await response.json();
    }

    // Salva dados (simulado - em produção seria uma API)
    async saveData(data) {
        console.log('Dados que seriam salvos:', data);
        
        // Simula delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return true;
    }

    // Mostra notificação
    showNotification(message, type = 'success') {
        // Remove notificação existente
        const existing = document.querySelector('.notification');
        if (existing) {
            existing.remove();
        }

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

// Inicializa quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('updateForm')) {
        window.adminUpdateManager = new AdminUpdateManager();
    }
});