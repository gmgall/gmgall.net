---
title: "Ano Novo, Casa Nova"
date: 2026-01-20T20:24:02Z
slug: ano-novo-casa-nova
type: blog
draft: false
replyByEmail: true
comments: https://ursal.zone/@gmgall/115929712997493662
categories:
  - tech
tags:
  - linux
  - sysadmin
  - github-actions
  - github-pages
  - hugo
---
Não, não estou falando de minha mudança de cidade. Isso aconteceu há vários meses. Estou falando desse site. Antes ele estava no GitHub Pages e era construído via GitHub Actions. Agora está numa máquina que eu controlo.

Esse é o setup mais lógico. Pense só que para construir esse site, que é estático, meu _workflow_ no GitHub Actions:

1. subia uma VM;
2. clonava um repositório git;
3. fazia o _build_ da página (que consiste só no comando `hugo`) e
4. destruía a VM.

Isso era um grande desperdício de recursos. Só fazia sentido porque eu estava com {{< strike >}}fogo{{</ strike >}} necessidade de aprender GitHub Actions na época.

O tempo que demorava até que uma nova versão do site estivesse disponível também era um problema porque decidi [usar o Mastodon como sistema de comentários](/blog/comentarios-via-mastodon/). Eu precisava ter um post no Mastodon **antes** de fazer _push_ para o [repositório](https://github.com/gmgall/gmgall.net) do site. Isso fazia meus seguidores clicarem no link do post e, ao receberem um erro 404, comentarem que não tinham conseguido acessar. Poucos segundos depois, o link estaria funcional, mas aí o comentário falando do erro já estaria lá.

Uma coisa muito legal desses avisos é que eu descobri que sou lido às vezes. Não há nenhum tipo de _analytics_ aqui (nem pretendo que tenha), a única forma de saber se sou lido é quando falam para mim. Obrigado, amigo _fediverser_!

Não é para essa mudança quebrar muita coisa aqui. Se perceber algo errado e tiver um tempinho, comente abaixo ou entre [contato](/contact/).
