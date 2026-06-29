# AulaLab

Biblioteca digital de jogos matemáticos para professores da Educação Básica.

O projeto reúne jogos analógicos e digitais com orientações pedagógicas, regras, materiais para impressão e sugestões de aplicação em sala de aula.

## Objetivo

Criar uma ludoteca matemática aberta, bonita e prática, capaz de apoiar professores no planejamento de aulas mais participativas, investigativas e significativas.

## Páginas atuais

- `index.html` — página inicial em formato de feed, com carrossel de destaques e últimas atualizações.
- `noticias.html` — página geral de notícias e chamadas do projeto.
- `noticias/` — notícias individuais de teste.
- `jogos.html` — biblioteca inicial com cards de jogos, filtros e favoritos.
- `entrar.html` — login com Google ou e-mail/senha via Firebase.
- `minha-aulalab.html` — área pessoal com jogos favoritos.
- `guia-professor.html` — orientações para aplicação dos jogos em sala.
- `contribuir.html` — modelo de ficha para cadastrar novos jogos.
- `sobre.html` — apresentação da proposta.

## Feed de notícias

A home funciona como um boletim do AulaLab:

- carrossel de destaques com troca automática;
- botões de anterior/próximo;
- indicadores clicáveis;
- cards de últimas atualizações;
- links para notícias completas;
- mural lateral com tarefas em andamento.

Os estilos específicos estão em `css/news.css`, carregados automaticamente pelo `js/main.js` nas páginas de notícia/feed.

## Autenticação e favoritos

A estrutura de conta já está preparada em `js/auth.js`.

Enquanto o Firebase não estiver configurado, os favoritos funcionam em modo local, salvos apenas no navegador com `localStorage`.

Para ativar login real:

1. Crie um projeto no Firebase.
2. Ative Authentication com Google e e-mail/senha.
3. Crie um banco Firestore.
4. Copie `firebase-config.example.js` para `firebase-config.js`.
5. Preencha `firebase-config.js` com as chaves do seu projeto.
6. Configure as regras de segurança do Firestore.

Estrutura prevista no Firestore:

```text
usuarios/{uid}/favoritos/{gameId}
```

## Categorias previstas

- Probabilidade
- Estatística
- Funções
- Álgebra
- Geometria
- Frações
- Logaritmos
- Raciocínio lógico

## Tecnologias

- HTML
- CSS
- JavaScript
- Firebase Authentication
- Firestore
- GitHub Pages

## Próximos passos

- Criar páginas individuais para cada jogo.
- Adicionar PDFs para impressão.
- Inserir imagens e ícones próprios.
- Criar versões digitais jogáveis.
- Criar coleções personalizadas na área Minha AulaLab.
- Transformar notícias em dados reutilizáveis via JSON.
- Melhorar filtros por série, conteúdo e tempo de aula.

## Status

Projeto em desenvolvimento.
