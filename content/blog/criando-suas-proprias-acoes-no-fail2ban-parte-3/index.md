---
title: "Criando Suas Próprias Ações no fail2ban - Parte 3"
date: 2011-08-04T00:00:00-03:00
slug: criando-suas-proprias-acoes-no-fail2ban-parte-3
type: blog
draft: false
categories:
  - tech
tags:
  - linux
  - sysadmin
  - fail2ban
  - debian
---
## Estrutura de uma ação

Cada ação é um arquivo no diretório `action.d`. Esses arquivos seguem a seguinte estrutura:

```
[Definition]

# Option:  actionstart
# Notes.:  comando executado ao iniciar o Fail2Ban.
# Values:  CMD
#
actionstart =


# Option:  actionstop
# Notes.:  comando executado ao encerrar o Fail2Ban
# Values:  CMD
#
actionstop =


# Option:  actioncheck
# Notes.:  comando executado antes de cada comando actionban
# Values:  CMD
#
actioncheck =


# Option:  actionban
# Notes.:  comando executado ao banir um IP. Observe que o comando
#          é executado com as permissões do usuário executando o Fail2Ban.
# Tags:    <ip>  IP address
#          <failures>  number of failures
#          <time>  unix timestamp of the ban time
# Values:  CMD
#
actionban = ipfw add deny tcp from <ip> to <localhost> <port>


# Option:  actionunban
# Notes.:  comando executado ao "desbanir" um IP. Observe que o comando
#          é executado com as permissões do usuário executando o Fail2Ban.
# Tags:    <ip>  IP address
#          <failures>  number of failures
#          <time>  unix timestamp of the ban time
# Values:  CMD
#
actionunban = ipfw delete `ipfw list | grep -i <ip> | awk '{print $1;}'`

[Init]

# Option:  port
# Notes.:  specifies port to monitor
# Values:  [ NUM | STRING ]
#
port = ssh

# Option:  localhost
# Notes.:  the local IP address of the network interface
# Values:  IP
#
localhost = 127.0.0.1
```

O arquivo que usei de exemplo acima já vem com o pacote e configura uma ação que usa o ipfw para bloquear os IPs. Traduzi os comentários da seção `[Definition]` para explicar o que cada entrada define.

A seção `[Init]` define "variáveis" que podem ser usadas ao longo do arquivo. Nesse exemplo, `port` e `localhost`, mas que variáveis definir é por conta do usuário. **Lembrando que** `<ip>` **vira o IP/hostname casado no grupo** `<host>` **dos filtros**.

## Definindo uma ação

Existem ações predefinidas que bloqueiam por `iptables`, `ipfw`, `shorewall`, TCP wrappers, que avisam por e-mail a cada bloqueio... Mas não existe nenhuma que avise via Gtalk. Vamos criar uma ação que faz isso.

Usarei o programa [sendxmpp](https://web.archive.org/web/20110827104139/http://sendxmpp.platon.sk/) para definir uma ação que enviará uma mensagem para mim no Gtalk a cada evento. Como configurar o sendxmpp para o Gtalk [pode ser visto aqui](http://ubuntuforums.org/showpost.php?s=0ecf5b2a9c9a97fbfa5438c354dcfc2c&p=8876182&postcount=3). Conheci o sendxmpp num [post](http://eriberto.pro.br/blog/2011/03/02/mensagens-jabber-via-linha-de-comando-ideal-para-servidores-de-rede/) do [blog](http://eriberto.pro.br/blog/) do [João Eriberto Mota Filho](http://eriberto.pro.br/site/) ([@eribertomota](https://twitter.com/eribertomota)).

Vamos à listagem do arquivo `action.d/gtalk.local`:

```
[Definition]

actionstart = printf %%b "Hi,\n
              The jail <name> has been started successfully.\n
              Regards,\n
              Fail2Ban"|sendxmpp -t -u <from> -o gmail.com 

actionstop = printf %%b "Hi,\n
             The jail <name> has been stopped.\n
             Regards,\n
             Fail2Ban"|sendxmpp -t -u <from> -o gmail.com 

actioncheck =

actionban = printf %%b "Hi,\n
            The IP <ip> has just been banned by Fail2Ban after
            <failures> attempts against <name>.\n
            Regards,\n
            Fail2Ban"|sendxmpp -t -u <from> -o gmail.com <to>

actionunban =

[Init]

name = default

from =

to =
```

Essa ação enviará uma mensagem para o usuário definido em `to` tendo como remetente o usuário definido em `from` ao iniciar, parar e ao bloquear um IP.

## Ativando sua ação

As ações são definidas por *jail* ou globalmente na seção `[DEFAULT]` de `jail.local`. Ações definidas nas *jails* tem prioridade sobre as definidas globalmente.

Observe o seguinte trecho de `jail.local`:

```
#
# ACTIONS
#

# Default banning action (e.g. iptables, iptables-new,
# iptables-multiport, shorewall, etc) It is used to define
# action_* variables. Can be overriden globally or per
# section within jail.local file
banaction = iptables-multiport

# email action. Since 0.8.1 upstream fail2ban uses sendmail
# MTA for the mailing. Change mta configuration parameter to mail
# if you want to revert to conventional 'mail'.
mta = sendmail

# Default protocol
protocol = tcp

#
# Action shortcuts. To be used to define action parameter

# The simplest action to take: ban only
action_ = %(banaction)s[name=%(__name__)s, port="%(port)s", protocol="%(protocol)s]

# ban & send an e-mail with whois report to the destemail.
action_mw = %(banaction)s[name=%(__name__)s, port="%(port)s", protocol="%(protocol)s]
%(mta)s-whois[name=%(__name__)s, dest="%(destemail)s", protocol="%(protocol)s]

# ban & send an e-mail with whois report and relevant log lines
# to the destemail.
action_mwl = %(banaction)s[name=%(__name__)s, port="%(port)s", protocol="%(protocol)s]
%(mta)s-whois-lines[name=%(__name__)s, dest="%(destemail)s", logpath=%(logpath)s]

# Choose default action. To change, just override value of 'action' with the
# interpolation to the chosen action shortcut (e.g. action_mw, action_mwl, etc) in jail.local
# globally (section [DEFAULT]) or per specific section
action = %(action_)s
```

A variável `action` define a ação globalmente. As outras variáveis definidas antes (`action_mvl`, `action_mw` e `action_`) são atalhos úteis. Leia os comentários com atenção para entender como essas variáveis interagem.

Repare que mais de uma ação pode ser setada por linha e que cada ação pode receber parâmetros entre colchetes. Esses parâmetros definem os valores das variáveis declaradas na seção `[Init]`. Os atalhos `action_mvl`, `action_mw` e `action_` são úteis por já ativarem ações e passarem parâmetros funcionais para tarefas rotineiras como banir e enviar um e-mail com informações úteis.

Para definir nossa ação gtalk globalmente, basta fazer

```
action = %(action_)s
        gtalk[name=%(__name__)s, from=gmgall, to=gmgall]
```

e recarregar as configurações do serviço:

```
# /etc/init.d/fail2ban reload
```

Funciona!

{{< figure src="screenshot.png" alt="Janela de chat do mensageiro instantâneo Pidgin, mostrando mensagens enviadas pelo fail2ban." title="Janela de chat do mensageiro instantâneo Pidgin, mostrando mensagens enviadas pelo fail2ban." >}}
