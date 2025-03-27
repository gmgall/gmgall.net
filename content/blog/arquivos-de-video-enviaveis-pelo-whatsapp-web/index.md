---
title: "Tornando Arquivos de Vídeo Enviáveis Pelo WhatsApp Web"
date: 2025-03-27T14:00:16-03:00
slug: arquivos-de-video-enviaveis-pelo-whatsapp-web
type: blog
draft: false
comments: https://ursal.zone/@gmgall/114235592565769048
replyByEmail: true
categories:
  - tech
tags:
  - ffmpeg
---
Outro dia, outra sequência de opções do `ffmpeg` que coloco aqui para ficar mais fácil de achar[^1].

Hoje tentei enviar um arquivo de vídeo numa conversa no WhatsApp Web e recebi o erro `1 arquivo que você tentou adicionar não é compatível`.

{{< figure src="erro_whatsapp_web.png" alt="Erro '1 arquivo que você tentou adicionar não é compatível' reportado no canto inferior esquerdo do WhatsApp Web. Ele apareceu após uma tentativa de envio de um arquivo de vídeo numa conversa." title="Erro reportado pelo WhatsApp Web na tentativa de enviar um arquivo de vídeo" >}}

O arquivo estava codificado com [VP9](https://en.wikipedia.org/wiki/VP9) e o WhatsApp Web não se dá bem com esse codec no momento em que escrevo esse post.

Uma combinação de [H264](https://en.wikipedia.org/wiki/Advanced_Video_Coding) e [AAC](https://en.wikipedia.org/wiki/Advanced_Audio_Coding) funciona. Para recodificar o vídeo com esses codecs, usei o comando:

```shell
ffmpeg -i input.mp4 -vcodec libx264 -acodec aac output.mp4
```

[^1]: Acho que o blog de todo usuário do `ffmpeg` tem postagens dessas, né?
