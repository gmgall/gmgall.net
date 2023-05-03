---
title: "squash+merge no Git"
date: 2023-05-01T23:22:39-03:00
slug: squash+merge-no-git
type: blog
draft: false
comments: https://bolha.us/@gmgall/110297045845070605 
categories:
  - tech
tags:
  - git
  - scm
---
Às vezes, depois de terminar o trabalho num *feature branch* qualquer, você não deseja simplesmente fazer um `merge`. Você quer dar uma "limpada" no histórico primeiro antes de fazer `merge`.

Frequentemente essa "limpeza" se dá na forma de um `squash`, uma junção das alterações inseridas por mais de um *commit*.

Por exemplo: o [repositório desse site](https://github.com/gmgall/gmgall.net) tem um *branch* `main` com histórico relativamente "limpo". Cada *commit* representa um novo conteúdo no site ou uma nova funcionalidade. O [workflow que faz deploy](https://github.com/gmgall/gmgall.net/blob/main/.github/workflows/gh-pages-deployment.yml) do site é disparado cada vez que eu faço um `push` em `main`.

Eu criei um *branch* local chamado `fediverse_comments` para trabalhar na funcionalidade de comentários. Era uma funcionalidade nova, eu não sabia exatamente quantos *commits* eu precisaria fazer. Estava experimentando muita coisa. Então, mesmo sendo local, não quis fazer bagunça em `main`.

{{< figure src="branches_antes.png" alt="Screenshot do gitk mostrando um branch main e um branch fediverse_comments com vários commits desorganizados." title="Branch main \"limpo\" e feature branch fediverse_comments \"sujo\" antes do merge." >}}

Depois de 5 *commits* em `fediverse_comments` (na imagem acima só aparecem 4, mas fiz mais um depois de tirar o *screenshot*) me dei por satisfeito. Era hora do `merge`.

Eu normalmente faria:

* `git rebase -i` para transformar os *commits* em `fediverse_comments` em um ou mais *commits* "limpos", ou seja, *commits* que eu estaria OK em trazer via `merge` para `main`

* trocaria para o *branch* `main`
* faria o `merge` com o `fediverse_comments` (agora já "limpo") 

Eu achava um pouco "indireto" demais "limpar" um *branch* que em breve estaria em desuso para só depois fazer `merge`, mas era como eu sabia fazer e nunca me questionei muito.

Pois bem, descobri uma forma que me pareceu mais intuitiva semana passada. O comando `merge` já possui uma *flag* `--squash` que faz o que eu precisava.

Então, depois de terminar os trabalhos em `fediverse_comments`, foi só trocar para `main` e dar o seguinte comando:

```bash
git merge --squash fediverse_comments
```

O que esse comando faz é colocar no **working directory** e na **staging area** todas as alterações em `fediverse_comments`. Porém, **não faz `commit`**. Acho isso positivo porque me dá a oportunidade de dar uma última revisada ou de fazer mais alguma alteração no *commit*.

Não precisei nessa situação, então fiz um *commit* de mensagem `Adiciona comentários pelo fediverso` em `main`.

{{< figure src="branches_depois.png" alt="Screenshot do gitk mostrando um branch main com um único commit limpo que traz as alterações de todos os commits sujos de fediverse_comments." title="Branch main \"limpo\" com um único commit com todas alternações feitas em fediverse_comments." >}}

Dessa forma, meu `main` ficou apenas com *commits* "limpos" e poupei a etapa de fazer `squash` no *feature branch*. Devo fazer mais dessa forma no futuro.
