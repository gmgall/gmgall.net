---
title: "Free Software Advent 2024"
date: 2025-01-01T22:24:39-03:00
slug: free-software-advent-2024
type: blog
comments: https://ursal.zone/@gmgall/113756359211506744
draft: false
replyByEmail: true
categories:
  - tech
tags:
  - foss
---
Na tag `#FreeSoftwareAdvent` lá na Federação[^1] se indica um software livre por dia no mês de dezembro. Eu participei indicando alguns e os listo abaixo. Isso vai servir tanto para colocar esse conteúdo num local mais permanente (eu excluo minhas postagens no Mastodon periodicamente) quanto para tirar a poeira do site.


Um excelente 2025 para todos que me leem aqui!

----

## Aegis

Um autenticador. Alternativa livre aos Google Authenticator e LastPass Authenticator da vida. Seus tokens ficam encriptados. Backups automáticos, mas só se você configurar ativamente.

Plataforma: Android. Licença: GPLv3

https://getaegis.app/

## newslinkrss

Cria feeds RSS para sites que não oferecem um.

É um scraper de propósito específico. Pela linha de comando, você invoca o newslinkrss contra um site com listas de artigos e pode usar seletores CSS, XPath e regex em flags específicas para pegar os diferentes componentes de um feed (data de publicação, título de artigo, corpo de artigo, autor etc.).

Muito poderoso e versátil.

Plataforma: Só usei no Linux, mas deve funcionar em outros SOs, é feito em Python. Licença: GPLv3

https://github.com/ittner/newslinkrss

## SimpleScreenRecorder

Faz o que está no nome: grava sua tela para um arquivo de vídeo de forma simples.

Você tem um assistente que te pergunta se você quer gravar a tela inteira ou um pedaço dela, se deseja gravar áudio e qual o formato do vídeo.

Plataforma: Linux (está no repositório de várias distros). Licença: GPLv3

https://www.maartenbaert.be/simplescreenrecorder/

## Joplin

Um aplicativo de notas. Suporta Markdown, não te obriga a usar um editor WYSIWYG (mas se quiser, pode). Sincroniza entre vários dispositivos com um mecanismo de sua escolha (Dropbox, Nextcloud etc.). Tem suporte à criptografia.

Em resumo, o Evernote se não fosse um produto insuportável de usar.

Plataforma: Linux, macOS, Windows, Android e iOS. Licença: AGPLv3

https://joplinapp.org/

## Funções ZZ

Uma coletânea de quase 200 programinhas de linha de comando.

Tem função para cálculo de horas, geração de CPF, conversão para números romanos, geração de senhas, cálculo de porcentagens, consulta a Selic... É coisa para caramba. Se prefere a objetividade da linha de comando, vale a pena uma olhada.

Contribuí com umas 3 funções. :-)

Plataforma: Linux, BSD, Cygwin, Mac OS X, entre outros. Licença: GPLv2

https://funcoeszz.net/

## LocalSend

Envio de arquivos entre 2 dispositivos numa rede local.

Nada de subir arquivos para nuvens (a.k.a. computadores de outras pessoas) em outro país só para transferir um arquivo do seu PC para o seu celular.

Abra o LocalSend, os dispositivos são encontrados automaticamente. Selecione os arquivos a serem enviados numa ponta, aceite na outra. Pronto.

Plataforma: Linux, Windows, macOS, Android e iOS. Licença: Apache License 2.0

https://localsend.org/pt-BR

## ddrescue

Uma ferramenta de recuperação de dados. Permite clonar uma partição ou disco para um arquivo ou outra partição/disco.

Tenta mais de uma leitura em caso de erros na leitura de um bloco. Segue tentando os demais blocos mesmo em caso de erros.

Plataforma: Unix e seus amigos. Licença: GPLv2

https://www.gnu.org/software/ddrescue/

## Anki

Um programa para aprendizagem via flashcards. Gerencia a [curva de esquecimento](https://pt.wikipedia.org/wiki/Curva_do_esquecimento) para você por meio da técnica de repetição espaçada. Você classifica o quão fácil foi lembrar do conteúdo de um cartão e o programa define a data da próxima revisão.

Existe a possibilidade de sincronizar com um serviço web (que também permite a revisão dos cartões), mas o uso é completamente opcional. Em nenhum momento o software te obriga a criar conta.

Plataforma: Linux, macOS, Windows, Android, iOS e web.

Licença:

* no desktop (AGPLv3)
* no Android (GPLv3)
* no iOS (sei lá, mas custa 25 USD na loja)
* na web (O serviço oficial é de uso gratuito, mas não livre. Há uma alternativa livre para quem quiser fazer self hosting.)

https://apps.ankiweb.net/

## FreshRSS

Um agregador RSS.

Plataforma: pode ser hospedado num servidor Linux ou Windows com Apache 2.4+, nginx ou lighttpd. Licença: AGPLv3

https://freshrss.org/

## yt-dlp

Um programa para download de áudio e vídeo com suporte a centenas de sites. O mais famoso é o YouTube.

Para o YT, basta chamá-lo com o comando

```
$ yt-dlp 'https://youtu.be/123456789AB'
```

Tem muito mais opções, esse é o uso básico.

Plataforma: Linux, macOS, Windows. Licença: Unlicense License.

https://github.com/yt-dlp/yt-dlp

## NewPipe

Um cliente para o YouTube sem anúncios, sem Shorts e com funcionalidade de download dos vídeos.

As únicas desvantagens que percebi é que me parece que a atualização do feed de inscrições demora um pouco mais que no app oficial e a ausência de algoritmo (diz-se que ele erra muito, mas no meu caso também acerta algumas vezes).

Plataforma: Android. Licença: GPLv3

https://newpipe.net/

## KeePassXC

Gerenciador de senhas. Direto ao ponto, gera e armazena senhas seguras para você. Não tenta fazer você criar conta num serviço de sincronização na nuvem nem nada. Escreve um arquivo criptografado, se você quiser colocar num Dropbox da vida, é com você. Se quiser ter uma cópia só do arquivo sem backup nenhum, é com você também.

Plataforma: Linux, macOS, Windows. Licença: GPLv3

https://keepassxc.org/

## Hugo

Um gerador de sites estáticos. Existem centenas de geradores, só sosseguei num deles depois de conhecer o Hugo.

É bem poderoso, pode ser confuso tentar entender tudo dele de uma vez só.

Recomendo fazer um site que começa simples e vai ficando mais complexo aos poucos. Essa é a abordagem do livro "[Build Websites With Hugo](https://www.gmgall.net/books/build-websites-with-hugo/)" que me ensinou a maior parte do que sei do software.

Plataforma: Linux, BSD, macOS e Windows. Licença: Apache 2.0

https://gohugo.io/

## httpie

Cliente HTTP para linha de comando.

O curl é um baixa software, mas pode ser chato usá-lo para testar APIs REST. Eu uso principalmente o httpie para isso.

Na imagem há um gif mostrando como as respostas aparecem. Tirei do github do projeto.

![Uso do httpie no terminal. É feito uma requisição GET e uma PUT.](https://raw.githubusercontent.com/httpie/cli/master/docs/httpie-animation.gif)

Plataforma: Linux, BSD, macOS, Windows. Licença: BSD 3

https://httpie.io/docs/cli/

## monolith

Salve páginas web num único arquivo HTML.

Use

```
$ monolith 'http://example.com' -o arquivo.html
```

e tenha em `arquivo.html` tudo que um browser precisa para renderizar a página.

CSS, imagens e JS estarão embutidos em `arquivo.html`, facilitando salvar e compartilhar uma página.

Plataforma: Linux, BSD, Windows. Licença: CC0 1.0

https://github.com/Y2Z/monolith

## vsv

Um gerenciador de serviços para o Void Linux (teoricamente funciona em qualquer distro que usa [runit](https://smarden.org/runit/)).

Permite uma visão única de que serviços estão ativos. se normalmente eles bootam ativados, qual PID etc.

A saída é colorida e bem formatada.

Plataforma: Linux. Licença: MIT

https://github.com/bahamas10/vsv

[^1]: Acho que vou passar a usar "Federação" no lugar de "[Fediverso](https://fedi.tips/what-is-mastodon-what-is-the-fediverse/)"
