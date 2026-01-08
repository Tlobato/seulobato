/* ===================================
   STEAM LINKS FUNCTIONALITY
   Funcionalidades para links da Steam
   =================================== */

// Configuração dos links Steam
const STEAM_CONFIG = {
    profileId: '76561199403242930',
    profileUrl: 'https://steamcommunity.com/profiles/76561199403242930/'
};

// Função para detectar se o usuário está no desktop
function isDesktop() {
    return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

// Função para inicializar os links Steam
function initializeSteamLinks() {
    // Encontra todos os links Steam
    const steamLinks = document.querySelectorAll('.steam-link');
    
    steamLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Sempre vai para o perfil - usuário decide se quer adicionar
            window.open(STEAM_CONFIG.profileUrl, '_blank');
            
            // Mostra notificação de feedback
            showSteamNotification();
        });
        
        // Adiciona tooltip explicativo
        if (!link.hasAttribute('data-tooltip')) {
            const tooltipText = 'Clique para ver o perfil na Steam';
            link.setAttribute('data-tooltip', tooltipText);
            link.classList.add('steam-link-tooltip');
        }
    });
}

// Função para criar notificação de sucesso
function showSteamNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #66c0f4, #1b2838);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(102, 192, 244, 0.3);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideInRight 0.5s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fab fa-steam" style="font-size: 18px;"></i>
                <div>
                    <strong>Abrindo perfil Steam!</strong><br>
                    <small>Redirecionando para o perfil do Lobato...</small>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove a notificação após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

// Adiciona animações CSS para as notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', initializeSteamLinks);