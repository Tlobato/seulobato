/* ===================================
   PLAYER STATS SYSTEM
   Sistema para buscar e exibir ranks dos jogadores
   =================================== */

// Cache para evitar muitas requisições
const statsCache = {
    data: null,
    lastUpdate: null,
    cacheTime: 2 * 60 * 1000 // 2 minutos
};

// Classe para gerenciar stats dos jogadores
class PlayerStatsManager {
    constructor() {
        this.initializeFlipCards();
        this.loadPlayerStats();
    }

    // Inicializa os flip cards
    initializeFlipCards() {
        const flipCards = document.querySelectorAll('.flip-card');
        
        flipCards.forEach(card => {
            // Adiciona evento de clique
            card.addEventListener('click', (e) => {
                // Evita flip se clicar em links
                if (e.target.closest('a')) return;
                
                card.classList.toggle('flipped');
                
                // Carrega stats quando vira para trás
                if (card.classList.contains('flipped')) {
                    this.loadStatsForCard(card);
                }
            });

            // Adiciona indicador de flip se não existir (SÓ O ÍCONE, SEM TOOLTIP)
            if (!card.querySelector('.flip-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'flip-indicator';
                indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
                indicator.title = 'Ver ranks'; // Tooltip nativo do navegador (discreto)
                card.querySelector('.flip-card-front').appendChild(indicator);
            }

            // REMOVIDO: Tooltip customizado desnecessário
        });
    }

    // Carrega stats para um card específico
    async loadStatsForCard(card) {
        const playerId = card.dataset.playerId;
        if (!playerId) return;

        const statsContainer = card.querySelector('.rank-grid');
        if (!statsContainer) return;

        // Mostra loading
        this.showLoadingState(statsContainer);

        try {
            // Busca dados do arquivo JSON
            const statsData = await this.fetchStatsFromFile();
            
            // Atualiza a interface
            this.updateStatsDisplay(statsContainer, statsData);

        } catch (error) {
            console.error('Erro ao carregar stats:', error);
            this.showErrorState(statsContainer);
        }
    }

    // Busca dados do arquivo JSON gerado pelo GitHub Action
    async fetchStatsFromFile() {
        // Verifica cache
        if (this.isCacheValid()) {
            return statsCache.data;
        }

        try {
            console.log('🔍 Buscando dados dos stats...');
            
            // Busca o arquivo JSON
            const response = await fetch('./data/player-stats.json?t=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Salva no cache
            statsCache.data = data;
            statsCache.lastUpdate = Date.now();
            
            console.log('✅ Dados carregados:', data.status || 'success');
            return data;
            
        } catch (error) {
            console.error('❌ Erro ao buscar arquivo de stats:', error);
            
            // Retorna dados fallback - SEM VALORES FIXOS
            return {
                steam: {
                    premierRank: 'Em breve',
                    hoursPlayed: 'Em breve'
                },
                faceit: {
                    level: 'Em breve'
                },
                gc: {
                    rank: 'Em breve'
                },
                status: 'error',
                error: error.message
            };
        }
    }

    // Verifica se o cache ainda é válido
    isCacheValid() {
        return statsCache.data && 
               statsCache.lastUpdate && 
               (Date.now() - statsCache.lastUpdate) < statsCache.cacheTime;
    }

    // Mostra estado de loading
    showLoadingState(container) {
        container.innerHTML = `
            <div class="rank-item steam">
                <span class="platform-name">
                    <i class="fab fa-steam"></i> CS2 Premier
                </span>
                <span class="rank-value rank-loading">
                    <span class="loading-spinner"></span> Carregando...
                </span>
            </div>
            <div class="rank-item faceit">
                <span class="platform-name">
                    <i class="fas fa-trophy"></i> FACEIT
                </span>
                <span class="rank-value rank-loading">
                    <span class="loading-spinner"></span> Carregando...
                </span>
            </div>
            <div class="rank-item gc">
                <span class="platform-name">
                    <i class="fas fa-gamepad"></i> GamersClub
                </span>
                <span class="rank-value rank-loading">
                    <span class="loading-spinner"></span> Carregando...
                </span>
            </div>
        `;
    }

    // Atualiza a exibição dos stats - SEM VALORES FIXOS
    updateStatsDisplay(container, data) {
        const steamData = data.steam || {};
        const faceitData = data.faceit || {};
        const gcData = data.gc || {};
        
        // Formata dados do Steam - APENAS SE TIVER DADOS REAIS
        let steamContent = '';
        if (steamData.premierRank && steamData.premierRank !== 'N/A' && steamData.premierRank !== 'Em breve') {
            steamContent += `<div style="font-size: 0.95rem; margin-bottom: 0.3rem;"><strong>${steamData.premierRank}</strong></div>`;
            
            // Só mostra horas se disponível
            if (steamData.hoursPlayed && steamData.hoursPlayed !== 'N/A' && steamData.hoursPlayed !== 'Em breve') {
                steamContent += `<div style="font-size: 0.8rem; opacity: 0.8;">Horas jogadas: ${steamData.hoursPlayed}</div>`;
            }
        } else {
            // Se não tiver dados reais, mostra "Em breve"
            steamContent = 'Em breve';
        }

        // Mostra quando foi atualizado - FUNCIONA COM GITHUB ACTIONS
        const lastUpdate = data.lastUpdate ? new Date(data.lastUpdate) : null;
        const updateText = lastUpdate ? 
            `${lastUpdate.toLocaleDateString('pt-BR')} ${lastUpdate.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}` : 
            '';

        container.innerHTML = `
            <div class="rank-item steam">
                <span class="platform-name">
                    <i class="fab fa-steam"></i> CS2 Premier
                </span>
                <div class="rank-value">
                    ${steamContent}
                </div>
            </div>
            <div class="rank-item faceit">
                <span class="platform-name">
                    <i class="fas fa-trophy"></i> FACEIT
                </span>
                <span class="rank-value">
                    ${faceitData.level || 'Em breve'}
                </span>
            </div>
            <div class="rank-item gc">
                <span class="platform-name">
                    <i class="fas fa-gamepad"></i> GamersClub
                </span>
                <span class="rank-value">
                    ${gcData.rank || 'Em breve'}
                </span>
            </div>
            ${updateText ? `
            <div style="text-align: center; margin-top: 1rem; font-size: 0.65rem; opacity: 0.5;">
                Atualizado: ${updateText}
            </div>
            ` : ''}
        `;
    }

    // Mostra estado de erro
    showErrorState(container) {
        container.innerHTML = `
            <div class="rank-item steam">
                <span class="platform-name">
                    <i class="fab fa-steam"></i> CS2 Premier
                </span>
                <span class="rank-value">
                    Em breve
                </span>
            </div>
            <div class="rank-item faceit">
                <span class="platform-name">
                    <i class="fas fa-trophy"></i> FACEIT
                </span>
                <span class="rank-value">
                    Em breve
                </span>
            </div>
            <div class="rank-item gc">
                <span class="platform-name">
                    <i class="fas fa-gamepad"></i> GamersClub
                </span>
                <span class="rank-value">
                    Em breve
                </span>
            </div>
        `;
    }

    // Carrega stats iniciais
    loadPlayerStats() {
        console.log('🎮 Sistema de stats inicializado - GitHub Actions');
    }

    // Método público para atualizar stats manualmente
    refreshStats() {
        // Limpa cache
        statsCache.data = null;
        statsCache.lastUpdate = null;

        // Recarrega stats para cards virados
        const flippedCards = document.querySelectorAll('.flip-card.flipped');
        flippedCards.forEach(card => this.loadStatsForCard(card));
    }
}

// Inicializa o sistema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.playerStatsManager = new PlayerStatsManager();
});

// Exporta para uso global
window.PlayerStatsManager = PlayerStatsManager;