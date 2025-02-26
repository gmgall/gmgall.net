---
title: "Convertendo Áudios para o Telegram"
date: 2025-02-26T16:40:34-03:00
slug: convertendo-audios-para-o-telegram
type: blog
draft: false
comments: https://ursal.zone/@gmgall/114072080066173944
replyByEmail: true
categories:
  - tech
tags:
  - shell
  - ffmpeg
---
Arquivos de áudio no Telegram podem aparecer para o destinatário de 2 formas:

{{< figure src="audios_telegram.jpg" alt="Um mesmo áudio foi enviado pelo mensageiro Telegram. Cada um aparece de uma forma para o destinatário. A diferença é o formato." title="Áudios no Telegram" >}}

Na primeira forma (áudio de cima na imagem acima), aparece o nome do arquivo e alguns metadados (como artista), além de um **⋮** no topo que faz abrir um menu com opções como *Responder*, *Salvar nas Músicas*, *Compartilhar* etc.

Na segunda forma (áudio de baixo na imagem acima), aparece apenas o botão de play. Aparece como se fosse um áudio gravado pelo próprio microfone do smartphone.

Pelo que testei, a diferença é o container e o codec. Para converter com `ffmpeg` um arquivo de áudio `sample.mp3`, que aparece da 1ª forma, para um arquivo `sample.ogg`, que aparece da 2ª forma, use um comando como:

```shell
# sample.mp3 aparece da 1ª forma
# sample.ogg aparece da 2ª forma
ffmpeg -i sample.mp3 -c:a libopus sample.ogg
```

Se desejar extrair o áudio de um arquivo de vídeo `input.mp4` para um arquivo de áudio `output.ogg` (que aparece da 2ª forma no Telegram), use um comando como:

```shell
ffmpeg -i input.mp4 -vn -c:a libopus output.ogg
```
Testei com as seguintes versões de softwares:
* Telegram Desktop: 5.3.2
* Telegram Android: 11.7.3
* ffmpeg: 6.1.2

Como referência dos usos mais comuns do `ffmpeg` recomendo o site [ffmprovisr](https://amiaopensource.github.io/ffmprovisr/).
