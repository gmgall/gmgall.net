---
title: "Automatizando Blogroll Com OPML"
date: 2024-01-24T20:51:04-03:00
slug: automatizando-blogroll-com-opml
type: blog
comments: https://ursal.zone/@gmgall/111819125801728163
draft: false
categories:
  - tech
tags:
  - web
  - html
  - rss
  - hugo
  - python
  - opml
  - github-actions
---
TL;DR

Gero o meu [blogroll](/blogroll/) a partir de um OPML gerado pelo meu agregador RSS. São 4 etapas:
1. Gerar o OPML no agregador.
1. Filtrar para manter apenas as categorias desejadas no OPML.
1. Escrever um *shortcode* do Hugo que renderiza o *blogroll* a partir do OPML.
1. Baixar o arquivo OPML para os diretórios corretos do Hugo antes de gerar o site.

Mais detalhes abaixo.

---
Há uma [tendência](https://liaamancio.com.br/2024/01/07/blogroll-como-no-tempo-da-internet-arte-internet-moleque/) [recente](https://www.lireo.com/bringing-back-the-blogroll/) [interessante](https://blog.cadusilva.com/blogroll) em sites pessoais e blogs: o ressurgimento dos *blogrolls*.

Acho uma ideia excelente, uma forma de [aumentar a área de superfície do *blogging*](https://tomcritchlow.com/2022/04/21/new-rss/), de fazer as pessoas descobrirem mais conteúdo em sites pessoais.

Fiz um [blogroll para chamar de meu também](/blogroll/), mas a forma como gero o meu não é manual. Como leio a Indie Web principalmente por [RSS](/tags/rss/), pensei em oferecer também um link para um arquivo [OPML](http://opml.org/) com os *feeds* dos sites no *blogroll* para que fosse possível subscrição em todos os sites de uma vez só.

Penso que essa possibilidade é uma boa para quem está conhecendo RSS só agora ou perdeu o hábito de acompanhar as atualizações dos sites por um agregador (olá, viúvas do Google Reader, tudo bem por aí? 👋).

O **1º passo** para gerar o *blogroll* seria exportar meus *feeds* num arquivo OPML. Uso o [FreshRSS](https://freshrss.org/), que tem uma [ferramenta de linha de comando](https://github.com/FreshRSS/FreshRSS/tree/edge/cli) chamada `export-opml-for-user.php` para isso.

Eu poderia usar o arquivo OPML que ela gera diretamente, mas preciso dar uma limpada legal nos *feeds* em que estou inscrito. Tem muitos sites sem atualização há anos e *feeds* quebrados ali. Pensei em só manter no OPML algumas categorias e fazer uma curadoria mais cuidadosa dessas que vou manter. Então o **2º passo** é filtrar esse arquivo OPML que o FreshRSS gera.

Isso é relativamente fácil com de fazer em [Python](https://docs.python.org/3/library/xml.etree.elementtree.html):

```python
#!/usr/bin/python3
import sys
import xml.etree.ElementTree as ET

tree = ET.parse(sys.stdin)
root = tree.getroot()
body = root.find('body')

categories = sys.argv[1:]

for category in body.findall('outline'):
    if category.attrib.get('text') not in categories:
        body.remove(category)

tree.write(sys.stdout.buffer, encoding='utf-8', xml_declaration=True)
```

O script acima lê OPML da `stdin` e escreve na `stdout` o mesmo OPML com apenas as categorias passadas como argumentos.

Então, supondo que o script acima esteja num arquivo chamado `filter_opml.py`, o comando abaixo grava em `blogroll.xml` um arquivo OPML só com as categorias `Fediverso lusófono` e `ctrl-c.club`:

```sh
./export-opml-for-user.php --user gmgall | python filter_opml.py 'Fediverso lusófono' 'ctrl-c.club' > blogroll.xml
```

Tendo esse arquivo disponível, é "fácil" consumi-lo no [Hugo](https://gohugo.io/). Ele permite guardar arquivos no diretório `data` que terão seus dados expostos nos templates, então é "só" questão de copiar meu arquivo OPML para `data` e consumi-los com algo como `{{ $body := .Site.Data.blogroll.body }}`, certo?

Sim, mas não achei intuitivo fazer isso. Saiu, mas teve alguma tentativa e erro envolvidas. A [mensagem de commit](https://github.com/gohugoio/hugo/commit/0eaaa8fee37068bfc8ecfb760f770ecc9a7af22a) na implementação dessa funcionalidade cita casos simples, em que se recupera o **conteúdo** de tags XML. O padrão OPML traz as informações quase todas como **atributos**. Você precisa usar a [função `index` do Hugo](https://gohugo.io/functions/index-function/) para acessar os atributos e eles viram chaves com nomes iniciados por `-` nos templates. Recomendo ler o que o [Wouter Groeneveld escreveu sobre](https://brainbaking.com/post/2022/01/generating-a-blogroll-with-opml-in-hugo/#hugo-and-xml-parsing). Após brigar um pouco com isso, saiu o [*shortcode*](https://gohugo.io/content-management/shortcodes/) abaixo, o **3º passo**:

```go
{{ $body := .Site.Data.blogroll.body }}
{{ range $body.outline }}
  {{- $text := index . "-text" }}
  <h2>{{ $text }}</h2>
  <ul>
    {{- range .outline }}
      {{- $feed_text := index . "-text" }}
      {{- $feed_description := index . "-description" }}
      {{- $feed_htmlUrl := index . "-htmlUrl" }}
      {{- $feed_xmlUrl := index . "-xmlUrl" }}
      <li><a href="{{ $feed_htmlUrl }}">{{ $feed_text }}</a> <a href="{{ $feed_xmlUrl }}"><img alt="O logo do RSS." src="/img/rss.svg" height="12"  width="12" style="display: inline"></a> {{ $feed_description }}</li>
    {{ end }}
  </ul>
{{ end }}
```

Esse *shortcode* quebra nos casos em que uma categoria tem um único *feed* ou caso `body` possua uma única categoria. Vi quem preferisse [transformar o OPML em JSON antes de processá-lo](https://nikdoof.com/posts/2022/automating-a-blogroll-in-hugo/#the-script) com o Hugo. Tendo enfrentado esses probleminhas, entendo a motivação.

Chamei esse *shortcode* de `blogroll` e isso me permite renderizá-lo em qualquer arquivo de conteúdo desse site com `{{</* blogroll */>}}`. Vou renderizá-lo entre 2 linhas horizontais abaixo:

---

{{< blogroll >}}

---
Falta só baixar o arquivo OPML para o diretório `data` (para que os dados fiquem disponíveis para o *shortcode* `blogroll`) e para o diretório `static` (para que ele fique disponível para download) a cada geração do site. Como uso [GitHub Actions](https://docs.github.com/en/actions), o **4º passo** é adicionar uma etapa no [workflow de geração desse site](https://github.com/gmgall/gmgall.net/blob/main/.github/workflows/gh-pages-deployment.yml) que coloca o arquivo nesses diretórios.

```yaml
- name: Download OPML for blogroll
  run: |
    wget '${{ secrets.OPML_URL }}' -O data/blogroll.xml
    cp data/blogroll.xml static/blogroll.xml
```

Isso é tudo.

E aí? Você tem um *blogroll*? Já pensou em oferecer um OPML para facilitar a inscrição em todos os *feeds* de uma vez só?
