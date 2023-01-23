---
title: "Criando Seus Próprios Filtros no fail2ban - Parte 2"
date: 2011-08-01T00:00:00-03:00
slug: criando-seus-proprios-filtros-no-fail2ban-parte-2
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
Se não existe um filtro pronto para o log que você deseja monitorar em `filter.d`, será necessário criar seu próprio filtro. Mostrarei como fazer isso através do exemplo que descrevo abaixo:

## Cenário do exemplo

Mantenho um wiki [moinmoin](http://moinmo.in/) e desejo bloquear o acesso à ele pelos hosts que tentarem login por mais de 3 vezes sem sucesso. Vamos fazer um filtro para fazer esse bloqueio. O log do wiki é escrito em `/var/log/moinmoin.log`. Segue trecho desse log:

```
2011-07-12 15:45:40,447 MoinMoin.Page WARNING The page "MissingPage" could not be found. Check your underlay directory setting.
2011-07-12 15:45:44,002 MoinMoin.auth WARNING moin: performing login action | request from 192.168.0.10
2011-07-12 15:45:44,003 MoinMoin.auth WARNING moin: could not authenticate user u'GuilhermeGall' (not valid) | request from 192.168.0.10
2011-07-12 15:45:44,030 MoinMoin.Page WARNING The page "MissingPage" could not be found. Check your underlay directory setting.
2011-07-12 15:45:47,705 MoinMoin.auth WARNING moin: performing login action | request from 192.168.0.10
2011-07-12 15:45:47,706 MoinMoin.auth WARNING moin: could not authenticate user u'GuilhermeGall' (not valid) | request from 192.168.0.10
2011-07-12 15:45:47,732 MoinMoin.Page WARNING The page "MissingPage" could not be found. Check your underlay directory setting.
2011-07-12 15:55:59,473 MoinMoin.Page WARNING The page "MissingPage" could not be found. Check your underlay directory setting.
2011-07-12 16:08:51,543 MoinMoin.Page WARNING The page "MissingPage" could not be found. Check your underlay directory setting.
2011-07-13 09:09:01,908 MoinMoin.auth WARNING moin: performing login action | request from 192.168.0.7
```

Não é difícil perceber que as linhas com `could not authenticate user u'GuilhermeGall' (not valid)` representam as tentativas de login malsucedidas. Se desejamos bloquear os hosts de origem dessas tentativas temos que fazer a regex do filtro casar essas linhas e usar o IP que aparece nelas para executar nossa ação (por *default*, bloquear via `iptables`).

Antes de criar nosso filtro, vamos entender a estrutura de um filtro e como desenvolver nossas próprias regexes.

## Estrutura de um filtro

Um filtro é simplesmente um arquivo com uma entrada `failregex`, que define as regexes que casam as linhas que representam as tentativas de login malsucedidas, e uma entrada `ignoreregex`, que define regexes que casam com linhas que devem ser ignoradas. Outras entradas podem existir, como `before` que faz um “import” de outro arquivo, mas `failregex` e `ignoreregex` são as essenciais e usadas na maioria dos casos.

Se for definir mais de uma regex para `failregex` ou `ignoreregex`, coloque uma por linha. Exemplo do arquivo `filter.d/apache-auth.conf` que já vem no pacote `fail2ban`:

```
[Definition]

# Option:  failregex
# Notes.:  regex to match the password failure messages in the logfile. The
#          host must be matched by a group named "host". The tag "<HOST>" can
#          be used for standard IP/hostname matching and is only an alias for
#          (?:::f{4,6}:)?(?P<host>[\w\-.^_]+)
# Values:  TEXT
#
failregex = [[]client <HOST>[]] user .* authentication failure
            [[]client <HOST>[]] user .* not found
            [[]client <HOST>[]] user .* password mismatch

# Option:  ignoreregex
# Notes.:  regex to ignore. If this regex matches, the line is ignored.
# Values:  TEXT
#
ignoreregex =
```

Conforme pode ser lido nos comentários do arquivo acima, a tag `<HOST>` deve aparecer dentro da regex na posição onde aparece o IP/hostname do host ofensor. Repare que mais de uma regex foi definida para `failregex` – uma em cada linha – e que `ignoreregex` pode ser vazio.

## Desenvolvendo suas próprias regexes

Para escrever suas próprias regexes para o `fail2ban` é preciso ter em mente o seguinte:

- Em toda linha de uma `failregex`, a parte que casa com o IP/hostname deve estar envolta pela estrutura `(?P<host> ... )`. Essa estrutura é uma extensão específica do Python que atribui o nome `<host>` ao que foi casado pelo grupo. A tag `<host>` é como você informa ao `fail2ban` qual host estava tentando logar.

- Como conveniência, é possível usar `<HOST>` nas suas regexes, conforme citei no tópico anterior. `<HOST>` é um alias para `(?:::f{4,6}:)?(?P<host>\S+)` que casa um IP/hostname dentro de um grupo chamado `<host>`. Vide item anterior.

- Nas ações, a tag `<ip>` será substituída pelo IP do host casado pela tag `<host>`, por isso sempre deve existir um grupo nomeado `<host>`.

- Para que uma linha de um log case com sua `failregex`, ela deve casar em duas partes: o início da linha tem que casar com um padrão de *timestamp* e o restante da linha deve casar com a regex definida em `failregex`. Se sua `failregex` possui a âncora `^`, então a âncora refere-se ao início do restante da linha, após o *timestamp*.

- Por último, mas não menos importante, o comando `fail2ban-regex` permite testar suas regexes antes de criar o filtro. Na realidade, como escrever suas próprias regexes pode envolver alguma – muita! – tentativa e erro no começo, eu diria que esse é o item mais importante. 🙂 Ele pode ser usado de duas maneiras:

```
fail2ban-regex /path/para/arquivo.log '^regex a ser testada$'
```

ou

```
fail2ban-regex 'linha exemplo de log' '^regex a ser testada$'
```

## Definindo o filtro

A regex que casa com as linhas que representam as tentativas de login malsucedidas é:


```
MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from <HOST>$
```

Não é do escopo desse artigo ensinar expressões regulares. Tem muito [material bom sobre isso](https://aurelio.net/regex/) por aí, mas resumindo a expressão acima:

- `MoinMoin\.auth` casa `MoinMoin.auth`

- `DEBUG|INFO|WARNING|ERROR|CRITICAL)` casa `DEBUG`, `INFO`, `WARNING`, `ERROR` ou `CRITICAL`. Eu poderia ter casado apenas um dos níveis de severidade, mas ainda estou decidindo em qual nível reportarei as mensagens referentes à tentativas de login.

- `moin: could not authenticate user` casa `moin: could not authenticate user`

- `.*` casa *qualquer caractere em qualquer quantidade*

- `not valid\) \| request from` casa `(not valid) | request from`

- `<HOST>` casa o *IP/hostname*. É a tal tag indicativa de onde está o IP/hostname que é substituída por `(?:::f{4,6}:)?(?P<host>\S+)`

- `$` casa o *fim da linha*

Testando uma linha de exemplo do log com o `fail2ban-regex`:

```
$ fail2ban-regex '2011-07-18 14:24:42,687 MoinMoin.auth WARNING moin: could not authenticate user u'UserName' (not valid) | request from 192.168.0.27' 'MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from <HOST>$'

Running tests
=============

Use regex line : MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL)...
Use single line: 2011-07-18 14:24:42,687 MoinMoin.auth WARNING moin...

Results
=======

Failregex
|- Regular expressions:
|  [1] MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from <HOST>$
|
`- Number of matches:
   [1] 1 match(es)

Ignoreregex
|- Regular expressions:
|
`- Number of matches:

Summary
=======

Addresses found:
[1]
    192.168.0.27 (Mon Jul 18 14:24:42 2011)

Date template hits:
0 hit(s): MONTH Day Hour:Minute:Second
0 hit(s): WEEKDAY MONTH Day Hour:Minute:Second Year
0 hit(s): WEEKDAY MONTH Day Hour:Minute:Second
0 hit(s): Year/Month/Day Hour:Minute:Second
0 hit(s): Day/Month/Year Hour:Minute:Second
0 hit(s): Day/Month/Year Hour:Minute:Second
0 hit(s): Day/MONTH/Year:Hour:Minute:Second
0 hit(s): Month/Day/Year:Hour:Minute:Second
2 hit(s): Year-Month-Day Hour:Minute:Second
0 hit(s): Day-MONTH-Year Hour:Minute:Second[.Millisecond]
0 hit(s): Day-Month-Year Hour:Minute:Second
0 hit(s): TAI64N
0 hit(s): Epoch
0 hit(s): ISO 8601
0 hit(s): Hour:Minute:Second
0 hit(s): 

Success, the total number of match is 1

However, look at the above section 'Running tests' which could contain important
information.
```

Perceba que o comando mostrou a regex e o número de casamentos, além do IP encontrado abaixo de "Addresses found", indicando que a regex está correta. O número de casamentos presumivelmente seria maior que 1, se o comando fosse executado contra um arquivo de log ao invés de apenas contra uma linha de exemplo.

Vamos supor você tenha cometido um erro, como por exemplo não especificar um grupo chamado `host` na sua regex:

```
$ fail2ban-regex '2011-07-18 14:24:42,687 MoinMoin.auth WARNING moin: could not authenticate user u'UserName' (not valid) | request from 192.168.0.27' 'MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from$'

Running tests
=============

Use regex line : MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL)...
Use single line: 2011-07-18 14:24:42,687 MoinMoin.auth WARNING moin...

No 'host' group in 'MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from$'
Cannot remove regular expression. Index 0 is not valid

Results
=======

Failregex
|- Regular expressions:
|  [1] MoinMoin\.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from$
|
`- Number of matches:
   [1] 0 match(es)

Ignoreregex
|- Regular expressions:
|
`- Number of matches:

Summary
=======

Sorry, no match

Look at the above section 'Running tests' which could contain important
information.
```

Perceba que o `fail2ban-regex` informa o erro `No 'host' group in...`

Como já temos a regex funcional, crie um arquivo com o nome do filtro em `filter.d`:

```
# cd /etc/fail2ban/
# cat filter.d/moinmoin.conf
[Definition]

# Option:  failregex
# Notes.:  regex to match the password failures messages in the logfile. The
#          host must be matched by a group named "host". The tag "<HOST>" can
#          be used for standard IP/hostname matching and is only an alias for
#          (?:::f{4,6}:)?(?P<host>[\w\-.^_]+)
# Values:  TEXT
#
failregex = MoinMoin.auth (DEBUG|INFO|WARNING|ERROR|CRITICAL) moin: could not authenticate user .* \(not valid\) \| request from <HOST>$

# Option:  ignoreregex
# Notes.:  regex to ignore. If this regex matches, the line is ignored.
# Values:  TEXT
#
ignoreregex =
```

Crie uma *jail* que usa o filtro recém-criado em `jail.local`:

```
[moinmoin]

enabled = true
port = 80
filter = moinmoin
logpath = /var/log/moinmoin.log
maxretry = 3
```

A variável `filter` define o nome do filtro, que é o nome do arquivo criado em `filter.d` sem a extensão `.conf`.

Reinicie o `fail2ban` para ativar a nova *jail*:

```
# /etc/init.d/fail2ban restart
```

É interessante monitorar o log do próprio `fail2ban`, que por padrão fica em `/var/log/fail2ban.log`, para verificar se suas alterações foram aplicadas com sucesso:

```
# tail -f /var/log/fail2ban.log
2011-08-01 09:52:04,994 fail2ban.filter : INFO   Set findtime = 600
2011-08-01 09:52:04,994 fail2ban.actions: INFO   Set banTime = 600
2011-08-01 09:52:04,999 fail2ban.jail   : INFO   Creating new jail 'ssh'
2011-08-01 09:52:04,999 fail2ban.jail   : INFO   Jail 'ssh' uses poller
2011-08-01 09:52:05,000 fail2ban.filter : INFO   Added logfile = /var/log/auth.log
2011-08-01 09:52:05,001 fail2ban.filter : INFO   Set maxRetry = 3
2011-08-01 09:52:05,002 fail2ban.filter : INFO   Set findtime = 600
2011-08-01 09:52:05,002 fail2ban.actions: INFO   Set banTime = 600
2011-08-01 09:52:05,035 fail2ban.jail   : INFO   Jail 'moinmoin' started
2011-08-01 09:52:05,039 fail2ban.jail   : INFO   Jail 'ssh' started
```

As duas últimas linhas nos mostra as *jails* iniciadas. A `ssh`, que já vem configurada, e a `moinmoin`, que acabamos de configurar.
