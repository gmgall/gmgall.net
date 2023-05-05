---
title: "input_filename das ferramentas jq e yq não funcionam como esperado"
date: 2023-05-05T13:17:37-03:00
slug: input_filename-em-jq-e-yq
type: blog
draft: false
comments: https://bolha.us/@gmgall/110317050560985333
categories:
  - tech
tags:
  - json
  - rss
  - shell
  - shell-script
  - bash
---
## TL;DR

As ferramentas de linha de comando [`jq`](https://stedolan.github.io/jq/) e [`yq`](https://kislyuk.github.io/yq/) possuem uma função *builtin* chamada [`input_filename`](https://stedolan.github.io/jq/manual/#input_filename) que deveria retornar o nome do arquivo sendo filtrado. Ela não funciona como esperado.

No caso específico da `yq` é [sempre retornado `<stdin>`](https://github.com/kislyuk/yq/issues/84).  Exemplo[^1]:

```bash
$ xq 'input_filename' feeds/*xml
"<stdin>"
"<stdin>"
"<stdin>"
"<stdin>"
"<stdin>"
"<stdin>"
```

O comportamento em `jq` também me parece inesperado:

```bash
$ cat a.json 
{
  "name": "Roberpierre",
  "equipment": "guillotine"
}
$ cat b.json 
{
  "name": "Yurovsky",
  "equipment": "gun"
}
$ jq -s 'map({name, "file": input_filename})' *.json # input_filename retorna só o nome do último arquivo
[
  {
    "name": "Roberpierre",
    "file": "b.json"
  },
  {
    "name": "Yurovsky",
    "file": "b.json"
  }
]
```

## Como esse comportamento "me pegou"

Já expliquei [aqui](/blog/gerando-feeds-com-github-actions-e-os-servindo-com-github-pages/) que possuo [um repositório com *feeds* RSS](https://github.com/gmgall/feeds) para sites que não fornecem os seus próprios. Hoje não está listado em lugar nenhum para que sites gero *feeds*. A única forma de ver isso, é listar o [*branch* `gh-pages` desse repositório](https://github.com/gmgall/feeds/tree/gh-pages). Sabendo o nome do arquivo, você sabe que a URL para o *feed* é `https://gmgall.github.io/feeds/NOME_DO_ARQUIVO.xml`.

Pensei em gerar um arquivo JSON com algumas metainformações de cada *feed*. Pretendo usá-lo mais tarde para listar os *feeds* disponíveis tanto [aqui](https://gmgall.net/feeds) quanto em outros lugares.

Queria um arquivo no formato seguinte[^2]:

```JSON
[
  {
    "title": "Diário de Petrópolis",
    "link": "https://www.diariodepetropolis.com.br/",
    "description": "(Edição online) Últimas notícias, artigos e classificados da cidade.",
    "feed": "https://gmgall.github.io/feeds/diario_de_petropolis.xml"
  },
  {
    "title": "NFL na ESPN - Resultados, vídeos e estatísticas",
    "link": "https://www.espn.com.br/nfl",
    "description": "Acesse ESPN para placares ao vivo da NFL, melhores momentos e notícias. Assista à NFL pela ESPN no Star+",
    "feed": "https://gmgall.github.io/feeds/espn_nfl.xml"
  }
]
```

`title`, `link` e `description` são informações [requeridas nos *feeds* RSS](https://validator.w3.org/feed/docs/rss2.html#requiredChannelElements).

Minha linha de raciocínio então foi a seguinte:

* Conheço um pouco dos filtros do `jq`. Sei que existe [`map(x)`](https://stedolan.github.io/jq/manual/#map(x),map_values(x)), que aplica o filtro a cada elemento do *array* de entrada.

* Sei que posso processar mais de um arquivo com a opção `-s`, que coloca o conteúdo dos arquivos num *array* único, cada elemento com o conteúdo de um arquivo.

* `xq` é só um *wrapper* para o `jq`. Então bastaria processar meus *feeds* (XML) com `xq` da mesma forma que faria se fossem arquivos JSON. A saída vai ser em JSON, o que vai facilitar bastante.

Como citei acima, 3 das 4 propriedades que quero no meu JSON são requeridas pelo padrão RSS. Seria questão de gerar um objeto só com elas para cada elemento do *array* que estará disponível por conta da opção de linha de comando `-s`.

```bash
$ xq -s 'map({"title": .rss.channel.title, "link": .rss.channel.link, "description": .rss.channel.description })' feeds/*xml
[
  {
    "title": "Diário de Petrópolis",
    "link": "https://www.diariodepetropolis.com.br/",
    "description": "(Edição online) Últimas notícias, artigos e classificados da cidade."
  },
  {
    "title": "NFL na ESPN - Resultados, vídeos e estatísticas",
    "link": "https://www.espn.com.br/nfl",
    "description": "Acesse ESPN para placares ao vivo da NFL, melhores momentos e notícias. Assista à NFL pela ESPN no Star+"
  }
]
```

Perfeito! A propriedade que falta, `feed`, deve ser bem fácil de adicionar, certo? Eu gero os *feeds* num diretório de nome `feeds`. Basta cada objeto ter uma propriedade cujo valor será a *string* `https://gmgall.github.io/` + uma *string* com *path* do arquivo. Ainda bem que existe `input_filename`, vai ser um *one-liner*. 😎 

Vamos testar antes só com o nome do arquivo:

```bash
$ xq -s 'map({"title": .rss.channel.title, "link": .rss.channel.link, "description": .rss.channel.description, "feed": input_filename})' feeds/*xml
[
  {
    "title": "Diário de Petrópolis",
    "link": "https://www.diariodepetropolis.com.br/",
    "description": "(Edição online) Últimas notícias, artigos e classificados da cidade.",
    "feed": "<stdin>"
  },
  {
    "title": "NFL na ESPN - Resultados, vídeos e estatísticas",
    "link": "https://www.espn.com.br/nfl",
    "description": "Acesse ESPN para placares ao vivo da NFL, melhores momentos e notícias. Assista à NFL pela ESPN no Star+",
    "feed": "<stdin>"
  }
]
```

Fuén. 🤡 

Como resolvi no fim das contas?

Para evitar instalar mais coisas no *runner* que gera os *feeds* e para evitar ler os XMLs e "montar" o JSON "na mão", quis continuar com a suíte `yq`.

O sonho do *one-liner* morreu:

```bash
for feed in feeds/*; do
  xq --arg feed_url "https://gmgall.github.io/$feed" '{"title": .rss.channel.title, "link": .rss.channel.link, "description": .rss.channel.description, "feed": $feed_url}' "$feed"
done | jq -s > ./feeds/feeds.json
```

O que acabei fazendo foi chamar o `xq` para cada arquivo XML para gerar cada objeto dentro de um laço **do shell** e só no fim junto tudo com `jq -s`.

`--arg` permitiu injetar uma propriedade com o valor `https://gmgall.github.io/` + *path* do arquivo.

Funciona. Estou orgulhoso?

![Mais ou menos...](https://i.makeagif.com/media/9-25-2017/XOax9n.gif)

[^1]: Uso o comando `xq` que faz parte da suíte `yq`, que são ambos *wrappers* para o `jq`.
[^2]: Gero mais que 2 *feeds* no momento em que escrevo esse texto. Estou listando apenas 2 por brevidade.
