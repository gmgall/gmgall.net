---
title: "Atualização do Ubuntu Não Instala o Pacote php8.3-fpm"
date: 2026-01-12T23:01:58Z
slug: atualizacao-do-ubuntu-nao-instala-o-php8.3-fpm
type: blog
draft: false
replyByEmail: true
comments: https://ursal.zone/@gmgall/115884732743239956
categories:
  - tech
tags:
  - linux
  - sysadmin
---
Esse post será rápido porque o título já explica quase tudo. Fui atualizar um servidor do Ubuntu 22.04 para o 24.04 pelo caminho tradicional do comando `do-release-upgrade` e quase tudo funcionou de cara. Só os sites PHP que não.

Os logs estavam cheios de mensagens de erro como a abaixo:

```
[proxy:error] [pid 18419] (2)No such file or directory: AH02454: FCGI: attempt to connect to Unix domain socket /run/php/php8.1-fpm.sock (*) failed
``` 

Até faz sentido que um socket relacionado ao PHP 8.1 não esteja mais presente porque, se o papagaio estocástico estiver correto, a versão do PHP no Ubuntu 24.04 passou a ser a 8.3. Só que esse erro isoladamente não dá uma pista muito clara do que você precisa fazer para os sites PHP voltarem a funcionar.

Aqui bastou instalar o pacote `php8.3-fpm` via `apt`.

Durante a instalação, o `apt` avisa:

```
NOTICE: Not enabling PHP 8.3 FPM by default.
NOTICE: To enable PHP 8.3 FPM in Apache2 do:
NOTICE: a2enmod proxy_fcgi setenvif
NOTICE: a2enconf php8.3-fpm
```

Depois desses comandos e de um `systemctl reload apache2` tudo voltou a funcionar.
