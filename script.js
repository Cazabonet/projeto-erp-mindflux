// ========================================
// SCRIPT PRINCIPAL - ESTOCA.AI
// ========================================

class EstocaAI {
    constructor() {
        this.currentTheme = 'light';
        this.isSidebarCollapsed = false;
        this.notifications = [];
        this.currentSection = 'dashboard';
        
        this.initialize();
    }

    initialize() {
        this.setupTheme();
        this.setupEventListeners();
        this.updateDateTime();
        this.setupNotifications();
        this.initializeChat();
        this.setupUserMenu();
        this.loadUserData();
        
        // Atualizar data/hora a cada segundo
        setInterval(() => this.updateDateTime(), 1000);
        
        console.log('🚀 Estoca.AI inicializado com sucesso!');
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const themeIcon = document.getElementById('themeIcon');
        const themeText = document.querySelector('.theme-text');
        
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        if (themeText) {
            themeText.textContent = theme === 'dark' ? 'Claro' : 'Escuro';
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        this.showNotification(`Tema alterado para ${newTheme === 'dark' ? 'escuro' : 'claro'}`, 'info');
    }

    setupEventListeners() {
        // Menu mobile
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        // Navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(e.target.closest('.nav-item'));
            });
        });

        // Busca
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Notificações
        const notificationBtn = document.getElementById('notificationBtn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => {
                this.toggleNotifications();
            });
        }

        // Botões de ação rápida
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.target);
            });
        });

        // Menu do usuário
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', () => {
                this.toggleUserMenu();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Fechar menu do usuário ao clicar fora
        document.addEventListener('click', (e) => {
            const userMenu = document.getElementById('userMenu');
            const userMenuBtn = document.getElementById('userMenuBtn');
            
            if (userMenu && userMenuBtn && !userMenu.contains(e.target) && !userMenuBtn.contains(e.target)) {
                this.closeUserMenu();
            }
        });

        // Controles de gráficos
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChartPeriod(e.target);
            });
        });

        // Ações de gráficos
        document.querySelectorAll('.chart-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleChartAction(e.target);
            });
        });
    }

    handleNavigation(navItem) {
        if (!navItem || navItem.classList.contains('construction')) return;

        // Remover classe active de todos os itens
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Adicionar classe active ao item clicado
        navItem.classList.add('active');

        // Atualizar título e descrição da página
        const section = navItem.dataset.section;
        this.updatePageInfo(section);
        this.currentSection = section;

        // Mostrar notificação
        const sectionName = navItem.querySelector('span').textContent;
        this.showNotification(`Navegando para ${sectionName}`, 'info');
    }

    updatePageInfo(section) {
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');

        const pageInfo = {
            dashboard: {
                title: 'Dashboard de Vendas',
                description: 'Monitoramento em tempo real das vendas e estoque'
            },
            sales: {
                title: 'Gestão de Vendas',
                description: 'Controle completo de vendas e pedidos'
            },
            inventory: {
                title: 'Controle de Estoque',
                description: 'Gestão inteligente do inventário'
            },
            customers: {
                title: 'Gestão de Clientes',
                description: 'Cadastro e relacionamento com clientes'
            },
            reports: {
                title: 'Relatórios',
                description: 'Análises e relatórios detalhados'
            },
            analytics: {
                title: 'Análise de Dados',
                description: 'Insights e métricas avançadas'
            },
            settings: {
                title: 'Configurações',
                description: 'Personalize seu sistema'
            },
            profile: {
                title: 'Perfil do Usuário',
                description: 'Gerencie suas informações'
            }
        };

        const info = pageInfo[section] || pageInfo.dashboard;
        
        if (pageTitle) pageTitle.textContent = info.title;
        if (pageDescription) pageDescription.textContent = info.description;
    }

    handleSearch(query) {
        if (query.length < 2) return;

        // Simular busca
        const results = this.performSearch(query);
        this.showSearchResults(results);
    }

    performSearch(query) {
        // Simular resultados de busca
        const searchData = [
            { type: 'product', name: 'Smartphone XYZ', category: 'Eletrônicos' },
            { type: 'customer', name: 'João Silva', category: 'Clientes' },
            { type: 'order', name: 'Pedido #12345', category: 'Vendas' },
            { type: 'report', name: 'Relatório de Vendas', category: 'Relatórios' }
        ];

        return searchData.filter(item => 
            item.name.toLowerCase().includes(query.toLowerCase()) ||
            item.category.toLowerCase().includes(query.toLowerCase())
        );
    }

    showSearchResults(results) {
        // Implementar exibição de resultados de busca
        console.log('Resultados da busca:', results);
    }

    handleQuickAction(button) {
        const action = button.textContent.trim();
        this.showNotification(`Ação executada: ${action}`, 'success');
    }

    handleChartPeriod(button) {
        // Remover classe active de todos os botões
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Adicionar classe active ao botão clicado
        button.classList.add('active');

        // Atualizar gráficos (será feito pelo ChartsAndReports)
        const period = button.dataset.period;
        if (window.chartsAndReports) {
            window.chartsAndReports.updateChartsByPeriod(period);
        }
    }

    handleChartAction(button) {
        const action = button.title.toLowerCase();
        
        if (action.includes('atualizar')) {
            if (window.chartsAndReports) {
                window.chartsAndReports.updateCharts();
            }
            this.showNotification('Dados atualizados com sucesso!', 'success');
        } else if (action.includes('exportar')) {
            if (window.chartsAndReports) {
                window.chartsAndReports.exportChart();
            }
        }
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (this.isSidebarCollapsed) {
            sidebar.style.transform = 'translateX(0)';
            mainContent.style.marginLeft = '280px';
            this.isSidebarCollapsed = false;
        } else {
            sidebar.style.transform = 'translateX(-100%)';
            mainContent.style.marginLeft = '0';
            this.isSidebarCollapsed = true;
        }
    }

    updateDateTime() {
        const now = new Date();
        const dateTimeElement = document.getElementById('currentDateTime');
        
        if (dateTimeElement) {
            const formattedDateTime = now.toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            dateTimeElement.textContent = formattedDateTime;
        }
    }

    setupNotifications() {
        // Simular notificações iniciais
        this.addNotification('Sistema iniciado com sucesso', 'success');
        this.addNotification('3 produtos com estoque baixo', 'warning');
        this.addNotification('Nova atualização disponível', 'info');
        
        this.updateNotificationCount();
    }

    addNotification(message, type = 'info') {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date(),
            read: false
        };
        
        this.notifications.unshift(notification);
        this.updateNotificationCount();
    }

    updateNotificationCount() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const countElement = document.getElementById('notificationCount');
        
        if (countElement) {
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    toggleNotifications() {
        // Implementar painel de notificações
        this.showNotification('Painel de notificações em desenvolvimento', 'info');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; color: inherit; cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        const container = document.getElementById('notificationsContainer');
        if (container) {
            container.appendChild(notification);
            
            // Mostrar notificação
            setTimeout(() => {
                notification.classList.add('show');
            }, 100);

            // Remover notificação após 5 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (container.contains(notification)) {
                        container.removeChild(notification);
                    }
                }, 300);
            }, 5000);
        }
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    initializeChat() {
        // O chat será inicializado pelo EstocaAIChat
        setTimeout(() => {
            if (window.estocaAIChat) {
                console.log('Chat IA inicializado');
            }
        }, 1000);
    }

    // Métodos para funcionalidades avançadas
    exportData(type) {
        const data = this.generateExportData(type);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `estoca-ai-${type}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification(`Dados exportados: ${type}`, 'success');
    }

    generateExportData(type) {
        const baseData = {
            exportDate: new Date().toISOString(),
            systemVersion: '2.0.0',
            user: 'Administrador'
        };

        switch (type) {
            case 'sales':
                return {
                    ...baseData,
                    type: 'sales',
                    data: this.generateSalesData()
                };
            case 'inventory':
                return {
                    ...baseData,
                    type: 'inventory',
                    data: this.generateInventoryData()
                };
            case 'customers':
                return {
                    ...baseData,
                    type: 'customers',
                    data: this.generateCustomersData()
                };
            default:
                return baseData;
        }
    }

    generateSalesData() {
        return {
            totalSales: 45230.50,
            productsSold: 1247,
            averageTicket: 36.27,
            period: 'today',
            transactions: [
                { id: 1, product: 'Smartphone XYZ', quantity: 2, value: 1800.00 },
                { id: 2, product: 'Fone Bluetooth', quantity: 5, value: 450.00 }
            ]
        };
    }

    generateInventoryData() {
        return {
            totalProducts: 2847,
            inStock: 2500,
            lowStock: 23,
            outOfStock: 5,
            totalValue: 1247890.50
        };
    }

    generateCustomersData() {
        return {
            totalCustomers: 1250,
            activeCustomers: 890,
            newCustomers: 45,
            averageOrderValue: 156.78
        };
    }

    // Métodos para análise de dados
    generateInsights() {
        const insights = [
            {
                type: 'sales',
                title: 'Crescimento de Vendas',
                description: 'Vendas aumentaram 12.4% em relação ao período anterior',
                value: '+12.4%',
                trend: 'up'
            },
            {
                type: 'inventory',
                title: 'Estoque Otimizado',
                description: '89% dos produtos em nível adequado',
                value: '89%',
                trend: 'stable'
            },
            {
                type: 'customers',
                title: 'Novos Clientes',
                description: '45 novos clientes este mês',
                value: '+45',
                trend: 'up'
            }
        ];

        return insights;
    }

    // Métodos para configurações
    saveSettings(settings) {
        localStorage.setItem('estocaAISettings', JSON.stringify(settings));
        this.showNotification('Configurações salvas com sucesso', 'success');
    }

    loadSettings() {
        const saved = localStorage.getItem('estocaAISettings');
        return saved ? JSON.parse(saved) : this.getDefaultSettings();
    }

    getDefaultSettings() {
        return {
            theme: 'light',
            autoRefresh: true,
            notifications: true,
            language: 'pt-BR',
            currency: 'BRL',
            timezone: 'America/Sao_Paulo'
        };
    }

    // Métodos para backup e restauração
    createBackup() {
        const backup = {
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            data: {
                settings: this.loadSettings(),
                theme: this.currentTheme,
                notifications: this.notifications
            }
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `estoca-ai-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        this.showNotification('Backup criado com sucesso', 'success');
    }

    restoreBackup(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const backup = JSON.parse(e.target.result);
                this.applyBackup(backup);
                this.showNotification('Backup restaurado com sucesso', 'success');
            } catch (error) {
                this.showNotification('Erro ao restaurar backup', 'error');
            }
        };
        reader.readAsText(file);
    }

    applyBackup(backup) {
        if (backup.data.settings) {
            this.saveSettings(backup.data.settings);
        }
        if (backup.data.theme) {
            this.setTheme(backup.data.theme);
        }
        if (backup.data.notifications) {
            this.notifications = backup.data.notifications;
            this.updateNotificationCount();
        }
    }

    // ========================================
    // GERENCIAMENTO DO USUÁRIO
    // ========================================

    setupUserMenu() {
        // Menu já configurado no setupEventListeners
    }

    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            const isVisible = userMenu.style.display !== 'none';
            if (isVisible) {
                this.closeUserMenu();
            } else {
                this.openUserMenu();
            }
        }
    }

    openUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.style.display = 'block';
            userMenu.style.animation = 'slideUp 0.3s ease-out';
        }
    }

    closeUserMenu() {
        const userMenu = document.getElementById('userMenu');
        if (userMenu) {
            userMenu.style.display = 'none';
        }
    }

    loadUserData() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                this.updateUserInterface(user);
            }
        } catch (error) {
            console.error('Erro ao carregar dados do usuário:', error);
        }
    }

    updateUserInterface(user) {
        // Atualizar informações do usuário no sidebar
        const userName = document.getElementById('userName');
        const userRole = document.getElementById('userRole');
        const userMenuName = document.getElementById('userMenuName');
        const userMenuEmail = document.getElementById('userMenuEmail');

        if (userName) userName.textContent = user.name || 'Usuário';
        if (userRole) userRole.textContent = user.role || 'Usuário';
        if (userMenuName) userMenuName.textContent = user.name || 'Usuário';
        if (userMenuEmail) userMenuEmail.textContent = user.email || 'usuario@estoca.ai';
    }

    handleLogout() {
        // Confirmar logout
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            this.performLogout();
        }
    }

    performLogout() {
        try {
            // Limpar dados do usuário
            localStorage.removeItem('userData');
            localStorage.removeItem('rememberedUser');
            
            // Mostrar notificação
            this.showNotification('Logout realizado com sucesso!', 'success');
            
            // Redirecionar para login após 1 segundo
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            this.showNotification('Erro ao fazer logout', 'error');
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.estocaAI = new EstocaAI();
});

// Funções globais para uso no HTML
window.toggleTheme = function() {
    if (window.estocaAI) {
        window.estocaAI.toggleTheme();
    }
};

window.showNotification = function(message, type) {
    if (window.estocaAI) {
        window.estocaAI.showNotification(message, type);
    }
};

window.exportData = function(type) {
    if (window.estocaAI) {
        window.estocaAI.exportData(type);
    }
};

window.createBackup = function() {
    if (window.estocaAI) {
        window.estocaAI.createBackup();
    }
};

// Funções para o chat IA
window.perguntaRapida = function(pergunta) {
    if (window.estocaAIChat) {
        const input = document.getElementById('chatInput');
        if (input) {
            input.value = pergunta;
            window.estocaAIChat.sendMessage();
        }
    }
};

// Estado do chat
let chatState = {
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    position: { x: 0, y: 0 },
    isTyping: false,
    lastMessageId: 0,
    messages: []
};

// Mapa de respostas rápidas
const quickResponses = {
    'Como posso ver minhas vendas de hoje?': 'Você pode ver suas vendas de hoje acessando o módulo de Relatórios > Vendas Diárias. Lá você encontrará um resumo completo das vendas do dia atual.',
    'Qual o status do meu estoque?': 'Para verificar o status do seu estoque, vá até o módulo de Estoque > Visão Geral. Lá você poderá ver os itens com baixo estoque, itens em falta e o valor total do seu inventário.',
    'Mostrar relatório de clientes': 'Você pode gerar um relatório completo de clientes acessando Relatórios > Clientes. Lá você pode filtrar por data, status e outros critérios para obter as informações que precisa.'
};

// Elementos do chat
let chatWindow, chatTitleBar, abrirChatBtn;

// Inicializar elementos do chat
function initChatElements() {
    chatWindow = document.getElementById('chatWindow');
    chatTitleBar = document.getElementById('chatTitleBar');
    abrirChatBtn = document.getElementById('abrirChatBtn');
    
    // Carregar estado salvo
    const savedState = localStorage.getItem('chatState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            chatState = { ...chatState, ...parsedState };
        } catch (e) {
            console.error('Erro ao carregar estado do chat:', e);
        }
    }
    
    // Aplicar estado inicial
    applyChatState();
}

// Aplicar estado do chat
function applyChatState() {
    if (!chatWindow) return;
    
    if (chatState.isOpen) {
        chatWindow.classList.remove('hidden');
        if (abrirChatBtn) abrirChatBtn.style.display = 'none';
        
        if (chatState.isMinimized) {
            chatWindow.classList.add('minimized');
        } else {
            chatWindow.classList.remove('minimized');
        }
        
        if (chatState.isMaximized) {
            chatWindow.classList.add('maximized');
        } else {
            chatWindow.classList.remove('maximized');
        }
        
        // Aplicar posição
        if (chatState.position && chatState.position.x && chatState.position.y) {
            chatWindow.style.left = `${chatState.position.x}px`;
            chatWindow.style.top = `${chatState.position.y}px`;
            chatWindow.style.transform = 'none';
        }
    } else {
        chatWindow.classList.add('hidden');
        if (abrirChatBtn) abrirChatBtn.style.display = 'flex';
    }
    
    // Salvar estado
    saveChatState();
}

// Salvar estado do chat
function saveChatState() {
    localStorage.setItem('chatState', JSON.stringify(chatState));
}

// Abrir o chat
window.abrirChat = function() {
    chatState.isOpen = true;
    chatState.isMinimized = false;
    applyChatState();
    
    // Focar no input de mensagem
    const userInput = document.getElementById('userInput');
    if (userInput) {
        setTimeout(() => userInput.focus(), 100);
    }
};

// Fechar o chat
window.fecharChat = function() {
    chatState.isOpen = false;
    applyChatState();
};

// Minimizar/restaurar chat
window.minimizarChat = function() {
    chatState.isMinimized = !chatState.isMinimized;
    if (chatState.isMinimized) {
        chatState.isMaximized = false; // Não pode estar maximizado e minimizado
    }
    applyChatState();
};

// Maximizar/restaurar chat
window.maximizarChat = function() {
    chatState.isMaximized = !chatState.isMaximized;
    if (chatState.isMaximized) {
        chatState.isMinimized = false; // Não pode estar minimizado e maximizado
    }
    applyChatState();
};

// Variáveis para o drag do chat
let isDragging = false;
let startX, startY, startLeft, startTop;

// Iniciar arrasto
window.startDragSimple = function(e) {
    if (!chatWindow || chatState.isMaximized) return;
    
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    
    const rect = chatWindow.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    
    // Adicionar classe durante o arrasto
    chatWindow.classList.add('dragging');
    
    // Adicionar listeners
    document.addEventListener('mousemove', dragSimple);
    document.addEventListener('mouseup', stopDragSimple);
    
    e.preventDefault();
    e.stopPropagation();
};

// Função de arrasto
function dragSimple(e) {
    if (!isDragging || !chatWindow) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    let newLeft = startLeft + deltaX;
    let newTop = startTop + deltaY;
    
    // Limitar dentro da tela
    const maxLeft = window.innerWidth - chatWindow.offsetWidth;
    const maxTop = window.innerHeight - chatWindow.offsetHeight;
    
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));
    
    // Aplicar nova posição
    chatWindow.style.left = `${newLeft}px`;
    chatWindow.style.top = `${newTop}px`;
    chatWindow.style.transform = 'none';
    
    // Atualizar estado
    chatState.position = { x: newLeft, y: newTop };
    chatState.isMaximized = false; // Sai do modo maximizado ao arrastar
    
    e.preventDefault();
    e.stopPropagation();
}

// Parar arrasto
function stopDragSimple() {
    if (!isDragging) return;
    
    isDragging = false;
    chatWindow.classList.remove('dragging');
    
    // Salvar posição
    saveChatState();
    
    // Remover listeners
    document.removeEventListener('mousemove', dragSimple);
    document.removeEventListener('mouseup', stopDragSimple);
}

// Inicializar chat quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    initChatElements();
    
    // Fechar chat ao clicar fora
    document.addEventListener('click', (e) => {
        if (chatState.isOpen && !chatWindow.contains(e.target) && e.target !== abrirChatBtn) {
            chatState.isMinimized = true;
            applyChatState();
        }
    });
    
    // Fechar menu de usuário ao clicar fora
    document.addEventListener('click', (e) => {
        const userMenu = document.querySelector('.user-menu');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (userMenu && userAvatar && !userMenu.contains(e.target) && !userAvatar.contains(e.target)) {
            userMenu.classList.remove('show');
        }
    });
});

// Função para enviar mensagem no chat
window.enviarMensagem = function() {
    const userInput = document.getElementById('userInput');
    if (!userInput || !userInput.value.trim()) return;
    
    const message = userInput.value.trim();
    
    // Adicionar mensagem do usuário
    addMessageToChat(message, 'user');
    
    // Limpar input e ajustar altura
    userInput.value = '';
    adjustTextareaHeight(userInput);
    
    // Mostrar indicador de digitação
    showTypingIndicator();
    
    // Simular tempo de resposta da IA (entre 0.5s e 1.5s)
    const typingTime = 500 + Math.random() * 1000;
    
    setTimeout(() => {
        // Esconder indicador de digitação
        hideTypingIndicator();
        
        // Gerar e exibir resposta
        const response = generateAIResponse(message);
        addMessageToChat(response, 'ai');
        
        // Rolar para o final após a resposta
        setTimeout(scrollToBottom, 100);
        
    }, typingTime);
};

// Função para lidar com perguntas rápidas (ações rápidas)
function perguntaRapida(pergunta) {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = pergunta;
        enviarMensagem();
    }
}

// Função para ajustar a altura do textarea conforme o conteúdo
function adjustTextareaHeight(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
}

// Função para enviar mensagem ao pressionar Enter (sem Shift)
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        enviarMensagem();
    }
}

// Função para rolar suavemente para o final das mensagens
function smoothScrollToBottom(element) {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
    });
}

// Inicializar o chat quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Configurar o evento de tecla no input de mensagem
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.addEventListener('keydown', handleKeyDown);
        userInput.addEventListener('input', function() {
            adjustTextareaHeight(this);
        });
    }
    
    // Configurar data/hora da mensagem de boas-vindas
    const welcomeTime = document.getElementById('welcomeTime');
    if (welcomeTime) {
        welcomeTime.textContent = formatMessageTime();
    }
});

// Função para gerar um ID único para mensagens
function generateMessageId() {
    return 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

// Função para formatar a data/hora da mensagem
function formatMessageTime(date = new Date()) {
    return new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(date);
}

// Função para mostrar o indicador de digitação
function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'flex';
        chatState.isTyping = true;
        scrollToBottom();
    }
}

// Função para esconder o indicador de digitação
function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.style.display = 'none';
        chatState.isTyping = false;
    }
}

// Função para rolar para a última mensagem
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Função para adicionar mensagem ao chat
function addMessageToChat(message, sender, messageId = null) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return null;
    
    const messageIdToUse = messageId || generateMessageId();
    const messageTime = formatMessageTime();
    
    // Criar elementos da mensagem
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.id = messageIdToUse;
    
    // Adicionar avatar do remetente
    if (sender === 'ai') {
        const senderElement = document.createElement('div');
        senderElement.className = 'message-sender';
        senderElement.innerHTML = '<i class="fas fa-robot"></i>';
        messageElement.appendChild(senderElement);
    } else {
        const senderElement = document.createElement('div');
        senderElement.className = 'message-sender';
        senderElement.innerHTML = '<i class="fas fa-user"></i>';
        messageElement.appendChild(senderElement);
    }
    
    // Container do conteúdo da mensagem
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'message-content-wrapper';
    
    // Conteúdo da mensagem
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = message;
    
    // Rodapé da mensagem (hora e status)
    const messageFooter = document.createElement('div');
    messageFooter.className = 'message-time';
    
    const timeElement = document.createElement('span');
    timeElement.innerHTML = `<i class="far fa-clock"></i> ${messageTime}`;
    
    messageFooter.appendChild(timeElement);
    
    // Adicionar status apenas para mensagens do usuário
    if (sender === 'user') {
        const statusElement = document.createElement('span');
        statusElement.className = 'message-status delivered';
        statusElement.innerHTML = '<i class="fas fa-check-double"></i>';
        messageFooter.appendChild(statusElement);
    }
    
    // Montar a estrutura
    contentWrapper.appendChild(messageContent);
    contentWrapper.appendChild(messageFooter);
    messageElement.appendChild(contentWrapper);
    
    // Adicionar ao container de mensagens
    messagesContainer.appendChild(messageElement);
    
    // Rolar para a mensagem
    scrollToBottom();
    
    // Adicionar ao histórico de mensagens
    chatState.messages.push({
        id: messageIdToUse,
        content: message,
        sender: sender,
        timestamp: new Date().toISOString(),
        status: sender === 'user' ? 'delivered' : 'sent'
    });
    
    return messageIdToUse;
}

// Gerar resposta da IA (melhorada com respostas contextuais)
function generateAIResponse(message) {
    // Verificar se há uma resposta rápida pré-definida
    const quickResponse = quickResponses[message];
    if (quickResponse) {
        return quickResponse;
    }
    
    // Converter mensagem para minúsculas para comparação
    const lowerMessage = message.toLowerCase();
    
    // Respostas baseadas em palavras-chave
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('ola')) {
        return "Olá! Sou o assistente do Estoca.AI. Como posso te ajudar hoje com seu negócio?";
    } else if (lowerMessage.includes('obrigado') || lowerMessage.includes('obrigada')) {
        return "De nada! Fico feliz em ajudar. Se precisar de mais alguma coisa, é só chamar!";
    } else if (lowerMessage.includes('ajuda') || lowerMessage.includes('como usar')) {
        return "Posso te ajudar com:\n• Relatórios de vendas\n• Controle de estoque\n• Gestão de clientes\n• Análises financeiras\n\nSobre qual desses assuntos você gostaria de saber mais?";
    } else if (lowerMessage.includes('venda') || lowerMessage.includes('vendas')) {
        return "Para acessar informações sobre vendas, vá até o menu 'Vendas' no painel principal. Lá você encontrará relatórios, histórico e ferramentas para gerenciar suas vendas.";
    } else if (lowerMessage.includes('estoque') || lowerMessage.includes('produto')) {
        return "No módulo de Estoque você pode:\n• Verificar níveis de estoque\n• Cadastrar novos produtos\n• Ajustar inventário\n• Gerar relatórios\n\nGostaria de acessar alguma dessas funções?";
    } else if (lowerMessage.includes('cliente') || lowerMessage.includes('clientes')) {
        return "No cadastro de clientes você pode:\n• Adicionar novos clientes\n• Visualizar histórico de compras\n• Enviar promoções\n• Gerenciar fidelidade\n\nPosso te ajudar com alguma dessas opções?";
    } else if (lowerMessage.includes('relatório') || lowerMessage.includes('relatorio')) {
        return "Temos vários tipos de relatórios disponíveis:\n• Vendas por período\n• Produtos mais vendidos\n• Desempenho de vendedores\n• Fluxo de caixa\n\nSobre qual você gostaria de gerar um relatório?";
    }
    
    // Se não reconhecer o contexto, usar uma resposta genérica
    const genericResponses = [
        "Entendi sua solicitação. Vou verificar essas informações para você.",
        "Ótima pergunta! Deixe-me buscar os dados mais recentes sobre isso.",
        "Posso ajudar com isso. Um momento enquanto verifico as informações.",
        "Vou analisar e já te retorno com os detalhes.",
        "Vou verificar como posso te ajudar com isso."
    ];
    
    return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}

// Formatar hora
function formatTime(date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

// Função para perguntas rápidas
window.perguntaRapida = function(pergunta) {
    const userInput = document.getElementById('userInput');
    if (userInput) {
        userInput.value = pergunta;
        enviarMensagem();
    }
};

console.log('📦 Estoca.AI - Sistema de Gestão Inteligente carregado!');

/**
 * Função para lidar com ações rápidas nos botões do chat
 * @param {string} tipo - Tipo de ação (vendas, estoque, clientes, financeiro)
 * @param {string} pergunta - Pergunta a ser enviada ao chat
 */
function acaoRapida(tipo, pergunta) {
    // Enviar a pergunta ao chat
    if (window.perguntaRapida) {
        window.perguntaRapida(pergunta);
    }
    
    // Executar ações específicas com base no tipo
    switch(tipo) {
        case 'vendas':
            // Atualizar gráfico de vendas se a função existir
            if (typeof gerarGraficoVendas === 'function') {
                gerarGraficoVendas();
            }
            // Atualizar relatório de vendas se a função existir
            if (typeof gerarRelatorioVendas === 'function') {
                gerarRelatorioVendas();
            }
            break;
            
        case 'estoque':
            // Adicionar lógica para atualizar informações de estoque
            if (typeof atualizarEstoque === 'function') {
                atualizarEstoque();
            }
            break;
            
        case 'clientes':
            // Adicionar lógica para atualizar informações de clientes
            if (typeof atualizarClientes === 'function') {
                atualizarClientes();
            }
            break;
            
        case 'financeiro':
            // Adicionar lógica para atualizar informações financeiras
            if (typeof atualizarFinanceiro === 'function') {
                atualizarFinanceiro();
            }
            break;
    }
    
    // Rolar para o topo do dashboard para visualizar as atualizações
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Função para adicionar mensagem ao chat
function adicionarMensagem(texto, tipo) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}-message`;
    
    // Adiciona a mensagem ao DOM primeiro para que possamos animá-la
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-text">${formatarTexto(texto)}</div>
            <div class="message-time">${formatarHora()}</div>
        </div>
    `;
    
    // Remove a mensagem de boas-vindas se for a primeira mensagem
    const welcomeMessage = chatMessages.querySelector('.welcome-message');
    if (welcomeMessage && document.querySelectorAll('.message').length === 0) {
        welcomeMessage.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => welcomeMessage.remove(), 300);
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Rola para a nova mensagem com animação suave
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 50);
    
    return messageDiv;
}

// Função para formatar texto com links e quebras de linha
function formatarTexto(texto) {
    // Converte URLs em links clicáveis
    texto = texto.replace(
        /(https?:\/\/[^\s]+)/g, 
        '<a href="$1" target="_blank" class="message-link">$1</a>'
    );
    
    // Converte quebras de linha em <br>
    return texto.replace(/\n/g, '<br>');
}

// Função para formatar a hora atual
function formatarHora() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Função para enviar mensagem
function enviarMensagem() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    // Adiciona a mensagem do usuário
    adicionarMensagem(message, 'user');
    
    // Limpa o input e ajusta a altura
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Mostra o indicador de digitação
    mostrarIndicadorDigitacao();
    
    // Simula processamento e resposta do assistente
    setTimeout(() => {
        esconderIndicadorDigitacao();
        const resposta = gerarRespostaIA(message);
        adicionarMensagem(resposta, 'assistant');
    }, 1500);
}

// Função para mostrar indicador de digitação
function mostrarIndicadorDigitacao() {
    const chatMessages = document.getElementById('chatMessages');
    let typingIndicator = chatMessages.querySelector('.typing-indicator');
    
    if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatMessages.appendChild(typingIndicator);
    }
    
    // Rola para o indicador de digitação
    chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
    });
}

// Função para esconder indicador de digitação
function esconderIndicadorDigitacao() {
    const typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.style.opacity = '0';
        setTimeout(() => typingIndicator.remove(), 300);
    }
}

// Função para gerar resposta da IA
function gerarRespostaIA(mensagem) {
    // Converte a mensagem para minúsculas para facilitar a correspondência
    const msg = mensagem.toLowerCase();
    
    // Respostas baseadas em palavras-chave
    if (msg.includes('olá') || msg.includes('oi') || msg.includes('ola') || msg.includes('eae')) {
        return "Olá! Como posso te ajudar hoje no Estoca.AI? Estou aqui para auxiliar com gestão de estoque, vendas e mais!";
    } else if (msg.includes('ajuda') || msg.includes('comandos') || msg.includes('o que você faz')) {
        return "Posso te ajudar com:\n• Consultas de estoque\n• Relatórios de vendas\n• Análises financeiras\n• Gestão de clientes\n\nÉ só me perguntar o que você precisa!";
    } else if (msg.includes('estoque') || msg.includes('produtos')) {
        return "📦 Aqui está um resumo do seu estoque:\n• 1.245 itens em estoque\n• 32 itens com baixo estoque\n• 5 itens vencidos\n\nDeseja ver mais detalhes sobre algum produto específico?";
    } else if (msg.includes('vendas') || msg.includes('venda')) {
        return "💰 Relatório de Vendas (últimos 30 dias):\n• Total: R$ 124.567,89\n• Vendas totais: 342\n• Ticket médio: R$ 364,23\n\nQuer ver mais detalhes ou comparar com períodos anteriores?";
    } else if (msg.includes('cliente') || msg.includes('clientes')) {
        return "👥 Seus clientes:\n• Total: 1.845 clientes\n• Novos este mês: 124\n• Taxa de retenção: 87%\n\nPosso listar os principais clientes ou buscar por nome/CPF.";
    } else if (msg.includes('obrigado') || msg.includes('valeu') || msg.includes('agradeço')) {
        const agradecimentos = ["De nada! Estou aqui para ajudar.", "Por nada! Precisa de mais alguma coisa?", "Disponha! Estou à disposição para ajudar."];
        return agradecimentos[Math.floor(Math.random() * agradecimentos.length)];
    } else if (msg.includes('horas') || msg.includes('hora') || msg.includes('horário')) {
        return `Agora são ${new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}.`;
    } else if (msg.includes('data') || msg.includes('dia') || msg.includes('hoje')) {
        return `Hoje é ${new Date().toLocaleDateString('pt-BR', {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}.`;
    } else if (msg.includes('contato') || msg.includes('suporte') || msg.includes('ajuda')) {
        return "📞 Entre em contato com nosso suporte:\n• E-mail: suporte@estocaai.com\n• Telefone: (48) 1234-5678\n• Horário: Seg-Sex, 8h às 18h";
    } else if (msg.includes('erro') || msg.includes('problema') || msg.includes('não funciona')) {
        return "Lamento pelo inconveniente. Para ajudar a resolver seu problema, por favor, descreva o que estava tentando fazer quando o erro ocorreu. Assim que possível, nossa equipe de suporte irá te ajudar!";
    } else if (msg.includes('tutorial') || msg.includes('como usar') || msg.includes('como funciona')) {
        return "🔍 Aqui está um guia rápido para começar:\n1. Use o menu lateral para acessar as principais funcionalidades\n2. Faça buscas rápidas usando a barra de pesquisa\n3. Utilize os atalhos para ações frequentes\n4. Personalize seu painel com os widgets mais importantes para você\n\nPosso te mostrar um tour guiado pelo sistema. É só pedir!";
    } else if (msg.includes('configuração') || msg.includes('configurar') || msg.includes('preferências')) {
        return "⚙️ Configurações disponíveis:\n• Perfil do usuário\n• Preferências de notificação\n• Tema (claro/escuro)\n• Idioma\n• Integrações\n\nSobre qual configuração você gostaria de saber mais?";
    } else if (msg.includes('relatório') || msg.includes('relatorio') || msg.includes('relatórios')) {
        return "📊 Tipos de relatórios disponíveis:\n• Vendas por período\n• Produtos mais vendidos\n• Desempenho de vendedores\n• Fluxo de caixa\n• Contas a pagar/receber\n\nQual relatório você gostaria de visualizar?";
    } else if (msg.includes('sair') || msg.includes('encerrar') || msg.includes('até mais')) {
        return "Até mais! Se precisar de ajuda, é só chamar. Tenha um ótimo dia! 😊";
    } else {
        // Se não reconhecer a pergunta, tente fornecer uma resposta genérica
        const respostas = [
            "Desculpe, não entendi completamente. Poderia reformular sua pergunta?",
            "Interessante! No momento, posso ajudar com informações sobre estoque, vendas, clientes e relatórios. Sobre qual desses assuntos você gostaria de saber mais?",
            "Hmm, não tenho certeza se entendi. Você poderia tentar de outra forma?",
            "Ainda estou aprendendo! Por enquanto, consigo ajudar com informações sobre o sistema de gestão. Tente me fazer uma pergunta sobre estoque, vendas ou clientes.",
            "Vou verificar isso para você. Enquanto isso, posso te ajudar com relatórios, consultas de estoque ou análise de vendas?"
        ];
        return respostas[Math.floor(Math.random() * respostas.length)];
    }
}

// Função para ajustar a altura do textarea
function setupTextareaAutoResize() {
    document.querySelectorAll('.message-input').forEach(textarea => {
        const adjustHeight = function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
            
            // Atualiza a posição do botão de enviar
            const sendBtn = this.closest('.input-wrapper').querySelector('.send-btn');
            if (this.value.trim() !== '') {
                sendBtn.style.opacity = '1';
                sendBtn.style.transform = 'scale(1)';
                sendBtn.style.pointerEvents = 'auto';
            } else {
                sendBtn.style.opacity = '0.5';
                sendBtn.style.transform = 'scale(0.9)';
                sendBtn.style.pointerEvents = 'none';
            }
            
            // Rola para o final das mensagens quando o usuário digita
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                smoothScrollToBottom(chatMessages);
            }
        };
        
        // Remove event listeners antigos para evitar duplicação
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
        
        newTextarea.addEventListener('input', adjustHeight);
        newTextarea.addEventListener('focus', () => {
            newTextarea.parentElement.classList.add('focused');
        });
        
        newTextarea.addEventListener('blur', () => {
            newTextarea.parentElement.classList.remove('focused');
        });
        
        // Ajusta a altura inicial
        setTimeout(() => adjustHeight.call(newTextarea), 100);
        
        return newTextarea;
    });
}

// Configura o textarea quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setupTextareaAutoResize();
    
    // Foca no input quando o chat é aberto
    const userInput = document.getElementById('userInput');
    if (userInput) {
        setTimeout(() => userInput.focus(), 500);
    }
    
    // Adiciona atalho de teclado (Ctrl + /) para focar no chat
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            const input = document.getElementById('userInput');
            if (input) {
                input.focus();
            }
        }
    });
});

// Função para lidar com o pressionar de teclas no input
function handleKeyDown(event) {
    // Se for Enter sem Shift, envia a mensagem
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        enviarMensagem();
        return;
    }
    
    // Se for a tecla /, foca no input
    if (event.key === '/' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const input = document.getElementById('userInput');
        if (input) {
            input.focus();
        }
        return;
    }
    
    // Se for Escape, remove o foco do input
    if (event.key === 'Escape') {
        const input = document.getElementById('userInput');
        if (input && input === document.activeElement) {
            input.blur();
        }
        return;
    }
    
    // Se for Ctrl + K, foca no input e limpa
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const input = document.getElementById('userInput');
        if (input) {
            input.value = '';
            input.focus();
            // Dispara o evento de input para ajustar a altura
            input.dispatchEvent(new Event('input'));
        }
        return;
    }
}

// Função para rolar suavemente para o final das mensagens
function smoothScrollToBottom(element) {
    element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
    });
}

// Função para perguntas rápidas
function perguntaRapida(pergunta) {
    const userInput = document.getElementById('userInput');
    userInput.value = pergunta;
    
    // Dispara o evento de input para ajustar a altura
    const event = new Event('input', {
        bubbles: true,
        cancelable: true,
    });
    userInput.dispatchEvent(event);
    
    // Adiciona uma pequena animação ao clicar em uma pergunta rápida
    const quickAction = event.target.closest('.quick-action');
    if (quickAction) {
        quickAction.style.transform = 'scale(0.98)';
        setTimeout(() => {
            quickAction.style.transform = 'translateY(-3px)';
        }, 100);
    }
    
    // Envia a mensagem após uma pequena pausa para a animação
    setTimeout(() => {
        enviarMensagem();
    }, 200);
}