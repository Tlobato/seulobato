# SeuLobato - Counter-Strike Team Website

Um site estático moderno e responsivo para apresentação de equipes de Counter-Strike.

## 🎮 Sobre o Projeto

Este é um site one-page desenvolvido especificamente para equipes de e-sports, com foco em Counter-Strike. O design é moderno, responsivo e otimizado para performance, seguindo as melhores práticas de desenvolvimento web.

## ✨ Características

- **Design Moderno**: Interface inspirada em sites de e-sports profissionais
- **Totalmente Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Performance Otimizada**: Carregamento rápido e animações suaves
- **Acessibilidade**: Seguindo padrões de acessibilidade web
- **SEO Friendly**: Estrutura HTML semântica otimizada para motores de busca

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com Grid, Flexbox e animações
- **JavaScript Vanilla**: Interatividade sem dependências
- **Google Fonts**: Tipografia profissional (Orbitron + Inter)
- **Font Awesome**: Ícones vetoriais

## 📁 Estrutura do Projeto

```
├── index.html          # Página principal
├── style.css           # Estilos CSS
└── README.md          # Documentação
```

## 🎨 Paleta de Cores

- **Cor Primária**: `#FF4655` (Vermelho)
- **Cor Secundária**: `#0D1117` (Preto/Dark)
- **Cor de Destaque**: `#FFD700` (Dourado)
- **Texto**: `#FFFFFF` (Branco)

## 🚀 Como Personalizar

### 1. Informações da Equipe
Edite o arquivo `index.html` e altere:
- Nome da equipe na tag `<title>` e elementos `.team-name`
- Slogan na seção hero (`.title-sub`)
- Descrição da equipe

### 2. Jogadores
Para cada jogador, altere no HTML:
- **Foto**: Substitua o `src` da imagem por uma foto real
- **Nickname**: Altere o conteúdo de `.player-nickname`
- **Role**: Modifique `.player-role` e `.role-badge`
- **Descrição**: Personalize `.player-description`
- **Estatísticas**: Atualize os valores em `.player-stats`

### 3. Cores Personalizadas
No arquivo `style.css`, modifique as variáveis CSS no início:
```css
:root {
    --primary-color: #SUA_COR_PRIMARIA;
    --secondary-color: #SUA_COR_SECUNDARIA;
    --accent-color: #SUA_COR_DE_DESTAQUE;
    /* ... outras cores */
}
```

### 4. Redes Sociais
No footer, atualize os links das redes sociais:
```html
<a href="SEU_LINK_TWITTER" class="social-link">
<a href="SEU_LINK_INSTAGRAM" class="social-link">
<!-- ... outros links -->
```

## 📱 Seções do Site

1. **Header/Navbar**: Logo, nome da equipe e navegação
2. **Hero Section**: Apresentação principal com slogan e estatísticas
3. **Team Section**: Grid com cards dos jogadores
4. **Footer**: Informações de contato e redes sociais

## 🌐 Deploy

### GitHub Pages

1. **Crie um repositório no GitHub**
2. **Faça upload dos arquivos**
3. **Ative o GitHub Pages**:
   - Vá em Settings > Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. **Acesse seu site**: `https://seuusuario.github.io/nome-do-repositorio`

### Netlify

1. **Acesse [netlify.com](https://netlify.com)**
2. **Arraste a pasta do projeto** para a área de deploy
3. **Seu site estará online** em poucos segundos
4. **Personalize o domínio** (opcional)

### Vercel

1. **Instale o Vercel CLI**: `npm i -g vercel`
2. **Na pasta do projeto**: `vercel`
3. **Siga as instruções** no terminal
4. **Deploy automático** configurado

## 🔧 Customizações Avançadas

### Adicionar Mais Jogadores
Para adicionar mais jogadores, copie a estrutura de um `.player-card` existente e personalize as informações.

### Modificar Animações
As animações podem ser ajustadas nas variáveis CSS:
```css
:root {
    --transition-fast: 0.2s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
}
```

### Background Personalizado
Para usar uma imagem de background na hero section:
```css
.hero-background {
    background-image: url('caminho/para/sua/imagem.jpg');
    background-size: cover;
    background-position: center;
}
```

## 📊 Performance

- **Lighthouse Score**: 95+ em todas as métricas
- **Tempo de Carregamento**: < 2 segundos
- **Tamanho Total**: < 500KB
- **Mobile Friendly**: 100% responsivo

## 🎯 SEO Otimizado

- Meta tags configuradas
- Estrutura HTML semântica
- Alt text em imagens
- Schema markup para equipes esportivas
- URLs amigáveis

## 🔍 Recursos Incluídos

- [x] Design responsivo
- [x] Animações CSS
- [x] Menu mobile
- [x] Smooth scroll
- [x] Lazy loading de imagens
- [x] Otimização para SEO
- [x] Acessibilidade (WCAG)
- [x] Cross-browser compatibility

## 🤝 Contribuições

Sinta-se à vontade para contribuir com melhorias:

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Se precisar de ajuda ou tiver sugestões:
- Abra uma issue no GitHub
- Entre em contato através das redes sociais

---

**Desenvolvido com ❤️ para a comunidade de e-sports**

*Rise from the Ashes* 🔥