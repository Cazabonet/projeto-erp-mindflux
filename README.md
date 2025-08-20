# 🚀 Estoca.AI - Sistema de Gestão Inteligente

Um sistema ERP moderno e inteligente com chat IA integrado, gráficos interativos e relatórios avançados.

## ✨ Funcionalidades Principais

### 🤖 Chat IA Avançado
- **Assistente Inteligente**: Chat IA centralizado com respostas contextuais
- **Comandos Especiais**: Sistema de comandos `/help`, `/vendas`, `/estoque`, etc.
- **Histórico Persistente**: Conversas salvas no localStorage
- **Exportação**: Exportar conversas em formato texto
- **Atalhos de Teclado**: Ctrl+/ (focar), Ctrl+L (limpar), Ctrl+E (exportar), Ctrl+T (tema)
- **Sons de Notificação**: Feedback sonoro para respostas da IA
- **Tema Escuro/Claro**: Alternância de temas
- **Drag & Drop**: Janela do chat arrastável e redimensionável

### 📊 Gráficos Interativos
- **Gráfico de Vendas**: Linha temporal com dados por hora/dia/semana/mês
- **Gráfico de Estoque**: Doughnut chart com status do inventário
- **Gráfico de Produtos**: Barras com produtos mais vendidos
- **Gráfico de Receita**: Comparativo receita vs custos
- **Atualização em Tempo Real**: Dados atualizados automaticamente
- **Exportação**: Salvar gráficos como imagens
- **Responsivo**: Adaptação para diferentes tamanhos de tela

### 📈 Relatórios Detalhados
- **Relatório de Vendas**: Análise completa com métricas e insights
- **Relatório de Estoque**: Status detalhado com alertas
- **Relatório de Produtos**: Top produtos e tendências
- **Relatório Financeiro**: Receita, custos e margens
- **Exportação**: Relatórios em formato texto
- **Análise IA**: Insights automáticos e recomendações

### 🎨 Interface Moderna
- **Design System**: Variáveis CSS para consistência
- **Tema Escuro/Claro**: Alternância automática
- **Animações Suaves**: Transições e efeitos visuais
- **Responsivo**: Mobile-first design
- **Acessibilidade**: Suporte a navegação por teclado
- **Performance**: Otimizações de renderização

### 🔧 Funcionalidades Técnicas
- **Modular**: Arquitetura baseada em classes ES6
- **Persistência**: Dados salvos no localStorage
- **Notificações**: Sistema de alertas em tempo real
- **Busca**: Funcionalidade de busca integrada
- **Navegação**: Sistema de rotas para diferentes seções
- **Configurações**: Personalização do sistema

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com variáveis CSS
- **JavaScript ES6+**: Classes, módulos e funcionalidades avançadas
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones
- **Google Fonts**: Tipografia Inter

## 📁 Estrutura do Projeto

```
projeto erp mindflux/
├── index.html              # Página principal
├── styles.css              # Estilos principais
├── script.js               # Script principal
├── js/
│   ├── advanced-chat.js    # Chat IA avançado
│   └── charts-reports.js   # Gráficos e relatórios
├── css/
│   └── charts-styles.css   # Estilos dos gráficos
├── README.md               # Documentação
└── ce871213-1168-48f7-b65f-4681ac5f7386.jpg  # Logo
```

## 🚀 Como Usar

### 1. Chat IA
- **Abrir**: Clique no botão flutuante 🤖 ou use o chat centralizado
- **Comandos**: Digite `/help` para ver todos os comandos disponíveis
- **Perguntas**: Faça perguntas sobre vendas, estoque, relatórios
- **Atalhos**: Use Ctrl+/ para focar no input

### 2. Gráficos
- **Períodos**: Clique nos botões "Hoje", "Semana", "Mês"
- **Ações**: Use os botões de atualizar e exportar
- **Interação**: Passe o mouse sobre os gráficos para detalhes

### 3. Relatórios
- **Gerar**: Use comandos `/vendas`, `/estoque`, `/produtos`
- **Exportar**: Comando `/export` ou botões de ação
- **Análise**: Insights automáticos da IA

### 4. Configurações
- **Tema**: Clique no botão de tema na sidebar
- **Notificações**: Sistema automático de alertas
- **Personalização**: Configurações salvas automaticamente

## 🎯 Comandos do Chat IA

### Básicos
- `/help` - Mostra ajuda completa
- `/clear` - Limpa histórico
- `/export` - Exporta conversa
- `/status` - Status do sistema
- `/time` - Horário atual

### Relatórios
- `/vendas` - Relatório de vendas detalhado
- `/estoque` - Status do estoque
- `/produtos` - Top produtos
- `/dashboard` - Resumo geral

### Personalização
- `/theme` - Alternar tema
- `/sound` - Alternar sons
- `/reset` - Resetar configurações

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:
- **Desktop**: Interface completa com sidebar
- **Tablet**: Layout adaptado
- **Mobile**: Menu mobile e interface otimizada

## 🔧 Personalização

### Variáveis CSS
```css
:root {
    --primary-color: #3b82f6;
    --background-color: #f8fafc;
    --text-primary: #1e293b;
    /* ... mais variáveis */
}
```

### Configurações
```javascript
// Salvar configurações
estocaAI.saveSettings({
    theme: 'dark',
    autoRefresh: true,
    notifications: true
});
```

## 🚀 Próximas Funcionalidades

- [ ] **Integração com APIs**: Conectar com sistemas externos
- [ ] **Dashboard Personalizável**: Widgets arrastáveis
- [ ] **Relatórios Avançados**: Mais tipos de análise
- [ ] **Notificações Push**: Alertas em tempo real
- [ ] **Backup Automático**: Sincronização na nuvem
- [ ] **Múltiplos Usuários**: Sistema de permissões
- [ ] **Módulos Adicionais**: CRM, Financeiro, RH

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 👨‍💻 Desenvolvido por

**MindFlux** - Soluções em Tecnologia

---

⭐ **Se este projeto te ajudou, considere dar uma estrela!** 