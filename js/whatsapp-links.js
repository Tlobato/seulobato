/* ===================================
   WHATSAPP LINKS FUNCTIONALITY
   Funcionalidades para links do WhatsApp
   =================================== */

// Configuração dos links WhatsApp
const WHATSAPP_CONFIG = {
    phoneNumber: '5515981229370', // Número no formato internacional (sem + e sem espaços)
    defaultMessage: 'Olá! Vi o site do SeuLobato e tenho interesse em fazer parte do time de Counter-Strike. Podemos conversar?',
    recruitingMessage: 'Olá Lobato! Vi as vagas abertas no time SeuLobato e gostaria de saber mais sobre a posição de {role}. Tenho interesse em participar dos treinos!'
};

// Função para detectar se o usuário está no mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Função para gerar URL do WhatsApp
function generateWhatsAppURL(message) {
    const encodedMessage = encodeURIComponent(message);
    
    if (isMobile()) {
        // Mobile: usa o protocolo whatsapp://
        return `whatsapp://send?phone=${WHATSAPP_CONFIG.phoneNumber}&text=${encodedMessage}`;
    } else {
        // Desktop: usa web.whatsapp.com
        return `https://web.whatsapp.com/send?phone=${WHATSAPP_CONFIG.phoneNumber}&text=${encodedMessage}`;
    }
}

// Função para abrir WhatsApp
function openWhatsApp(message, fallbackMessage) {
    const whatsappURL = generateWhatsAppURL(message);
    
    if (isMobile()) {
        // Mobile: tenta abrir o app do WhatsApp
        const whatsappLink = document.createElement('a');
        whatsappLink.href = whatsappURL;
        whatsappLink.style.display = 'none';
        document.body.appendChild(whatsappLink);
        whatsappLink.click();
        document.body.removeChild(whatsappLink);
        
        // Fallback para web.whatsapp.com após 2 segundos se o app não abrir
        setTimeout(() => {
            const userChoice = confirm(
                'O WhatsApp não abriu automaticamente.\n\n' +
                'Clique em "OK" para abrir no navegador ou "Cancelar" para tentar novamente.'
            );
            if (userChoice) {
                const webURL = `https://web.whatsapp.com/send?phone=${WHATSAPP_CONFIG.phoneNumber}&text=${encodeURIComponent(message)}`;
                window.open(webURL, '_blank');
            }
        }, 2000);
    } else {
        // Desktop: abre direto no web.whatsapp.com
        window.open(whatsappURL, '_blank');
    }
}

// Função para determinar a mensagem baseada no contexto
function getContextualMessage(linkElement) {
    // Verifica se está em um card de recrutamento
    const recruitingCard = linkElement.closest('.recruiting');
    if (recruitingCard) {
        // Tenta identificar a role pelo badge
        const roleBadge = recruitingCard.querySelector('.role-badge');
        const role = roleBadge ? roleBadge.textContent.trim() : 'uma das posições';
        return WHATSAPP_CONFIG.recruitingMessage.replace('{role}', role);
    }
    
    // Verifica se é um botão especial de WhatsApp
    if (linkElement.classList.contains('whatsapp-button')) {
        return WHATSAPP_CONFIG.defaultMessage;
    }
    
    // Mensagem padrão para outros contextos
    return WHATSAPP_CONFIG.defaultMessage;
}

// Função para inicializar os links WhatsApp
function initializeWhatsAppLinks() {
    // Encontra todos os links WhatsApp
    const whatsappLinks = document.querySelectorAll('.whatsapp-link, .whatsapp-button');
    
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Determina a mensagem baseada no contexto
            const message = getContextualMessage(this);
            
            // Mostra notificação
            showWhatsAppNotification();
            
            // Abre o WhatsApp
            openWhatsApp(message);
        });
        
        // Adiciona tooltip explicativo se não existir
        if (!link.hasAttribute('data-tooltip')) {
            const tooltipText = isMobile() ? 
                'Clique para abrir no WhatsApp' : 
                'Clique para abrir no WhatsApp Web';
            link.setAttribute('data-tooltip', tooltipText);
            link.classList.add('whatsapp-link-tooltip');
        }
    });
}

// Função para criar notificação de sucesso
function showWhatsAppNotification() {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideInRight 0.5s ease-out;
        ">
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fab fa-whatsapp" style="font-size: 18px;"></i>
                <div>
                    <strong>WhatsApp Ativado!</strong><br>
                    <small>Abrindo conversa com Lobato...</small>
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

// Função para adicionar botão WhatsApp flutuante (opcional)
function addFloatingWhatsAppButton() {
    const floatingButton = document.createElement('div');
    floatingButton.innerHTML = `
        <a href="#" class="whatsapp-floating-button" data-tooltip="Fale conosco no WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
    `;
    
    // Adiciona estilos para o botão flutuante
    const style = document.createElement('style');
    style.textContent = `
        .whatsapp-floating-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #25D366, #128C7E);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white !important;
            text-decoration: none;
            font-size: 24px;
            box-shadow: 0 4px 20px rgba(37, 211, 102, 0.3);
            z-index: 1000;
            transition: all 0.3s ease;
            animation: whatsappFloat 3s ease-in-out infinite;
        }
        
        .whatsapp-floating-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(37, 211, 102, 0.4);
            color: white !important;
        }
        
        @keyframes whatsappFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
        }
        
        @media (max-width: 768px) {
            .whatsapp-floating-button {
                bottom: 15px;
                right: 15px;
                width: 50px;
                height: 50px;
                font-size: 20px;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(floatingButton);
    
    // Adiciona funcionalidade ao botão flutuante
    const button = floatingButton.querySelector('.whatsapp-floating-button');
    button.addEventListener('click', function(e) {
        e.preventDefault();
        showWhatsAppNotification();
        openWhatsApp(WHATSAPP_CONFIG.defaultMessage);
    });
}

// Adiciona animações CSS para as notificações (se ainda não existirem)
function addNotificationStyles() {
    // Verifica se os estilos já existem
    if (!document.querySelector('#whatsapp-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'whatsapp-notification-styles';
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
    }
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    addNotificationStyles();
    initializeWhatsAppLinks();
    
    // Opcional: adicionar botão flutuante (descomente a linha abaixo se quiser)
    // addFloatingWhatsAppButton();
});