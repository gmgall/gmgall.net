---
title: "Migrando Para Uma Alternativa GPL Ao LastPass Authenticator"
date: 2023-09-29T03:40:06-03:00
slug: migrando-para-uma-alternativa-gpl-ao-lastpass-authenticator
type: blog
draft: false
comments: https://ursal.zone/@gmgall/111147543895950160
categories:
  - tech
tags:
  - android
  - 2fa
---
Usei o [LastPass Authenticator](https://play.google.com/store/apps/details?id=com.lastpass.authenticator) como *app* de 2FA no meu celular Android por alguns anos. Não me recordo agora o que me levou a escolhê-lo no passado, mas, por hábito, acabou sendo o que instalei no *smartphone* que comprei recentemente.

2 problemas sérios com o LastPass Authenticator:

* é software proprietário e
* só permite *backup* na nuvem da LastPass[^1].

Eu devia ter pesquisado uma alternativa livre antes, mas a {{< strike >}}preguiça{{< /strike >}} rotina venceu. Fiquei com esse problema por resolver.

Até agora.

A insônia me deu a oportunidade de ler o texto [*What's on my Phone (Fall 2023)*](https://joelchrono.xyz/blog/what-is-on-my-phone-fall-2023/), recheado de recomendações de *apps* livres para Android instaláveis via [F-Droid](https://f-droid.org/).

O [*Aegis Authenticator*](https://getaegis.app/)[^3] tinha a descrição *2FA manager with a nice[^2] interface and easy to backup*. Boa, achei "o cara"!

Aegis instalado, fui em `Configurações` > `Importar & Exportar` > `Importar de arquivo`. Tem mais de 10 opções de *apps* de origem para escolher, mas o LastPass não é uma delas. 😔

Por sorte, alguém parou para olhar o arquivo gerado pela opção `Exportar contas para arquivo` do LastPass Authenticator e descobriu que não é um JSON muito diferente do usado pelo próprio Aegis.

Um [conversor está disponível no GitHub](https://github.com/tghw/lastpass_aegis_convert).

O processo para migrar as contas foi o seguinte:

1. No LastPass, fui em `Configurações` > `Transferir contas` > `Exportar contas para arquivo`. Foi gerado um arquivo JSON.

2. Transferi o arquivo para o computador e usei `python convert.py path/to/lastpass_auth_export.json`. Um arquivo com nome no padrão `aegis_*.json` foi gerado.

3. Transferi o arquivo `aegis_*.json` para o celular. No Aegis, fui em `Configurações` > `Importar & Exportar` > `Importar de arquivo`. Selecionei `Aegis` e escolhi em seguida o arquivo `aegis_*.json`.

Funcionou perfeitamente. 😊

Com as contas migradas, confirmei o *easy to backup*. Em `Configurações` > `Backups` consegui rapidamente selecionar um diretório numa instância do [Nextcloud](https://nextcloud.com/) e agora tenho backups regulares das contas.

⚠️ **Não deixe os arquivos JSON usados para migração de bobeira no celular ou no computador. Apague-os assim que terminar a migração.** ⚠️

[^1]: Não sei se é uma boa ideia ter uma conta na nuvem de uma empresa que tem como maior seção de seu artigo na Wikipedia uma [lista de incidentes de segurança](https://en.wikipedia.org/wiki/LastPass#Security_incidents).
[^2]: Está aí: acho que o motivo para eu ter instalado o LastPass Authenticator pela 1ª vez foi eu ter achado a interface bonita.
[^3]: O Aegis usa a licença GPLv3.
