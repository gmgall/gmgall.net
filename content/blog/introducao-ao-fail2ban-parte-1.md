---
title: "Introdução ao fail2ban - Parte 1"
date: 2011-07-29T00:00:00-03:00
slug: introducao-ao-fail2ban-parte-1
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
O fail2ban é um software que monitora os logs do sistema e em caso de X (sendo X configurável) tentativas de autenticação sem sucesso em diversos serviços toma uma atitude, que pode ser colocar o host ofensor em `/etc/hosts.deny`, "dropar" seus pacotes via `iptables` ou qualquer outra ação definida pelo usuário.

## Instalação do fail2ban

Em máquinas Debian, a melhor maneira de instalar o `fail2ban` é via `apt-get`:

```
# apt-get update
# apt-get install fail2ban
```

As configurações *default* bloqueiam via `iptables` por 10 minutos os hosts que tentarem sem sucesso login via ssh 6 vezes. O `fail2ban` cria uma *chain* com nome no padrão `fail2ban-serviço`:

```
# iptables -L
Chain INPUT (policy ACCEPT)
target prot opt source destination
fail2ban-ssh tcp -- anywhere anywhere multiport dports ssh

Chain FORWARD (policy ACCEPT)
target prot opt source destination

Chain OUTPUT (policy ACCEPT)
target prot opt source destination

Chain fail2ban-ssh (1 references)
target prot opt source destination
RETURN all -- anywhere anywhere
```

Lembrando que todo esse comportamento é configurável. O bloqueio pode ser feito via TCP-wrappers (`/etc/hosts.{allow,deny}`), e muitos outros serviços são suportados.

## Entendendo os arquivos de configuração

Alguns termos usados pelo `fail2ban`:

- **filter**: um filtro define uma regex que casa um padrão correspondente a uma tentativa de login mal sucedido nos arquivos de log;

- **action**: uma ação define os comandos que são executados nos mais diversos eventos, como bloquear um host (ex: bloquear via TCP-wrappers ou `iptables`), iniciar o `fail2ban` (ex: criar as chains no firewall) e parar o `fail2ban` (ex: remover as *chains* criadas ao iniciar);

- **jail**: uma *jail* é uma combinação de um filtro com uma ou várias *actions*. O `fail2ban` pode lidar com diversas *jails* ao mesmo tempo.

Uma *jail* é como dar a seguinte ordem ao `fail2ban`: "bloqueie via `iptables` por 10 minutos os hosts que aparecerem 3 vezes em `/var/log/auth.log` com falha de autenticação". Nesse exemplo, bloquear via `iptables` é uma ação e a regex que casa a falha de autenticação é o filtro.

Os arquivos de configuração ficam em `/etc/fail2ban`.

```
# cd /etc/fail2ban
# ls -l
total 17
drwxr-xr-x 2 root root 1024 Jun 28 14:30 action.d
-rw-r--r-- 1 root root 859 Feb 27 2008 fail2ban.conf
drwxr-xr-x 2 root root 1024 Jun 28 14:30 filter.d
-rw-r--r-- 1 root root 6683 Jun 28 2010 jail.conf
```

Os diretórios `action.d` e `filter.d` mantêm as configurações de ações e filtros, respectivamente. Os que vêm com o pacote já devem atender à maior parte das necessidades. O arquivo `fail2ban.conf` contém configurações gerais do *daemon* `fail2ban-server`, como *path* do arquivo de *log* do `fail2ban`, *path* do arquivo socket usado para o cliente de linha de comando se comunicar com o *daemon* etc.

O arquivo `jail.conf` é o mais importante, já que configura as *jails*. No tópico abaixo será explicado como modificar uma *jail*.

## Mudando as configurações default

Na maior parte do tempo, os filtros e ações que vêm com o pacote atendem às necessidades, bastando usá-los nas suas *jails*. A única *jail* que vem ativada por padrão é a que bloqueia os hosts que tentarem logar mais de 6 vezes via SSH. Como exemplo, será mostrado como alterar o número de tentativas antes do bloqueio de 6 para 3.

Primeiramente crie uma cópia do arquivo `jail.conf` chamada `jail.local` e faça as suas modificações nesse arquivo:

```
# cp jail.conf jail.local
# vim jail.local
```

O trecho abaixo configura uma *jail* chamada `ssh`

```
[ssh]

enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 6
```

Mude para:

```
[ssh]

enabled = true
port = ssh
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
```

Faça o `fail2ban` reler os arquivos de configuração:

```
# /etc/init.d/fail2ban reload
Reloading authentication failure monitor: fail2ban.
```

Não faça as alterações diretamente em `jail.conf`. Apesar de funcionar, o arquivo pode ser sobrescrito por atualizações no pacote `fail2ban`. O `fail2ban` aplica as regras primeiro do `jail.conf` depois do `jail.local`.
