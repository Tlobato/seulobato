/* ===================================
   PLAYER STATS SYSTEM
   Sistema para buscar e exibir ranks dos jogadores
   =================================== */

// Configuração das APIs
const STATS_CONFIG = {
    faceit: {
        apiKey: '02abe85d-c5f2-495c-a3ed-fca9c02fad6b',
        playerNickname: 'Lobato-', // Nickname do FACEIT
        baseUrl: 'https://open.faceit.com/data/v4'
    }
};

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

            // Adiciona indicador de flip se não existir
            if (!card.querySelector('.flip-indicator')) {
                const indicator = document.createElement('div');
                indicator.className = 'flip-indicator';
                indicator.innerHTML = '<i class="fas fa-sync-alt"></i>';
                indicator.title = 'Ver ranks'; 
                card.querySelector('.flip-card-front').appendChild(indicator);
            }
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
            // Busca dados do arquivo JSON + FACEIT API
            const [fileData, faceitData] = await Promise.allSettled([
                this.fetchStatsFromFile(playerId),
                this.fetchFaceitStats()
            ]);

            const statsData = fileData.status === 'fulfilled' ? fileData.value : {};
            const faceitStats = faceitData.status === 'fulfilled' ? faceitData.value : null;

            // Mescla dados do FACEIT se disponível
            if (faceitStats) {
                statsData.faceit = {
                    ...statsData.faceit,
                    ...faceitStats,
                    lastUpdate: new Date().toISOString(),
                    updateType: 'automatic'
                };
            }
            
            // Atualiza a interface
            this.updateStatsDisplay(statsContainer, statsData);

        } catch (error) {
            console.error('Erro ao carregar stats:', error);
            this.showErrorState(statsContainer);
        }
    }

    // Busca dados do arquivo JSON para um jogador específico
    async fetchStatsFromFile(playerId) {
        // Verifica cache
        if (this.isCacheValid()) {
            return this.getPlayerStats(statsCache.data, playerId);
        }

        try {
            console.log('🔍 Buscando dados dos stats...');
            
            const response = await fetch('./data/player-stats.json?t=' + Date.now());
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Salva no cache
            statsCache.data = data;
            statsCache.lastUpdate = Date.now();
            
            console.log('✅ Dados carregados:', data.status || 'success');
            return this.getPlayerStats(data, playerId);
            
        } catch (error) {
            console.error('❌ Erro ao buscar arquivo de stats:', error);
            
            // Retorna dados fallback
            return {
                steam: {
                    premierRank: 'Em breve'
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

    // Extrai stats de um jogador específico
    getPlayerStats(data, playerId) {
        // Se for estrutura antiga (um jogador só), retorna direto
        if (data.steam && !data.players) {
            return data;
        }

        // Se for estrutura nova (múltiplos jogadores)
        if (data.players && data.players[playerId]) {
            return data.players[playerId];
        }

        // Fallback
        return {
            steam: { premierRank: 'Em breve' },
            faceit: { level: 'Em breve' },
            gc: { rank: 'Em breve' }
        };
    }

    // Busca dados do FACEIT pelo nickname
    async fetchFaceitStats() {
        if (!STATS_CONFIG.faceit.apiKey || !STATS_CONFIG.faceit.playerNickname) {
            console.log('⚠️ FACEIT API não configurada');
            return null;
        }

        try {
            console.log('🔍 Buscando dados do FACEIT pelo nickname...');
            
            // Primeiro busca o jogador pelo nickname
            const playerResponse = await fetch(
                `${STATS_CONFIG.faceit.baseUrl}/players?nickname=${STATS_CONFIG.faceit.playerNickname}`,
                {
                    headers: {
                        'Authorization': `Bearer ${STATS_CONFIG.faceit.apiKey}`,
                        'Accept': 'application/json'
                    }
                }
            );

            if (!playerResponse.ok) {
                console.error(`❌ FACEIT API Error: ${playerResponse.status} - ${playerResponse.statusText}`);
                return null;
            }

            const playerData = await playerResponse.json();
            console.log('✅ Dados FACEIT carregados:', playerData);
            
            // Busca stats específicas do CS2
            const cs2Stats = playerData.games?.cs2 || playerData.games?.csgo;
            
            if (cs2Stats) {
                return {
                    level: `Level ${cs2Stats.skill_level}`,
                    elo: `${cs2Stats.faceit_elo} ELO`,
                    region: playerData.country || 'Unknown'
                };
            } else {
                console.log('⚠️ Dados CS2/CSGO não encontrados no FACEIT');
                return {
                    level: 'Sem dados CS2',
                    elo: 'Sem dados CS2'
                };
            }

        } catch (error) {
            console.error('❌ Erro ao buscar dados do FACEIT:', error);
            return null;
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

    // Atualiza a exibição dos stats - SEM HORAS JOGADAS
    updateStatsDisplay(container, data) {
        const steamData = data.steam || {};
        const faceitData = data.faceit || {};
        const gcData = data.gc || {};
        
        // Formata dados do Steam - APENAS RANK
        let steamContent = '';
        if (steamData.premierRank && steamData.premierRank !== 'N/A' && steamData.premierRank !== 'Em breve') {
            steamContent = `<strong>${steamData.premierRank}</strong>`;
        } else {
            steamContent = 'Em breve';
        }

        // Formata dados do FACEIT
        let faceitContent = '';
        if (faceitData.level && faceitData.level !== 'Em breve') {
            faceitContent = faceitData.level;
            if (faceitData.elo && faceitData.elo !== 'Em breve' && !faceitData.elo.includes('Sem dados')) {
                faceitContent += `<div style="font-size: 0.8rem; opacity: 0.8;">${faceitData.elo}</div>`;
            }
        } else {
            faceitContent = 'Em breve';
        }

        // Mostra datas de atualização
        const getUpdateInfo = (platformData) => {
            if (!platformData?.lastUpdate) return '';
            
            const date = new Date(platformData.lastUpdate);
            const isAutomatic = platformData.updateType === 'automatic';
            const icon = isAutomatic ? '🔄' : '✏️';
            const type = isAutomatic ? 'Auto' : 'Manual';
            
            return `<div style="font-size: 0.65rem; opacity: 0.5; margin-top: 0.3rem;">
                ${icon} ${type}: ${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
            </div>`;
        };

        container.innerHTML = `
            <div class="rank-item steam">
                <span class="platform-name">
                    <i class="fab fa-steam"></i> CS2 Premier
                </span>
                <div class="rank-value">
                    ${steamContent}
                    ${getUpdateInfo(steamData)}
                </div>
            </div>
            <div class="rank-item faceit">
                <span class="platform-name">
                    <i class="fas fa-trophy"></i> FACEIT
                </span>
                <div class="rank-value">
                    ${faceitContent}
                    ${getUpdateInfo(faceitData)}
                </div>
            </div>
            <div class="rank-item gc">
                <span class="platform-name">
                    <i class="fas fa-gamepad"></i> GamersClub
                </span>
                <div class="rank-value">
                    ${gcData.rank || 'Em breve'}
                    ${getUpdateInfo(gcData)}
                </div>
            </div>
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
        console.log('🎮 Sistema de stats inicializado - FACEIT API por nickname!');
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