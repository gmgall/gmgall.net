---
title: "Metaclasses em Python"
date: 2009-02-21T00:00:00-03:00
slug: metaclasses-em-python
type: blog
draft: false
categories:
  - tech
tags:
  - python
  - metaclasses
  - oo
---
## Introdução

Li dois textos interessantes no [Kodumaro](http://kodumaro.blogspot.com/) recentemente: um sobre [propriedades e acessores](http://kodumaro.blogspot.com/2009/01/propriedades.html) e outro sobre o [design pattern *singleton*](http://kodumaro.blogspot.com/2009/01/s-ingleton.html). Ambos citavam as metaclasses, um conceito novo para mim e, pelo que andei conversando, novo para muitos de meus colegas de faculdade e trabalho. O seguinte texto é resultado de minha tentativa de explicar o que são metaclasses de uma forma simples de ser assimilada por pessoas que começaram a estudar Python há pouco tempo como eu e portanto não pode ser considerado como um guia definitivo e sem erros sobre o assunto. Qualquer sugestão ou comentário é bem vindo.

## Revisando Orientação a Objetos e definindo metaclasses

Em uma linguagem de programação orientada a objetos, você pode definir classes que combinam dados (atributos) e métodos (comportamentos) que atuam sobre esses dados. Pode-se afirmar que ao definir uma classe se está definindo um domínio.

As classes geralmente atuam como modelos para a criação de instâncias de classe, que apesar de compartilharem uma mesma "forma", possuem dados diferentes. Uma instância `real` e outra `peso` de uma mesma classe `Moeda` podem possuir um atributo `cotacao`, mas cada instância terá seu próprio valor para esse atributo.

Em Python, tudo é objeto e tudo tem um tipo. Não existe diferença real entre uma classe e um tipo, especialmente depois da unificação de classes e tipos iniciada no Python 2.2. Ao definir uma classe, portanto, o programador está criando um novo tipo de dados. Como tudo é objeto, as classes também o são e possuem uma classe, um tipo. A classe de uma classe é chamada de metaclasse. O tipo *default* de uma classe é `type`.

```python
>>> class Moeda(object):
...    pass
...
>>> type(Moeda)
<type 'type'>
>>> Moeda
<class '__main__.Moeda'>
```

Ao chamar `type()` com apenas um argumento, obtém-se o tipo do objeto. Observe que o tipo da **classe** `Moeda` é `type`. Afirmar que o tipo de uma classe é `type` é o mesmo que afirmar que a sua metaclasse é `type`. O exemplo acima comprovou que as classes realmente são um objeto com um tipo.

Os conceitos apresentados até aqui são um tanto abstratos para quem aprendeu orientação a objetos em linguagens como Java e C# e para os novatos em Python. No tópico seguinte, apresento a implementação de uma classe e de uma metaclasse com dicionários, como se Python não tivesse suporte sintático para OO. Apesar de ninguém querer programar assim na prática o exemplo é extremamente útil para entender como os objetos funcionam em Python.

## Implementando classes com dicionários

O código abaixo foi originalmente postado no blog de Pedro Werneck em um post que explicava o [porquê do `self` explícito](https://web.archive.org/web/20110812155307/http://diaspar.blogspot.com/2008/11/o-porqu-do-self-explcito-ser-que-agora.html). Apesar de explicar metaclasses não ser o objetivo principal do texto, achei bastante útil para entender como o suporte a orientação a objetos foi implementado em Python. Isso acaba levando ao entendimento de vários conceitos interessantes (entre eles metaclasses) da linguagem e a uma apreciação ainda maior de sua simplicidade e consistência.

No post original, o código evoluiu aos poucos até chegar ao ponto em que está aqui. Para um entendimento pleno, [leia o post original](https://web.archive.org/web/20110812155307/http://diaspar.blogspot.com/2008/11/o-porqu-do-self-explcito-ser-que-agora.html).

A primeira parte define uma função `newClass` que recebe um nome de classe e um dicionário com seus atributos e retorna um dicionário que faz o papel das "classes" desse programa.

```python
# precisaremos usar isso logo adiante...
from functools import partial

### Agora já podemos pensar nela como a classe 'Class'
def newClass(nome, atributos):
    cls = {'nome':nome} # cria o dicionário para a classe somente com seu nome
    for k, v in atributos.items():
        # aqui se um método for o newNome, ele tem de receber a mesma
        # alteração e passar a receber 'cls' como primeiro argumento
        if k == 'new'+nome:
            v = partial(v, cls)
        # e atribuímos tudo normalmente
        cls[k] = v
    return cls
```

Em seguida, é definido uma "classe" `Pessoa` com os atributos `nome`, `nascimento` e um método `idade`.

```python
### Classe Pessoa

# construtor, corresponde ao __new__ de Python
def newPessoa(cls, nome, nascimento): # agora a classe mesmo vem aqui
    inst = {} # a nova instância
    inst['classe'] = cls # a instância tem de saber de que classe é, e
                         # agora pode saber dinamicamente

    # Agora a instância vai criar os métodos embrulhando as chamadas
    # para as funções originais em uma nova, já se incluindo nela
    for k, v in cls.items():
        # Se for função...
        if callable(v):
            # é, então vamos embrulhar...
            metodo = partial(v, inst)
            inst[k] = metodo
    inst['init'+cls['nome']](nome, nascimento)
    return inst

# inicializador, corresponde ao __init__ de Python
def initPessoa(inst, nome, nascimento):
    inst['nome'] = nome
    inst['nascimento'] = nascimento
    # assim como fazemos normalmente no __init__, aqui não precisamos
    # nos preocupar

def idade(inst, hoje):
    hd, hm, ha = hoje
    nd, nm, na = inst['nascimento']
    x = ha - na
    return x
```

Com as funções que se tornarão os métodos da classe `Pessoa` definidos, falta a última parte da definição da classe que é criar o objeto que representa a classe. Esse objeto é retornado pela função `newClass` definida no início do código.

```python
# e agora initPessoa() tem de entrar aqui também
Pessoa = newClass('Pessoa', {'newPessoa':newPessoa,
                             'initPessoa':initPessoa,
                             'idade':idade})
### Fim da definição de classe
```

A seguir, cria-se duas instâncias de `Pessoa` para testar a implementação.

```python
hank = Pessoa['newPessoa']('Hank Moody', (8, 11, 1967))
print hank['idade']((6, 11, 2008))

fante = Pessoa['newPessoa']('John Fante', (8, 4, 1909))
print fante['idade']((6, 11, 2008))
```

Nesse exemplo, a função `newClass` faz o papel de uma metaclasse, pois é ela que é chamada para criar a classe. É interessante notar que não existe diferença real entre o funcionamento de `newClass` e `newPessoa`. Ambas são funções que retornam instâncias, as instâncias retornadas por `newClass` são "classes" e as instâncias retornadas por `newPessoa` são objetos do tipo `Pessoa`.

O autor termina o texto usando as funções de inicialização e cálculo de idade com a metaclasse padrão de Python, `type`. Ela recebe uma string que será o nome da nova classe, uma tupla de classes base e um dicionário representando o *namespace* da classe. Esse dicionário contém o que você normalmente define como o corpo de uma instrução `class`. A única coisa que tem que mudar é o acesso aos atributos, que antes estavam sendo feitos como chaves de dicionários e agora devem usar a sintaxe de atributos normais.

```python
#-*- coding: utf-8 -*-
def initPessoa(inst, nome, nascimento):
        inst.nome = nome
        inst.nascimento = nascimento

def idade(inst, hoje):
        hd, hm, ha = hoje
        nd, nm, na = inst.nascimento
        x = ha - na
        return x

Pessoa = type('Pessoa', (), {'__init__':initPessoa,
                              'idade':idade})
print "Representação de Pessoa como string: ",Pessoa
print "Tipo de Pessoa (sua metaclasse): ",type(Pessoa)
print
print "Imprimindo a idade de uma instância de Pessoa para teste: "
hank = Pessoa('Hank Moody', (8, 11, 1967))
print hank.idade((6, 11, 2008))
```

Resumindo:

- Em Python tudo é objeto, inclusive classes e instâncias. Não existe diferença real entre elas.
- Criar uma classe é criar um novo tipo.
- A classe de uma classe é chamada de metaclasse. As instâncias de metaclasses são classes.
- A metaclasse *default* é `type`.
- Não existe diferença real entre métodos e funções. Os métodos são apenas funções com *namespaces* específicos (suas classes).

## Criando e definindo metaclasses

Para definir sua própria metaclasse, basta criar uma classe que herda da metaclasse `type`. O método inicializador recebe os mesmos argumentos que o método inicializador de `type`: uma string que será o nome da classe, uma tupla de classes bases e um dicionário representando o *namespace* da classe.

Segue um [exemplo ligeiramente modificado](https://web.archive.org/web/20090215011047/http://www.ibm.com/developerworks/linux/library/l-pymeta.html) de um artigo do [IBM developerWorks](https://web.archive.org/web/20090221162632/http://www.ibm.com/developerworks/). Primeiramente, vamos definir uma nova metaclasse:

```python
>>> class ChattyType(type):
...    def __new__(cls, name, bases, dct):
...       print "Alocando memória para classe", name
...       dct['usa_metaclasse']=True
...       return type.__new__(cls, name, bases, dct)
...    def __init__(cls, name, bases, dct):
...       print "Inicializando (configurando) classe", name
...       super(ChattyType, cls).__init__(name, bases, dct)
...
```

Essa metaclasse sobrescreve o método `__new__` que efetivamente é o construtor e retorna uma nova instância de classe (nesse exemplo específico, a instância retornada será uma classe por estarmos escrevendo uma **meta**classe) e o método `__init__` que é o inicializador da instância e não retorna nada. É tentador chamar o `__init__` de construtor, mas o trabalho de criação de instâncias é do `__new__`.

O código acima criou um novo tipo que imprime uma mensagem quando está sendo criado e outra quando está sendo inicializado. Definiu-se também que todas as instâncias do novo tipo terão um atributo `usa_metaclasse` com o valor inicial `True`. Essa mudança foi feita adicionando uma chave ao dicionário que representa o *namespace*  da classe (`dct`).

Com a metaclasse definida, já é possível criar classes a partir dela chamando-a como chama-se `type`:

```python
>>> X=ChattyType('X', (object,), {})
Alocando memória para classe X
Inicializando (configurando) classe X
```

Instanciar classes manualmente como feito acima, não é um procedimento muito comum. Segue como Python [determina a metaclasse](https://www.python.org/download/releases/2.2.3/descrintro/#metaclasses) de uma determinada classe:

1. Se o dicionário que representa o *namespace* da classe contiver uma chave `__metaclass__`, o seu valor é usado.

1. Senão, se existe pelo menos uma classe base, sua metaclasse é usada.

1. Senão, se existe uma variável global `__metaclass__`, seu valor é usado.

1. Senão, `types.ClassType` é usado.

A criação da classe `X` feita no exemplo acima comumente seria feita assim:

```python
>>> class X(object):
...    __metaclass__=ChattyType
...
Alocando memória para classe X
Inicializando (configurando) classe X
```

A instanciação de `ChattyType`, feita explicitamente no primeiro exemplo, agora é feita pelo interpretador Python no final da instrução `class`. Note que a instrução `class` é simplesmente [açúcar sintático](https://en.wikipedia.org/wiki/Syntactic_sugar) para a instanciação de classes através de suas metaclasses. Os programadores que não fazem uso de metaclasses acabam não percebendo isso, já que simplesmente criam suas classes usando `class` e Python simplesmente as instancia chamando `type`.

Continuando o exemplo, podemos confirmar que o tipo da classe é a metaclasse:

```python
>>> type(X)
<class '__main__.ChattyType'>
>>> y=X()
>>> type(y)
<class '__main__.X'>
>>> type(X) == type(type(y))
True
```

Para concluir, segue algumas dicas na hora de usar metaclasses:

* A modificação do dicionário que representa o *namespace* da classe deve ser feita em `__new__`, como no exemplo. Se na definição de `ChattyType`, `dct['usa_metaclasse']=True` fosse executado em `__init__`, a alteração não teria efeito. Considere o uso de [setattr](https://docs.python.org/3/library/functions.html#setattr) nesses casos.

* Sempre herde de `type`.

* `__new__` é o construtor e deve retornar uma nova instância.

* Erros em metaclasses costumam aparecer durante `import`s e definições de classes que usem metaclasses diferentes de `type`.

## Alguns exemplos

Metaclasses são usadas na maior parte do tempo para alterar o comportamento de criação e inicialização de classes. Na maioria dos casos, os usuários finais são outros programadores. Frameworks e ferramentas de mapeamento objeto-relacional são exemplos de softwares que usam metaclasses.

Alguns usos para as metaclasses:

* [Criar propriedades automaticamente](https://web.archive.org/web/20101122212629/http://www.python.org.br/wiki/UnificandoTiposClasses)
 
* [Usar o design pattern singleton de forma transparente](http://kodumaro.blogspot.com/2009/01/s-ingleton.html)
 
* [Monitorar todas as chamadas a métodos de uma classe](https://everything2.com/title/metaclass)
 
* [Fazer plugins se registrarem automaticamente em um registro comum](https://web.archive.org/web/20090405120043/http://effbot.org/zone/metaclass-plugins.htm)
 
* Verificar diversos aspectos de uma classe para garantir que a classe tenha os métodos e atributos necessários para o correto funcionamento do sistema. Isso é interessante se a aplicação pode ser estendida por plugins desenvolvidos por terceiros.

O importante é que a classe só é realmente criada na chamada final a `type` na metaclasse. Você é livre para modificar o dicionário de atributos de acordo com as suas necessidades antes disso, portanto existem muito mais possibilidades de uso para as metaclasses do que as apresentadas aqui.
