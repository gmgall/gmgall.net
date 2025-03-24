---
title: 'Erro "Can Not Open External File" ao Tentar Abrir Legendas Com mpv'
date: 2025-03-23T22:06:39-03:00
slug: can-not-open-external-file-mpv
type: blog
draft: false
comments: https://ursal.zone/@gmgall/114214930029028962
replyByEmail: true
categories:
  - tech
tags:
  - ffmpeg
---
Hoje, ao tentar reproduzir um arquivo de vídeo com legendas externas no formato [SRT](https://docs.fileformat.com/video/srt/) com o player `mpv`, recebi um erro como o que aparece abaixo:

```shell
$ mpv --sub-file=legenda.srt video.mp4 
Can not open external file legenda.srt.
 (+) Video --vid=1 (*) (h264 1920x1036 24.000fps)
 (+) Audio --aid=1 --alang=spa (*) (ac3 6ch 48000Hz)
     Audio --aid=2 --alang=spa (*) (aac 2ch 48000Hz)
AO: [pipewire] 48000Hz 5.1(side) 6ch floatp
VO: [gpu] 1920x1036 yuv420p
AV: 00:00:06 / 02:00:10 (0%) A-V:  0.000 ct: -0.083
Exiting... (Quit)
```

O arquivo estava no *path* certo, outras legendas funcionavam normalmente e eu tinha permissão de leitura em `legenda.srt`. Ainda assim, o enigmático `Can not open external file` seguia aparecendo.

Parando para comparar legendas que **não** abriam no `mpv`...

```shell
$ head legenda1.srt # Não abre no mpv
0:00.000 --> 00:00:09.259
blablabla

$ head legenda2.srt # Não abre no mpv
0
00:00:05:150 --> 00:00:10,050
blablabla
```

...com legendas que abriam...

```shell
$ head legenda3.srt # ABRE no mpv
1
00:00:42,058 --> 00:00:46,277
blablabla
```

ficou claro um padrão: sempre que a legenda **não** começava com um contador numérico de legendas iniciado por 1, o mpv reclamava `Can not open external file`.

Alterei manualmente o arquivo de legendas que eu estava tentando abrir originalmente para começar por 1 e o `mpv` conseguiu abri-lo sem erros.

Outros players devem ser mais lenientes com o formato SRT do que o `mpv`, por isso existem tantos arquivos que não seguem exatamente o [formato](https://en.wikipedia.org/wiki/SubRip#Format) por aí.

Parece que esse é um [problema](https://github.com/mpv-player/mpv/issues/3820)[^1] [conhecido](https://github.com/iina/iina/issues/3073) há um tempinho, mas a mensagem de erro não ajuda nem um pouco.

Versões dos softwares envolvidos:

```shell
$ mpv --version
mpv 0.38.0 Copyright © 2000-2024 mpv/MPlayer/mplayer2 projects
 built on Jul 22 2024 20:52:23
libplacebo version: v6.338.2
FFmpeg version: 6.1.2
FFmpeg library versions:
   libavutil       58.2.100 (runtime 58.29.100)
   libavcodec      60.3.100 (runtime 60.31.102)
   libavformat     60.3.100 (runtime 60.16.100)
   libswscale      7.1.100 (runtime 7.5.100)
   libavfilter     9.3.100 (runtime 9.12.100)
   libswresample   4.10.100 (runtime 4.12.100)
```

[^1]: Quem exatamente tem um problema? O software que é tolerante com pequenos desvios do formato ou o que segue o formato estritamente, mesmo que com isso deixe de abrir um monte de arquivos disponíveis?
