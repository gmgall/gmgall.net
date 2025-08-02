---
title: "Workflows do GitHub Actions Indefinidamente Como \"Queued\""
date: 2025-08-01T23:42:27-03:00
slug: workflows-do-github-actions-indefinidamente-como-queued
type: blog
draft: false
replyByEmail: true
categories:
  - tech
tags:
  - github-actions
---
O *workflow* que faz o *build* dessa página estava ficando com status `queued` indefinidamente toda vez que era executado. Absolutamente nada era exibido nos logs.

A [imagem](https://github.com/actions/runner-images) que eu estava usando (`ubuntu-20.04`) foi [depreciada](https://github.blog/changelog/2025-01-15-github-actions-ubuntu-20-runner-image-brownout-dates-and-other-breaking-changes/). Após trocar para a imagem `ubuntu-latest`, o *workflow* executou até o final sem problemas.

É esquisito uma coisa assim falhar silenciosamente? Demais, especialmente considerando que o GitHub também [cobra por esse serviço](https://docs.github.com/en/billing/concepts/product-billing/github-actions), mas foi o que rolou comigo.🤷‍♂️ 
