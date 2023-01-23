---
title: "Here Strings, Redirecionamentos e o builtin time"
date: 2009-01-28T00:00:00-03:00
slug: here-strings-redirecionamentos-e-o-builtin-time
type: blog
draft: false
categories:
  - tech
tags:
  - bash
  - shell script
  - shell
---
Estou fazendo um comparativo entre `gzip` e `bzip2` em seus diferentes modos de compressão (-1 a -9) e para automatizar o processo fiz um script bash que usa alguns recursos bastante interessantes, mas às vezes negligenciados, por isso vou falar sobre eles aqui.

O script basicamente compacta um determinado arquivo com o `bzip2` e o `gzip`, cada um deles usando todos os modos de compressão, mede o tempo que o compactador ficou na CPU e escreve os resultados em um arquivo de saída. O comando para compactar o arquivo é montado dinamicamente usando dois loops aninhados. Um deles, o mais externo, itera sobre a lista de modos de compressão (-1 a -9) e o outro, o mais interno, itera sobre os compactadores. No final, a linha que realmente faz a compactação e mede o tempo gasto é

```bash
TIMEC=$(bc <<< $({ time eval "$CMDC"; } 2>&1 ))
```

Onde `TIMEC` recebe o tempo de CPU gasto pelo comando de compactação e `$CMDC` contém o comando de compactação. Um valor que essa variável pode assumir durante a execução é `gzip -c -2 arquivo>arquivo.gz`, por exemplo.

Feita essa introdução, o primeiro recurso interessante que eu gostaria de apresentar é o *here strings*. O funcionamento dele é simples. Dado um comando como:

```bash
bc <<< '1+1'
```

a string `1+1` será usada para alimentar a entrada padrão de `bc`. Isso substitui a forma tradicional

```bash
echo '1+1' | bc
```

que faz a mesma coisa, mas força um [fork](https://en.wikipedia.org/wiki/Fork_(system_call)) para isso, sendo mais ineficiente.

Na linha do script que citei no início do post, o `bc` vai receber o tempo gasto em modo usuário e o tempo gasto em modo kernel separados por um sinal de adição, fazendo portanto `TIMEC` receber a soma desses valores. Aqui chegamos no segundo recurso que gostaria de citar nesse post. O builtin `time` do bash (não confundir com o comando externo `time`), pode ter sua saída formatada através do conteúdo da variável `TIMEFORMAT`. Para fazer a saída do `time` ficar no formato de uma soma, simplesmente atribuí o valor `%U+%S` à `TIMEFORMAT`. O `%U` representa o tempo gasto em modo de usuário e o `%S` o tempo gasto em modo kernel.

Exemplo:

```bash
$ time df
Sist. Arq.           1K-blocos      Usad Dispon.   Uso% Montado em
/dev/hdc3             37491624  32393072   3194048  92% /
tmpfs                   255180         0    255180   0% /dev/shm

real    0m0.061s
user    0m0.020s
sys     0m0.016s
$ TIMEFORMAT=%U+%S # Formatando a saída de time
$ time df
Sist. Arq.           1K-blocos      Usad Dispon.   Uso% Montado em
/dev/hdc3             37491624  32393072   3194048  92% /
tmpfs                   255180         0    255180   0% /dev/shm
0.020+0.008
```

Com isso, só fica faltando uma última coisa para mostrar: como redirecionar a saída do builtin `time`. A primeira coisa importante a ter em mente, é que os tempos medidos em si são jogados na `stderr`, enquanto que a `stdout` é usada para a saída do comando cujo tempo de execução é medido. Dito isso uma primeira tentativa de redirecionar a saída do `time` para um arquivo por exemplo, seria fazer simplesmente fazer algo como `time comando 2> arquivo`, mas isso não funciona. O que é redirecionado para arquivo nesse caso é a saída de erros de comando, não a do time, que continua imprimindo na tela. Exemplo:

```bash
$ time ls naoexiste 2>saida_erros

real    0m0.041s
user    0m0.036s
sys     0m0.004s
$ cat saida_erros
ls: impossível acessar naoexiste: Arquivo ou diretório não encontrado
```

A saída para isso é executar o `time` dentro de um bloco (em uma subshell também funciona, mas é ineficiente) e redirecionar a saída de erros desse bloco. Exemplo:

```bash
$ { time ls naoexiste 2>/dev/null; } 2>saida_erros
$ cat saida_erros

real    0m0.056s
user    0m0.028s
sys     0m0.004s
```

Perceba que dentro do bloco eu redirecionei a saída de erros de `ls naoexiste` para `/dev/null`, para que ela não se misturasse com a saída do `time`.

Com isso já temos toda a teoria para entender a linha que citei no início do post. Vamos desmembrá-la e revisar o que apresentei nesse post.

## Revisando

Na linha

```bash
TIMEC=$(bc <<< $({ time eval "$CMDC"; } 2>&1 ))
```

`TIMEC` vai receber a soma, feita pela calculadora `bc`, dos tempos calculados pelo builtin `time` do bash. A saída desse comando foi formatada de acordo com a variável `TIMEFORMAT` para formar uma string com uma soma do tempo gasto em modo kernel com o tempo gasto em modo de usuário (`%U+%S`).

Dentro da subshell cujo resultado alimenta a entrada padrão do `bc` o `time` precisou ser executado dentro de um bloco, para ser possível capturar o seu resultado, que vai para `stderr`. A `stdout` é usada para a saída do comando cujo tempo de execução é medido pelo `time`. A `stderr` do bloco inteiro foi conectado a `stdout`, sendo assim devidamente retornada pela subshell e usada para alimentar a entrada padrão da `bc` via *here strings*.

É isso. Quaisquer comentários são bem vindos.

## Referências

- [BashFaq: How can I redirect the output of 'time' to a variable or file?](http://mywiki.wooledge.org/BashFAQ/032)
- [Advanced Bash-Scripting Guide: I/O Redirection](https://tldp.org/LDP/abs/html/io-redirection.html)
- [Papo de Botequim: Tira Gosto](https://jneves.wordpress.com/2008/03/05/hello-world/)
- [Manpage do Bash](https://linux.die.net/man/1/bash)
