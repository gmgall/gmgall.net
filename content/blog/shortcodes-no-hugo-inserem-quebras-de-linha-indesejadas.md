---
title: "Shortcodes no Hugo Inserem Quebras de Linha Indesejadas"
date: 2023-02-08T11:57:12-03:00
slug: shortcodes-no-hugo-inserem-quebras-de-linha-indesejadas
type: blog
draft: false
categories:
  - tech
tags:
  - hugo
  - html
---
Essa já "me pegou" algumas vezes e demorei um pouco para encontrar solução, então documento aqui.

O [Hugo](https://gohugo.io/) insere quebras de linha após o conteúdo gerado pelos [shortcodes](https://gohugo.io/content-management/shortcodes/) que podem causar a renderização do HTML de forma indesejada.

Exemplo: suponha que no seu site você queira tratar das palavras sagradas protegidas pelos [Cavaleiros que Dizem Ni](https://youtu.be/0e2kaQqxmQ0). Você quer usar um *snippet* de código para inseri-las, afinal são sagradas e você não quer correr o risco de digitá-las errado.

Então cria o seguinte *shortcode* em `layouts/shortcodes/sacred_words.html`:

```go
{{ $words := slice "ni" "peng" "neee-won" }}
{{ upper (delimit $words ", " " e " ) }}
```

E usa o *shortcode* no meio do markdown em alguma página de conteúdo. Exemplo:

```markdown
Os Cavaleiros que Dizem "Ni" são os quardiões das palavras sagradas {{</* sacred_words */>}}.
```

Ao visualizar o HTML gerado para esse trecho, vê algo como:

```html
<p>Os Cavaleiros que Dizem &ldquo;Ni&rdquo; são os quardiões das palavras sagradas 
NI, PENG E NEEE-WON
.</p>
```

**Tem uma quebra de linha indesejada no final do conteúdo gerado pelo *shortcode*.** O código do *shortcode* não insere essa quebra, mas ela está lá. Isso faz esse trecho ser renderizado da seguinte forma pelos navegadores:

```
Os Cavaleiros que Dizem “Ni” são os quardiões das palavras sagradas NI, PENG E NEEE-WON .
```

**Tem um espaço entre a última palavra e o ponto final da frase**.

Encontrei {{< strike >}}as gambiarras{{< /strike >}} os *workarounds* para resolver esse problema numa [issue do próprio projeto Hugo](https://github.com/gohugoio/hugo/issues/1753), mas parece que a discussão sobre mudar esse comportamento dos *shortcodes* não andou muito. Resta-nos nos adaptar.

{{< strike >}}Uma das gambiarras{{< /strike >}}Um dos recursos técnicos é truncar o arquivo do *shortcode* com o comando `truncate -s -1 layouts/shortcodes/sacred_words.html`

Depois disso, o HTML gerado para o trecho que usa o *shortcode* fica assim:

```html
<p>Os Cavaleiros que Dizem &ldquo;Ni&rdquo; são os quardiões das palavras sagradas 
NI, PENG E NEEE-WON.</p>
```

E é renderizado da seguinte forma:

```
Os Cavaleiros que Dizem “Ni” são os quardiões das palavras sagradas NI, PENG E NEEE-WON.
```

Vitória!

Satisfeito, você decide que só falta uma coisa para o seu *shortcode* ficar perfeito: ele precisa inserir código para gerar um alerta gritando "ni" a cada vez que a página é (re)carregada. Por sorte, pouco código precisa ser adicionado para isso. O *shortcode* agora tem a seguinte implementação:

```go
{{ $words := slice "ni" "peng" "neee-won" }}
{{ upper (delimit $words ", " " e " ) }}

<script>alert('NI')</script>
```

Dessa vez você está esperto e **lembra de truncar o arquivo**. Quando vai ver a página gerada num navegador, o alerta aparece, mas...

O espaço entre a última palavra sagrada e o ponto final está lá de novo! Mesmo após usar o `truncate`! O HTML foi gerado com uma quebra de linha indesejada novamente:

```html
<p>Os Cavaleiros que Dizem &ldquo;Ni&rdquo; são os quardiões das palavras sagradas 
NI, PENG E NEEE-WON

<script>alert('NI')</script>.</p>
```

Se o seu *shortcode* vai inserir mais coisa do que a saída gerada pelos comandos da linguagem de *template* do Go, como é o trecho `<script>alert('NI')</script>.</p>` no exemplo acima, você precisa retirar aquela quebra antes do trecho também.

Isso pode ser feito deixando o shortcode assim:

```go
{{ $words := slice "ni" "peng" "neee-won" }}
{{ upper (delimit $words ", " " e " ) }}{{- print "" -}}

<script>alert('NI')</script>
```

Agora sim, as quebras de linha que fazem a página ser renderizada erradamente estão fora. O espaço antes do ponto final não aparece mais e o alerta ocorre.

---

A versão dos softwares envolvidos no momento em que escrevo esse texto são as seguintes:

```
$ go version
go version go1.19.4 linux/amd64
$ hugo version
hugo v0.109.0+extended linux/amd64 BuildDate=unknown
```
