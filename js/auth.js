/* ===================================
   AUTHENTICATION SYSTEM
   Sistema de autenticação para admin com menu
   =================================== */

class AuthManager {
    constructor() {
        // Credenciais do admin (em produção, isso seria mais seguro)
        this.adminCredentials = {
            username: 'lobato',
            password: 'seulobato2025'
        };
        
        this.sessionKey = 'seulobato_admin_session';
        this.sessionDuration = 24 * 60 * 60 * 1000; // 24 horas
        
        this.initializeAuth();
    }

    // Inicializa o sistema de autenticação
    initializeAuth() {
        // Verifica se estamos na página admin
        if (window.location.pathname.includes('admin')) {
            this.checkAdminAccess();
        }
        
        // Configura o menu admin
        this.setupAdminMenu();
    }

    // Configura o menu admin
    setupAdminMenu() {
        // Aguarda o DOM carregar
        setTimeout(() => {
            const adminMenuLink = document.querySelector('.admin-menu-link');
            if (adminMenuLink) {
                adminMenuLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Se já está logado, vai direto para admin
                    if (this.isAuthenticated()) {
                        window.location.href = 'html/admin-full.html';
                    } else {
                        // Se não está logado, mostra modal
                        this.showLoginModal();
                    }
                });

                // Adiciona estilo especial para o link admin
                this.addAdminMenuStyles();
            }
        }, 100);
    }

    // Adiciona estilos para o menu admin
    addAdminMenuStyles() {
        if (!document.getElementById('admin-menu-styles')) {
            const adminStyles = document.createElement('style');
            adminStyles.id = 'admin-menu-styles';
            adminStyles.textContent = `
                .admin-menu-link {
                    color: var(--primary-color) !important;
                    font-weight: 600;
                    transition: var(--transition-fast);
                }
                .admin-menu-link:hover {
                    color: var(--accent-color) !important;
                    text-shadow: 0 0 10px var(--primary-color);
                    transform: translateY(-1px);
                }
                .admin-menu-link i {
                    margin-right: 0.5rem;
                }
            `;
            document.head.appendChild(adminStyles);
        }
    }

    // Verifica se o usuário tem acesso admin
    checkAdminAccess() {
        if (!this.isAuthenticated()) {
            this.showLoginModal();
        }
    }

    // Verifica se está autenticado
    isAuthenticated() {
        const session = localStorage.getItem(this.sessionKey);
        if (!session) return false;
        
        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();
            
            // Verifica se a sessão não expirou
            if (now > sessionData.expires) {
                localStorage.removeItem(this.sessionKey);
                return false;
            }
            
            return sessionData.authenticated === true;
        } catch (error) {
            localStorage.removeItem(this.sessionKey);
            return false;
        }
    }

    // Mostra modal de login
    showLoginModal() {
        // Remove modal existente se houver
        const existingModal = document.getElementById('loginModal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>🔐 Acesso Administrativo</h2>
                        <p>Digite suas credenciais para acessar o painel admin</p>
                    </div>
                    <form id="loginForm" class="login-form">
                        <div class="form-group">
                            <label for="username">Usuário:</label>
                            <input type="text" id="username" required autocomplete="username" placeholder="Digite o usuário">
                        </div>
                        <div class="form-group">
                            <label for="password">Senha:</label>
                            <input type="password" id="password" required autocomplete="current-password" placeholder="Digite a senha">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="login-btn">
                                <i class="fas fa-sign-in-alt"></i> Entrar
                            </button>
                            <button type="button" class="cancel-btn" id="cancelLogin">
                                <i class="fas fa-times"></i> Cancelar
                            </button>
                        </div>
                        <div id="loginError" class="error-message" style="display: none;"></div>
                    </form>
                </div>
            </div>
        `;

        // Adiciona estilos do modal
        const styles = document.createElement('style');
        styles.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal-content {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 15px;
                padding: 2rem;
                max-width: 400px;
                width: 90%;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                animation: slideUp 0.3s ease-out;
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .modal-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .modal-header h2 {
                color: var(--primary-color);
                font-family: var(--font-primary);
                margin-bottom: 0.5rem;
            }
            
            .modal-header p {
                color: var(--text-secondary);
                font-size: 0.9rem;
            }
            
            .login-form {
                display: flex;
                flex-direction: column;
                gap: 1.5rem;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .form-group label {
                color: var(--text-primary);
                font-weight: 600;
            }
            
            .form-group input {
                padding: 0.75rem;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--dark-bg);
                color: var(--text-primary);
                font-size: 1rem;
                transition: var(--transition-fast);
            }
            
            .form-group input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 2px rgba(212, 165, 116, 0.2);
            }
            
            .form-actions {
                display: flex;
                gap: 1rem;
            }
            
            .login-btn, .cancel-btn {
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }
            
            .login-btn {
                background: var(--primary-color);
                color: var(--dark-bg);
            }
            
            .login-btn:hover {
                background: var(--accent-color);
                transform: translateY(-2px);
            }
            
            .cancel-btn {
                background: transparent;
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }
            
            .cancel-btn:hover {
                background: var(--border-color);
                color: var(--text-primary);
            }
            
            .error-message {
                color: #ff6b6b;
                font-size: 0.9rem;
                text-align: center;
                padding: 0.5rem;
                background: rgba(255, 107, 107, 0.1);
                border: 1px solid rgba(255, 107, 107, 0.3);
                border-radius: 6px;
                animation: shake 0.5s ease-in-out;
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(modal);

        // Event listeners
        const form = document.getElementById('loginForm');
        const cancelBtn = document.getElementById('cancelLogin');

        form.addEventListener('submit', (e) => this.handleLogin(e));
        cancelBtn.addEventListener('click', () => this.hideLoginModal());

        // Clique fora do modal para fechar
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideLoginModal();
            }
        });

        // ESC para fechar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideLoginModal();
            }
        });

        // Foca no campo de usuário
        setTimeout(() => {
            document.getElementById('username').focus();
        }, 100);
    }

    // Manipula o login
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('loginError');
        
        // Verifica credenciais
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            // Login bem-sucedido
            this.createSession();
            this.hideLoginModal();
            this.showSuccessMessage();
            
            // Redireciona para admin após um delay
            setTimeout(() => {
                window.location.href = 'html/admin-full.html';
            }, 1000);
        } else {
            // Login falhou
            errorDiv.textContent = '❌ Usuário ou senha incorretos';
            errorDiv.style.display = 'block';
            
            // Limpa campos
            document.getElementById('password').value = '';
            document.getElementById('username').focus();
        }
    }

    // Cria sessão de autenticação
    createSession() {
        const sessionData = {
            authenticated: true,
            expires: Date.now() + this.sessionDuration,
            user: 'admin'
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    }

    // Esconde modal de login
    hideLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // Mostra mensagem de sucesso
    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'auth-notification success';
        notification.innerHTML = '✅ Login realizado com sucesso! Redirecionando...';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            font-weight: 600;
            z-index: 10001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Adiciona animação CSS
        const animationStyles = document.createElement('style');
        animationStyles.textContent = `
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
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(animationStyles);
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 2500);
    }

    // Faz logout
    logout() {
        localStorage.removeItem(this.sessionKey);
        window.location.href = '../index.html';
    }

    // Método público para verificar autenticação
    static isLoggedIn() {
        const auth = new AuthManager();
        return auth.isAuthenticated();
    }

    // Método público para fazer logout
    static logout() {
        const auth = new AuthManager();
        auth.logout();
    }
}

// Inicializa o sistema de autenticação
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando AuthManager com menu...');
    window.authManager = new AuthManager();
});

// Também tenta inicializar se o DOM já estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (!window.authManager) {
            window.authManager = new AuthManager();
        }
    });
} else {
    if (!window.authManager) {
        window.authManager = new AuthManager();
    }
}

// Exporta para uso global
window.AuthManager = AuthManager;