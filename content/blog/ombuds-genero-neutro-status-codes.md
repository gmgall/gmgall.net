---
title: "Ombuds, Gênero Neutro e Status Codes"
date: 2024-01-18T23:27:14-03:00
slug: ombuds-genero-neutro-status-codes
type: blog
draft: false
comments: https://ursal.zone/@gmgall/111780326966847557
categories:
  - non-tech
tags:
  - linguistics
---
A [ICANN](https://en.wikipedia.org/wiki/ICANN) removeu o -man de *ombudsman*. A entidade agora chama a pessoa com esse cargo simplesmente de *ombuds*.

Parece ser uma tentativa de usar um termo de gênero neutro. O cargo na ICANN, inclusive, é [ocupado por uma mulher](https://www.icann.org/resources/pages/about-2012-02-25-en) no momento em que escrevo essas linhas.

Por que não "neutralizar" o termo com [*ombudsperson*](https://www.merriam-webster.com/dictionary/ombudsperson) ou usar um substantivo que se refira só a mulheres como [*ombudswoman*](https://www.merriam-webster.com/dictionary/ombudswoman)? Ambos aparecem no dicionário Merriam-Webster. Só *ombuds*, não.

Acontece que *ombudsman* não é um termo originalmente da língua inglesa, é da língua sueca. E parece que é um substantivo que pode se referir a pessoas que se identificam com qualquer gênero. Pelo que [testei rapidamente no Google Tradutor](https://translate.google.com.br/?sl=pt&tl=sv&text=um%20professor%0Auma%20professora%0A%0Aum%20m%C3%A9dico%0Auma%20m%C3%A9dica%0A%0Aum%20escultor%0Auma%20escultora%0A%0Aum%20artista%0Auma%20artista&op=translate), as palavras que se referem a seres humanos estão quase todas no [gênero comum](https://pt.wikipedia.org/wiki/L%C3%ADngua_sueca#2._Dois_g%C3%A9neros:_comum_e_neutro)[^2], independente do gênero em que a pessoa se classifique.

A [Folha](https://www1.folha.uol.com.br/ombudsman/2018/01/1789462-nome-da-funcao-e-comum-aos-dois-generos.shtml) já teve homens e mulheres na posição de `ombuds(man)?`[^1] e usa a forma *ombudsman* para ambos, com plural *ombudsmans*, inclusive. Nada da forma estadunidense *ombudsperson*.

A solução da ICANN me parece a mais interessante porque evita o enxerto dos sufixos -woman e -person numa palavra de um idioma que não é o inglês. Parece-me uma forma de conseguir um termo neutro sem se render a um certo colonialismo linguístico[^3] do inglês.

Porém, parece que nem a própria ICANN está muito certa de que seguirá com esse uso. Digo isso porque https://www.icann.org/ombudsman redireciona para https://www.icann.org/ombuds, mas com um [302 Found](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/302) (também conhecido como *302 Moved Temporarily* no HTTP/1.0).

```bash
$ http 'www.icann.org/ombudsman'
HTTP/1.0 302 Moved Temporarily
Connection: Keep-Alive
Content-Length: 0
Location: https://www.icann.org/ombudsman
Server: Apache
```

E não é como se eles não conhecessem o status [301 Moved Permanently](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/301), porque é o status usado para redirecionar de https://icann.org para https://www.icann.org:

```bash
$ http 'icann.org'
HTTP/1.1 301 Moved Permanently
Cache-Control: max-age=345600
Connection: Keep-Alive
Content-Length: 230
Content-Type: text/html; charset=iso-8859-1
Date: Fri, 19 Jan 2024 02:16:56 GMT
Expires: Tue, 23 Jan 2024 02:16:56 GMT
Keep-Alive: timeout=2, max=358
Location: https://www.icann.org/
Server: Apache

<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="https://www.icann.org/">here</a>.</p>
</body></html>
```

Independentemente do que seria "o mais certo" gramaticalmente, sabemos que o termo escolhido deveria ser o que {{< strike >}}irritasse mais conservadores que são contra{{</ strike >}} promovesse uma linguagem mais inclusiva. Essa questão, no entanto, não parece fechada ainda nesse caso.

[^1]: [Regex](https://aurelio.net/regex/) que casa *ombuds* e *ombudsman*
[^2]: O outro gênero é o gênero neutro. Mais sobre os gêneros neutro e comum no sueco em http://www.aprendasueco.com.br/2019/04/en-ett.html
[^3]: Sim, estou ciente de que é uma birra muito arbitrária. As línguas mudam e se influenciam mutuamente com o passar do tempo.
