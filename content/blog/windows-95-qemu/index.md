---
title: "Windows 95 no QEMU"
date: 2024-08-21T20:38:14-03:00
slug: windows-95-qemu
type: blog
draft: false
comments: https://ursal.zone/@gmgall/113006286894702173
replyByEmail: true
categories:
  - tech
tags:
  - retrocomputing
  - qemu
  - windows
---
Quem acompanhou minha [viagem estrada da saudade abaixo](https://www.collinsdictionary.com/dictionary/english/down-memory-lane)[^1] com a [Enciclopédia do Espaço e do Universo](/blog/nao-olho-mais-para-as-estrelas/) viu algumas capturas de tela de um programa Windows de 16 bits.

Ele não funcionou no [Wine](https://www.winehq.org/) ou no [DOSBox](https://www.dosbox.com/). Nenhum Windows moderno executa mais esses programas[^2]. Precisei partir para emular uma instalação completa do Windows 95. Decidi fazer com o [QEMU](https://www.qemu.org/).

Há [mais](https://wiki.qemu.org/Documentation/GuestOperatingSystems/Windows95) de um [guia](https://computernewb.com/wiki/QEMU/Guests/Windows_95) de como fazer essa instalação na *web*, mas na minha experiência nenhum deles funcionou exatamente como descrito. Foi um processo que demandou uma boa quantidade de tentativa e erro. Testei muitas *flags* do comando `qemu-system-i386` e muitos *drivers* no sistema convidado diferentes.

Não vou nem fingir que isso é um tutorial porque eu não imaginava que seria necessário futucar[^3] tanto na instalação quando comecei. Não anotei meus passos de forma muito organizada. Abaixo vou meramente listar algumas coisas que acho úteis ter em mente caso eu decida repetir uma instalação dessas. Se for útil para mais alguém, excelente.

{{< figure src="win95_version.png" alt="Janela \"Propriedades Sistema\" do Windows 95. Ela mostra a versão do Windows, do IE, o Processador e a quantidade de memória RAM instalada." title="A versão do Windows 95 que instalei." >}}

## FAT 16 ou 32?

Cuidado ao formatar a partição que vai receber o sistema. O Windows 95 não suporta FAT 32 em todas as versões lançadas. A que eu instalei, 4.00.950, não suporta.

## CPUs modernas podem operar numa frequência alta demais para o Windows 95

Se o Windows travar em todo *boot* pós-instalação, pode ser que a frequência de operação do seu processador seja elevada demais para ele. Há um [*patch* para isso no Internet Archive](https://archive.org/details/fix-95-cpu-v3-final).

O erro se não me engano é `Windows Protection Error. You need to restart your computer.`. No meu caso acho que estava localizado, recebi um `Erro de Proteção do Windows`.

## O CD do Windows 95 não é *bootável*

É necessário primeiro *bootar* via disquete no MS-DOS, **depois** executar `D:\SETUP.EXE` ou `D:\INSTALAR.EXE`, supondo que `D:` seja sua unidade de CD-ROM.

Uma imagem de disquete está disponível [aqui](https://winworldpc.com/product/microsoft-windows-boot-disk/95-osr2x).

Um menu será apresentado ao *bootar* com esse disquete. Tive sucesso em iniciar uma instalação com a 1ª opção.

{{< figure src="win95_boot_floppy.png" alt="Janela do QEMU mostrando o menu apresentado pelo disquete de boot. Há 5 opções. As 4 primeiras carregam diferentes drivers de unidade CD-ROM. A última é \"No CDROM support\". Consegui fazer funcionar usando a opção 1." title="Menu apresentado pelo disquete de boot." >}}

## Sound Blaster 16 produz áudio "picotado"

Ambas as wikis que referenciei acima recomendam usar a Sound Blaster 16 como placa de áudio da máquina virtual. Não tive sucesso com ela. Ela instalou, mas o som saía como no vídeo abaixo.

<video width="720" height="480" controls title="Áudio falhando na máquina virtual com placa Sound Blaster 16." aria-label="Vídeo com captura de tela de um desktop XFCE. Do lado esquerdo aparece um emulador de terminal com um comando que executa uma máquina virtual QEMU. Do lado direito, há a tela da máquina virtual em si. Dentro da máquina virtual, o cursor vai no menu Iniciar, depois em Documentos. Um arquivo de áudio é selecionado. O player abre e o som é reproduzido, mas não perfeitamente.">
<source src="qemu_win95_audio_fail.mp4" type="video/mp4"></source>
</video>

A **Realtek AC97** produziu áudio limpo, mas não era detectada imediatamente. Leia o ponto abaixo.

## Instalar o `PCI bus` fez muitos dispositivos serem detectados automaticamente

Essa foi uma dica que colocou muita coisa para funcionar. Infelizmente estava num [vídeo](https://youtu.be/dt67xEXoqRY) e não num texto, foi mais difícil de achar. Coisas da [*web* moderna](https://thewebisfucked.com/).

O trecho com o "pulo do gato" está abaixo:

<video width="720" height="480" controls title="Instalação do &#34;PCI bus&#34; numa máquina virtual com Windows 98." aria-label="Trecho de vídeo que ensina como instalar o driver do &#34;PCI bus&#34; numa máquina virtual com Windows 98. O processo funcionou igual no 95 para mim. Há uma descrição textual do que é feito abaixo desse vídeo.">
<source src="pci_bus.mp4" type="video/mp4"></source>
</video>

Textualmente: clique com o botão direito em `Meu Computador`. Na janela que vai se abrir, clique na aba `Gerenciador de Dispositivos`. Em `Dispositivos do sistema`, o dispositivo `BIOS Plug and Play` estará marcado com uma exclamação amarela. Dê um duplo clique sobre ele e na aba `Driver` clique no botão `Atualizar driver`. No assistente que vai abrir, selecione que deseja escolher o *driver* de uma lista. Marque que quer exibir todos os *drivers* e escolha o *driver* `PCI bus`. Siga com o assistente de instalação de *drivers* até o final do processo. Aceite a reinicialização do computador. Após reiniciar, vários dispositivos serão detectados automaticamente.

## Verificar o endereço IP

O programa que mostra o endereço IP, a máscara de sub-rede e o *gateway* padrão no Windows 95 é o `winipcfg`.

{{< figure src="winipcfg.png" alt="Programa winipcfg do Windows 95. É uma pequena janela com o endereço MAC da placa de rede, o endereço IP da interface, a máscara de sub-rede e o gateway padrão. Abaixo dessas informações há os botões \"OK\", \"Liberar\", \"Renovar\", \"Liberar tudo\", \"Renovar tudo\" e \"Mais informações\"." title="Programa winipcfg do Windows 95." >}}

## Solucionar erro após desinstalação de cliente Novell NetWare

Após desinstalar o cliente Novell NetWare, é possível que você receba um erro como `The NetWare-compatible shell is not available` antes de cada login. A solução para isso está detalhada [aqui](https://kb.iu.edu/d/acyl).

## A linha de comando do QEMU

Com a instalação finalmente funcional, executo a máquina virtual com o seguinte comando:

```shell
qemu-system-i386 \
	-netdev user,id=mynet0 \
	-device pcnet,netdev=mynet0 \
	-hda ~/win95.qcow2 \
	-m 128 \
	-cpu pentium \
	-cdrom Win95PTBR_201902/Win95_PTBR.iso \
	-boot c \
	-device cirrus-vga \
	-device ac97,id=snd1 \
	-audio pipewire,id=snd1
```

`win95.qcow2` é um arquivo de imagem de disco criado com o comando `qemu-img`.

## Drivers úteis

2 listas de *drivers* que funcionam bem com os dispositivos virtuais que o QEMU oferece ao Windows 95 convidado:

* [Drivers 1](https://www.claunia.com/qemu/drivers/index.html)
* [Drivers 2](https://drive.google.com/file/d/1ERRWMfL6DTSbShBa0NS1xWTKJ-mNjnCf/)

[^1]: Peço perdão por essa tortura do vernáculo.
[^2]: Creio que a versão mais "moderna" capaz de executar programas de 16 bits é o XP.
[^3]: Quase usei um *tinkering* aqui, mas prometi que não teria mais tortura nesse texto.
