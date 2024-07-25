---
title: "Pós-instalação Void Linux"
date: 2024-07-24T21:36:23-03:00
slug: pos-instalacao-void-linux
type: blog
draft: false
comments: https://ursal.zone/@gmgall/112844628082482584
replyByEmail: true
categories:
  - tech
tags:
  - linux
  - sysadmin
  - void
---
Estou usando o [Void Linux](https://voidlinux.org/) como SO principal agora. Estou bem satisfeito com ele por enquanto, mas como toda distribuição minimalista, há intervenções que precisei fazer após terminar a instalação para ter um desktop totalmente funcional.

Listarei essas intervenções abaixo para minha[^1] própria referência futura. Parti da imagem com [XFCE](https://xfce.org/) + `glibc`. Baixei a ISO em 17/07/2024[^2].

## Impedir o carregamento do módulo nouveau

O *boot* estava demorando mais que o normal. A seguinte mensagem aparecia:

```
udevd[674]: worker [681] /devices/pci0000:00/0000:00:1c.0/0000:01:00.0 is taking a long time
```

O processo de desligamento e *reboot* causava travamento.

Impedir o carregamento do módulo do *kernel* `nouveau` resolveu esses problemas.

Em `/etc/default/grub` adicionei `module_blacklist=nouveau` ao valor da variável `GRUB_CMDLINE_LINUX_DEFAULT`:

```shell
$ grep GRUB_CMDLINE_LINUX_DEFAULT /etc/default/grub 
GRUB_CMDLINE_LINUX_DEFAULT="loglevel=4 module_blacklist=nouveau"
```

## Mudar o *mirror*

Nem sempre o *mirror* principal do Void é o mais rápido. Acho que ele fica na Europa. [Mudar para o *mirror*](https://docs.voidlinux.org/xbps/repositories/mirrors/changing.html) de Chicago pode melhorar os tempos de download de pacotes. A forma mais fácil de mudar de *mirror* é usando o comando `xmirror`, disponibilizado no pacote de mesmo nome.

## Configurar o *layout* de teclado no XFCE

As configurações de idioma e *layout* de teclado do programa `void-installer` funcionam para o modo texto. No ambiente gráfico, executei o seguinte para mudar o *layout* da sessão corrente, de forma não persistente:

```shell
setxkbmap -model abnt2 -layout br
```

E criei o arquivo `/etc/X11/xorg.conf.d/30-keyboard.conf` com o conteúdo seguinte para manter as configurações permanentes:

```
Section "InputClass"
  Identifier "keyboard-all"
  Driver "evdev"
  MatchIsKeyboard "on"
  Option "XkbLayout" "br"
EndSection
```

## Instalar fontes extras

Todas as fontes presentes pós-instalação permitem ler textos em português e inglês sem problemas. Para evitar ver quadradinhos ao exibir {{< strike >}}emoticons{{< /strike >}} textos em outros alfabetos, instalei outras fontes.

Os pacotes que instalei foram `noto-fonts-ttf`, `noto-fonts-emoji` e `noto-fonts-cjk`:

```shell
xbps-install noto-fonts-ttf noto-fonts-emoji noto-fonts-cjk
```

## Instalar pacotes para fazer funcionar fones Bluetooth

Contei recentemente [esse causo](/blog/premissas-erradas-pipewire-e-bluetooth/) aqui. A imagem do Void Linux com XFCE usa PipeWire e não PulseAudio.

Para parear com fones ou caixas de som Bluetooth, é necessária a instalação de um pacote.

```shell
xbps-install libspa-bluetooth
```

⚠️  Não se deixe enganar pelo nome do *mixer* de áudio no XFCE. Ao *bootar* com a imagem com XFCE, é o PipeWire que estará em uso.

## Instalar Anki Flashcards do site, não dos repositórios

A versão empacotada nos repositórios do Void não é tão nova quanto a versão disponibilizada [no site](https://apps.ankiweb.net/). Acho que a dos repositórios não sincronizava direito com o [AnkiWeb](https://ankiweb.net/).

Escrevo "acho" acima porque a única nota que fiz sobre o assunto foi "instale do site, não do repo" e agora não lembro mais o motivo exato de ter escrito isso.🫏

[^1]: Ou de meus eventuais leitores, que só tenho como ter certeza que existem quando comentam.🙃 Não uso nenhum mecanismo de rastreamento nesse site.
[^2]: É uma distribuição com *rolling release* e não sei com que frequência eles constroem uma nova ISO para disponibilizar para download.
