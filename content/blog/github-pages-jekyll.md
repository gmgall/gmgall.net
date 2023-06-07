---
title: "GitHub Pages e Nomes de Diretório Iniciados com Underline"
date: 2023-06-07T19:25:06-03:00
slug: github-pages-underline
type: blog
draft: false
comments: https://ursal.zone/@gmgall/110505641972601283
categories:
  - tech
tags:
  - github-pages
  - github-actions
  - jekyll
  - html
---
Levei mais tempo para descobrir isso do que me orgulharia em compartilhar, então escrevo aqui para não esquecer.

O [GitHub Pages](https://pages.github.com/) trata diretórios com nomes iniciados por `_` (*underline*) de forma especial **mesmo se você estiver usando GitHub Actions para gerar os arquivos estáticos com outras ferramentas**.

Isso ocorre porque o [GitHub Pages pode gerar e servir um site feito com Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll) se você quiser e para o [Jekyll](https://jekyllrb.com/), diretórios com nomes iniciados por `_` são especiais.

Aparentemente o Jekyll está envolvido mesmo quando configuramos o Pages para servir os arquivos de um *branch* separado e escrevemos nosso próprio *workflow* no [Actions](https://github.com/features/actions) para escrever nesse *branch*. Achei pouco intuitivo e outras pessoas que conversaram comigo sobre o assunto concordaram, mas é assim que o Pages funciona.

Um site que eu estava tentando servir tinha uma estrutura de arquivos parecida com a seguinte:

```
about
css
doc
├── index.html
├── _static
│   ├── basic.css
│   ├── doctools.js
│   ├── documentation_options.js
│   ├── file.png
│   ├── graphviz.css
│   ├── language_data.js
│   ├── minus.png
│   ├── plus.png
│   ├── pygments.css
│   ├── scripts
│   │   ├── bootstrap.js
│   │   ├── bootstrap.js.LICENSE.txt
│   │   ├── bootstrap.js.map
│   │   ├── pydata-sphinx-theme.js
│   │   └── pydata-sphinx-theme.js.map
│   ├── searchtools.js
│   ├── sphinx_highlight.js
│   ├── styles
│   │   ├── bootstrap.css
│   │   ├── pydata-sphinx-theme.css
│   │   └── theme.css
│   ├── switcher.json
│   └── webpack-macros.html
└── tutorial
    ├── graphs.html
    ├── index.html
    ├── plotting_customization.html
    └── quantum_walk_models.html
example.html
features
gethelp
getstarted
images
index.html
index.xml
js
```

O arquivo `doc/index.html` carregava vários recursos de `doc/_static/`. Só a requisição para o arquivo `doc/index.html` era concluída com sucesso. Para as requisições de todos os arquivos em `doc/_static` eu recebia um erro 404 como resposta, **mesmo que os arquivos estivessem lá**.

Para que esses arquivos passassem a ser servidos normalmente, precisei criar um arquivo oculto de nome `.nojekyll` na **raiz do site**. A estrutura ficou mais ou menos a seguinte:

```
about
css
doc
├── index.html
├── _static
│   ├── basic.css
│   ├── doctools.js
│   ├── documentation_options.js
│   ├── file.png
│   ├── graphviz.css
│   ├── language_data.js
│   ├── minus.png
│   ├── plus.png
│   ├── pygments.css
│   ├── scripts
│   │   ├── bootstrap.js
│   │   ├── bootstrap.js.LICENSE.txt
│   │   ├── bootstrap.js.map
│   │   ├── pydata-sphinx-theme.js
│   │   └── pydata-sphinx-theme.js.map
│   ├── searchtools.js
│   ├── sphinx_highlight.js
│   ├── styles
│   │   ├── bootstrap.css
│   │   ├── pydata-sphinx-theme.css
│   │   └── theme.css
│   ├── switcher.json
│   └── webpack-macros.html
└── tutorial
    ├── graphs.html
    ├── index.html
    ├── plotting_customization.html
    └── quantum_walk_models.html
example.html
features
gethelp
getstarted
images
index.html
index.xml
js
.nojekyll
```

Depois da criação desse arquivo, todas as requisições eram concluídas normalmente.
