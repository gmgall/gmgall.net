---
title: "Linguagens Declarativas e o Nosso Cérebro"
date: 2025-02-03T11:53:02-03:00
slug: linguagens-declarativas-e-o-nosso-cerebro
type: blog
draft: false
replyByEmail: true
comments: https://ursal.zone/@gmgall/113941072347867957
categories:
  - non-tech
  - tech
tags:
  - sql
  - linguistics
  - psychology
---

Recebi o meme abaixo num grupo daquele mensageiro instantâneo praticamente impossível de se livrar se você mora no Brasil.

{{< figure src="meme.jpeg" alt="Uma pessoa desesperada com uma query SQL que inadvertidamente apagou todas as linhas de uma tabela ao invés das 2 pretendidas." title="Ops... Deveria ter iniciado uma transação." >}}

A imagem mostra uma pessoa desesperada com o resultado de um comando SQL. A intenção era apagar as linhas nas quais a coluna `id` tivesse o valor `23` ou o valor `22`, mas ela apagou todas as 224 linhas da tabela. O prompt que aparece no meme é o seguinte:

```sql
mysql> delete from drby where id = 23 or 22;
Query OK, 224 rows affected (0,03 sec)

mysql> select * from drby;
Empty set (0,02 sec)
```

A pessoa, sem querer, escreveu uma condição que sempre é verdadeira após a cláusula `WHERE`.

_Ok, qual é o seu ponto, Guilherme?_

Então, meu ponto é que eu tive a sensação de ter demorado um segundinho a mais para captar o que rolou ali. Parece que levei mais tempo do que levaria se eu tivesse lido `if (id == 23 or 22)` num código fonte numa linguagem de programação imperativa qualquer.

Isso me lembrou de 2 situações em que me pediram para ter atenção com o tipo de bug acima:
* Uma aula em vídeo recente de revisão de SQL para concursos. O próprio professor também se confundiu com uma questão que comentava em certo ponto.
* Longínquas aulas de banco de dados da faculdade.

Bom, se é um ponto de ênfase ao ensinar SQL, gerou meme e eu mesmo achei que demorei mais do que "deveria"[^1] para entender, suponho que seja mais fácil de cometer esse erro em SQL do que é numa linguagem imperativa qualquer.

Eu, pelo menos, nunca vi memes sobre isso, nem lembro disso ter sido ênfase em aulas de programação. Entendemos muito cedo que a maior parte das linguagens avaliaria `22` como verdadeiro e deixamos de cometer o erro.

Isso me botou para conjecturar sobre o motivo disso. Meu chute é que em linguagens imperativas não acontece tanto porque a gente liga um modo de "dar a mão pro interpretador/compilador e ensiná-lo" na nossa cabeça.

A gente desliga esse modo ao usar uma linguagem declarativa porque passa a "falar" com o computador como se estivesse falando com uma pessoa. Tendemos a nos aproximar de uma linguagem natural.

Falar para um amigo "me trás da estante os livros com capa vermelha ou verde" é uma construção possível quando não estamos preocupados em **como** nosso amigo vai pegar os livros. Só descrevemos o resultado desejado assim como só descrevemos características das linhas que queremos numa query SQL. A gente não está pensando que primeiro tem que ir num índice, que pode existir uma B-tree por trás, nada disso.

A sensação de vocês é a mesma (a de que é mais fácil cometer esse tipo de erro em linguagens declarativas)? Faz sentido esse texto? Existe algum material interessante que fale sobre como nosso cérebro funciona usando linguagens de um paradigma vs os outros? Algum tipo de comparação da taxa de bugs por paradigmas?

Parece que há uma interseção bacana entre linguística, computação e psicologia aí. Gostaria de saber mais sobre. 🙂

[^1]: Não use "deveria" para se pressionar. Faz mal para a cachola: https://youtu.be/PeF-mIrYIIU
