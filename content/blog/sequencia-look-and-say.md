---
title: "Sequência Look and Say em Python"
date: 2009-03-11T00:00:00-03:00
slug: sequencia-look-and-say-em-python
type: blog
draft: false
categories:
  - tech
tags:
  - python
  - functional
  - challenges
---
Tenho brincado ultimamente com os desafios do [Python Challenge](http://www.pythonchallenge.com/). São bem interessantes para quem quer aprender Python na prática. Estou resolvendo o nível 11 e já precisei [processar imagens](https://web.archive.org/web/20090309064253/http://www.pythonware.com/products/pil/), descompactar dados comprimidos com [zip](https://docs.python.org/3/library/zipfile.html) e [bz2](https://docs.python.org/3/library/bz2.html), [serializar objetos](https://docs.python.org/3/library/pickle.html), [acessar recursos via URL](https://docs.python.org/3/library/urllib.html), [usar expressões regulares](https://docs.python.org/3/library/re.html) e algumas tarefas que não exigiam necessariamente um módulo.

O último nível que resolvi tinha como resposta o [comprimento de um elemento específico](https://web.archive.org/web/20111111070626/http://oeis.org/A005341) de uma [sequência de inteiros](https://web.archive.org/web/20090303175131/http://www.research.att.com/~njas/sequences/) conhecida como [*look and say*](https://web.archive.org/web/20090304154846/http://www.research.att.com/~njas/sequences/A005150) (olhe e descreva). Achei diversas implementações da geração da sequência pela web, nenhuma delas me pareceu *pythonica* ou legível o suficiente. Resolvi juntar algumas das idéias que vi nessas implementações com os conhecimentos que obtive recentemente com a leitura de um material sobre [programação funcional em Python](https://docs.python.org/dev/howto/functional.html) e criei uma função que retorna uma lista com os elementos da sequência. A minha solução não é a mais eficiente possível ([essa página](http://www.fantascienza.net/leonardo/so/briciole_python1/) contém uma implementação alegadamente otimizada para velocidade), mas acho que é elegante e mostra alguns aspectos interessantes da linguagem. Segue o código:

```python
def look_and_say(first, elements):
    from itertools import groupby
    seq = [str(first)]

    def say(number):
        ret = []
        for k,g in groupby(number):
            ret.append( str(len(list(g))) + k )
        return ''.join(ret)

    for i in xrange(elements):
        seq.append(say(seq[-1]))
    return seq
```

O argumento `first` de `look_and_say` recebe o primeiro elemento da lista e `elements` quantos elementos depois do primeiro devem ser gerados. Exemplo de uso:

```python
>>> look_and_say(1,10)
['1', '11', '21', '1211', '111221', '312211', '13112221', '1113213211', '31131211131221', '13211311123113112211', '11131221133112132113212221']
>>> look_and_say(55,4)
['55', '25', '1215', '11121115', '31123115']
```

Dentre os aspectos que gostaria de destacar estão a possibilidade de importar partes de módulos e definir funções dentro de funções, o uso de listas para [concatenar strings com eficiência](https://web.archive.org/web/20090324052548/http://codare.net/2006/09/17/python-concatenacao-eficiente-de-strings/) e o uso de [itertools.groupby](https://docs.python.org/dev/howto/functional.html#grouping-elements) que faz um agrupamento semelhante ao do comando `uniq` do Unix, juntando elementos iguais consecutivos em um [*iterator*](https://docs.python.org/dev/howto/functional.html#iterators).

Para quem quiser uma abordagem matemática da sequência, o [Wolfram Mathworld](https://mathworld.wolfram.com/) tem uma [página sobre ela](https://mathworld.wolfram.com/LookandSaySequence.html).
