---
title: "Hello World"
date: 2023-01-12T13:45:38-03:00
slug: hello-world
type: blog
draft: false
categories:
  - non-tech
  - tech
tags:
  - hugo
  - github-actions
  - github-pages
---
Eu já tentei manter um site pessoal na internet N vezes. Nunca foi "pra frente". Essa é a tentativa N + 1.

Não preciso ser convencido da importância da escrita, sei dos benefícios que posso tirar dela. Escrever nos ajuda a entender as coisas, robustece nosso pensamento. Existem coisas que parecem bem estruturadas na nossa cabeça até que tentemos escrever ou conversar com alguém sobre. Escrever é [*debugar*](https://en.wikipedia.org/wiki/Debugging) a si mesmo.

Depois que entendi isso, abandonei qualquer pretensão de originalidade, que, aliás, é [superestimada](https://guzey.com/personal/why-have-a-blog/#but-i-dont-have-anything-original-to-say-and-i-would-be-just-repeating-things-said-elsewhere-on-the-internet).

Ainda assim, a procrastinação seguia. Eu implicava com 2 coisas principalmente: a organização do conteúdo e a *stack*.

## Organização do conteúdo

Ter um blog em que escrevesse tudo que eu quisesse, usando apenas tags para organizar o conteúdo, não me parecia ideal. E se alguém de TI entrasse no site buscando conteúdo técnico e tivesse que navegar por um monte de textos opinativos? E se alguma amiga de fora da área de tecnologia entrasse no site e visse um monte de textos sobre desenvolvimento de software?

Quero poder escrever sobre tudo que me interessa, mas também não quero alienar uma potencial audiência apresentando tudo "junto e misturado", numa forma difícil de navegar.

Considerei sites separados para cada tipo de conteúdo, mas o trabalho extra necessário para manter mais de um site me demoveu dessa ideia. Fora que suscita a pergunta: qual critério eu deveria usar para colocar determinado conteúdo num site e não no outro? Os sites pessoais mais [interessantes](https://aurelio.net/) [que](https://epxx.co/) [conheço](https://thobias.org/) tratam de [tudo](https://epxx.co/artigos/index_pens.html) [que "dá na telha"](https://aurelio.net/fvm/) dos donos. O meu seria assim também.

Foi remoendo as questões acima que decidi usar a organização com 2 [taxonomias](https://gohugo.io/content-management/taxonomies/) (**categorias e tags**), que já é usada em muitos blogs.

- Uma [categoria](/categories) é uma classificação mais ampla e dificilmente um post vai estar em mais de uma categoria. Para começar, terei 2 categorias: uma para posts [técnicos](/categories/tech) e outra para posts [não técnicos](/categories/non-tech).
- Uma [tag](/tags) é uma classificação mais estrita e frequentemente um post terá mais de uma tag.

Além disso, existem as seções de conteúdo separadas. Nelas cada página pode receber categorias e tags também, mas elas são apresentadas de forma diferente dos textos. A única seção separada hoje é a de [leituras](/books). Pretendo que cada página sobre um livro mostre ao menos uma imagem da capa e informações do livro em destaque.

Cada categoria, tag e seção separada terá seu próprio *feed* RSS. Um potencial leitor pode assinar o *feed* específico e acompanhar apenas o conteúdo de seu interesse.

## Stack

Depois de algumas tentativas de usar [CMS](https://en.wikipedia.org/wiki/Content_management_system)s, ficou claro que eu não queria ter o trabalho de instalar e manter atualizados os softwares de uma pilha [LAMP](https://en.wikipedia.org/wiki/LAMP_(software_bundle)).

[Geradores de sites estáticos](https://en.wikipedia.org/wiki/Static_site_generator) seriam meu caminho. Li sobre as opções disponíveis e fiquei convencido de que o melhor "no mercado" é o [Hugo](https://gohugo.io/). Decidi usá-lo. Gostei do que vi nos primeiros usos, mas demorei um pouco até encontrar um [livro que me ensinou decentemente](https://www.pragprog.com/titles/bhhugo/build-websites-with-hugo/) sobre ele.

Para hospedagem, estou usando [GitHub Pages](https://pages.github.com/).

Para fazer o *build* e o *deploy*, estou usando [GitHub Actions](https://github.com/features/actions). Existem *actions* prontas para [instalar o Hugo](https://github.com/marketplace/actions/hugo-setup) e [fazer o *deploy* no GitHub Actions](https://github.com/marketplace/actions/github-pages-action), então o [*workflow*](https://github.com/gmgall/gmgall.net/blob/main/.github/workflows/gh-pages-deployment.yml) fica relativamente simples.

O primeiro lugar em que li sobre esse tipo de *workflow* foi em [morling.dev](https://www.morling.dev), no post [*Automatically Deploying a Hugo Website via GitHub Actions*](https://www.morling.dev/blog/automatically-deploying-hugo-website-via-github-actions/). Seguindo esse caminho, você fica com um repositório único que contém o código fonte do site (em um *branch* principal) e os arquivos que efetivamente são servidos (em um *branch* [órfão](https://dev.to/mcaci/how-to-create-an-orphan-branch-in-git-35ac) `gp-pages`).

Outro padrão que vi sendo bastante usado é ter 2 repositórios: um só para o código fonte e outro só para os arquivos que serão servidos pelo GitHub Pages. Veja um exemplo em [*Hugo: Deploy Static Site using GitHub Actions*](https://ruddra.com/hugo-deploy-static-page-using-github-actions/)

----

Pensar nisso tudo acima antes mesmo de ter o que postar é complicar demais o que é simples, você deve estar pensando. O ideal seria simplesmente começar e ir ajustando o que fosse necessário pelo caminho.

E você estaria certa. Procrastinei manter um site na web por muito mais tempo do que me orgulho. Estou com o domínio gmgall.net "parado" há vários anos.

Protelei tanto por uma ansiedade de me expor que só consegui lidar melhor com [ajuda](https://pt.wikipedia.org/wiki/Psicoterapia). Então deseje-me sorte e seja bem vinda, pessoa leitora! 😁
