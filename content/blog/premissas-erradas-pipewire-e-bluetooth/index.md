---
title: "Premissas Erradas, PipeWire e Bluetooth"
date: 2024-07-22T16:29:53-03:00
slug: premissas-erradas-pipewire-e-bluetooth
type: blog
draft: false
comments: https://ursal.zone/@gmgall/112831806351052891
replyByEmail: true
categories:
  - tech
  - non-tech
tags:
  - linux
  - void
  - sysadmin
---
Esse final de semana relembrei que pode ser elevado o custo de partir de premissas erradas e não gastar nem 5 minutinhos verificando a validade delas. Marquei com [tech](/categories/tech/) e [non-tech](/categories/non-tech/) porque honestamente acho que isso é uma lição tanto na área técnica quanto para a vida.😅

Após um desastre na partição em que mantinha meu [SO principal](https://xubuntu.org/), resolvi aproveitar a oportunidade da reinstalação para finalmente testar outra distro. Estava incomodado com os rumos de Ubuntu e derivados já há algum tempo, mas a preguiça vencia a insatisfação e eu não trocava.

Queria testar algo sem [systemd](https://systemd.io/), mais minimalista e em que eu me sentisse no controle do SO de novo. Uma distro em que eu entendesse melhor que estava acontecendo. Fiquei entre [Arch](https://archlinux.org/), [Gentoo](https://www.gentoo.org/) e [Void](https://voidlinux.org/). Acabei escolhendo esse último e as primeiras impressões têm sido excelentes.

A [documentação do Void Linux](https://docs.voidlinux.org/), apesar de menor que a disponível nas excelentes wikis de [Gentoo](https://wiki.gentoo.org/wiki/Main_Page) e [Arch](https://wiki.archlinux.org/title/Main_page), tem tudo para você terminar com um desktop funcional. Ao menos foi minha experiência partindo da imagem do Void + XFCE.

Só uma coisa não consegui fazer funcionar após a 1ª leitura do tópico correspondente na documentação oficial: Bluetooth. Meus fones pareavam por 1 ou 2 segundos e desconectavam logo em seguida. Confirmei que meu adaptador e fones funcionavam sem problemas testando no [MiniOS](https://minios.dev/pt/) (um sabor de Debian). Era só no Void que eu não conseguia parear. Áudio era reproduzido nos alto-falantes, então *não podia* ser o [*sound server*](https://en.wikipedia.org/wiki/Sound_server), *tinha* que ser Bluetooth.

A [documentação sobre o assunto](https://docs.voidlinux.org/config/bluetooth.html) é bem direta:

> To use an audio device such as a wireless speaker or headset, ALSA users need to install the bluez-alsa package. PulseAudio users do not need any additional software. PipeWire users need libspa-bluetooth.

{{<figure src="captura_de_tela_2024-07-22_00-22-59.png" alt="Menu 'Aplicativos' do XFCE. No submenu 'Multimídia' há um aplicativo chamado 'Controle de volume do PulseAudio'." title="Esse mixer funciona. Eu obviamente estou usando PulseAudio, certo?" >}}

Se eu uso PulseAudio, não deveria precisar de mais nada. *Tinha* que ser Bluetooth.

Parti então para tentar deixar as versões dos softwares instalados no Void iguais às dos softwares instalados no MiniOS (que eu sabia que funcionava). Devia ser alguma regressão. Fiz *build* do meu próprio pacote do [BlueZ](https://www.bluez.org/) para poder fazer *downgrade* da versão 5.76 para a 5.66, instalei outras 2 ou 3 versões de kernel e gastei um bom tempo em *issues* do GitHub, listas de discussão, fóruns etc.

Mesmo resultado. Pareava por apenas uns instantes.🤦‍♂️ 

Desisti de executar o `bluetoothd`[^1] como serviço. Rodei o executável diretamente num *shell* com as *flags* [`-n`](https://man.voidlinux.org/bluetoothd#n) e [`-d`](https://man.voidlinux.org/bluetoothd#d,) enquanto tentava parear para ver se eu recebia alguma "luz" melhor que as mensagens de erro do [`bluetoothctl`](https://man.voidlinux.org/bluetoothctl)[^2].

Eis que em algum ponto durante os breves instantes de pareamento, aparece algo como a mensagem abaixo:

```
a2dp-sink profile connect failed for 60:F4:3A:70:E4:0B: Protocol not available
```

[A2DP](https://en.wikipedia.org/wiki/List_of_Bluetooth_profiles#Advanced_Audio_Distribution_Profile_%28A2DP%29) tem a ver com áudio... E se aconteceu o seguinte?

1. O dispositivo pareava.
2. Ele tentava se registrar como um dispositivo capaz de A2DP de alguma forma.
3. O *sound server* não suportava esse perfil.
4. O dispositivo se desconectava porque não tinha mais o que ser feito.

Foi minha hipótese naquele momento, mas isso implicaria em erro na documentação do Void, que dizia claramente *PulseAudio users do not need any additional software.*

Mas e se...

```bash
$ pgrep -a pipewire
1188 pipewire
1233 /usr/bin/pipewire -c pipewire-pulse.conf
```

Eu estava, afinal, com o [PipeWire](https://pipewire.org/) instalado e rodando.🤡 

Matei o processo, o som parou. Era o PipeWire em uso mesmo.🤡🤡

Voltei à documentação, àquele único parágrafo. *PipeWire users need `libspa-bluetooth`*. Instalei o pacote. Passou a parear e a reproduzir áudio nos fones tão logo reiniciei os serviços.🤡🤡🤡

Por não ter conferido o que eu estava **realmente**[^3] usando para áudio, "botei a culpa" no subsistema errado e enveredei por um caminho que me tomou várias horas. Verificar levaria só alguns segundos.

Acho que a moral da história é: especialmente se for rápido e barato, cheque suas premissas.

> É preciso ter dúvidas. Só os estúpidos têm uma confiança absoluta em si mesmos.
>
> -- Orson Welles

[^1]: O *daemon*.
[^2]: Uma ferramenta de CLI de controle de Bluetooth.
[^3]: A bem da verdade, o nome do *mixer* do XFCE ser "Controle de volume **do PulseAudio**", me induziu bastante ao erro. Não muda o fato que conferir levaria literalmente apenas alguns segundos.
