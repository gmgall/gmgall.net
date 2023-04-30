---
title: "Criando Feeds RSS Para Sites Que Não os Fornecem"
date: 2023-04-12T22:00:07-03:00
slug: criando-feeds-rss-com-newslinkrss
type: blog
draft: false
comments: https://bolha.us/@gmgall/110192034249830765
categories:
  - tech
tags:
  - rss
  - python
  - bash
  - shell
  - shell script
---
Quem usa um agregador RSS como "porta de entrada" para a *web* hoje em dia sofre com vários sites que deveriam publicar um *feed*, mas não o fazem.

Resta buscar/escrever ferramentas que usem APIs ou fazer *scraping* para gerar os *feeds*.

Muitas dessas ferramentas, como a [RSS-Bridge](https://github.com/RSS-Bridge/rss-bridge), parecem interessantes, mas nunca parei para testá-las porque elas sempre me pareceram *complicadas demais*. A RSS-Bridge, por exemplo, precisa de um servidor com PHP.

Uma ferramenta de linha de comando, fácil de instalar, que eu pudesse agendar a execução via `cron`, que recebesse as opções em texto e "jogasse" o resultado como texto na saída padrão, seria minha ferramenta ideal.

Nunca tinha encontrado uma ferramenta assim, até recentemente. Ela chama-se [newslinkrss](https://github.com/ittner/newslinkrss). Citando o README, "ele funciona como um *crawler* ou *scraper* de propósito específico".

Acho que o grande "pulo do gato" dessa ferramenta é servir como uma espécie de *framework* para criação de *feeds* RSS. Você só precisa entrar com o conhecimento específico sobre a página para a qual você está tentando criar um *feed*.

Opções para capturar/filtrar a URL de cada item do *feed* (o conteúdo de `<link>`), o corpo de cada item (o conteúdo de `<description>`), a data de cada item (o conteúdo de `<pubDate>`), o título do *feed*... Estão todas presentes.

Fica mais simples de entender com um exemplo: criarei um *feed* RSS para as cervejas em que dei *check-in* no [Untappd](https://untappd.com/). O ponto de partida é sempre a URL da página que lista os links para o que serão os `<item>`s individuais do *feed*. Essa URL é o único parâmetro posicional que o comando recebe.

Num blog, seria a URL da página com a lista dos posts. Num site de notícias, seria a URL da página principal de uma editoria qualquer. Nesse exemplo, é a URL da página do [meu perfil no Untappd](https://untappd.com/user/gmgall). Ela contém uma *timeline* com as cervejas abaixo de *Guilherme's Recent Activity*.

{{< figure src="untappd.png" alt="Um perfil do Untappd visualizado visto pela interface web." title="Meu perfil no Untappd." >}}

```bash
$ newslinkrss 'https://untappd.com/user/gmgall' -o /tmp/feed.xml
```

Estou usando a opção `-o` para gravar o *feed* resultante num arquivo em `/tmp/feed.xml`. O comportamento *default* é imprimir na saída padrão. Enquanto estou criando o *feed*, gosto de abri-lo com o Firefox para ter uma visualização melhor da estrutura.

{{< figure src="firefox_rss.png" alt="Um arquivo XML sendo visualizado pelo Firefox." title="A estrutura do feed sendo mostrada pelo Firefox."  >}}

Analisando o que temos até aqui, percebemos que o comando está generalista demais. Todo link virou um item no *feed*, até aqueles do topo da página ("Blog", "Top Rated", "Help"). Precisamos pegar só os links para os *check-ins*.

Vamos inspecionar a página do perfil para descobrirmos que padrão seguem os links para os *check-ins*. Usando a opção *Selecionar um elemento da página (Ctrl+Shift+C)* e colocando o cursor do mouse sobre os links de texto "View Detailed Check-in", percebemos que o padrão é `/user/gmgall/checkin/` seguido por um número.

{{< figure src="inspetor.png" alt="Firefox Developer Tools sendo usada para inspecionar a página de um perfil no Untappd" title="Usando DevTools para descobrir o padrão dos links que apontam para a página individual de cada check-in." >}}

A opção que usamos para capturarmos apenas os links que casam com determinada regex é `-p`.

```bash
$ newslinkrss \
	-p '.+/user/gmgall/checkin/[0-9]+' \
	'https://untappd.com/user/gmgall' \
	-o /tmp/feed.xml
```

Se abrirmos o *feed* que temos nesse ponto, veremos que cada item é um *check-in*. Outros links no perfil não viraram `<item>`s no *feed*. Exemplo de um dos itens:

```xml
<item>
	<title>Sat, 01 Apr 2023 04:26:44 +0000</title>
	<link>https://untappd.com/user/gmgall/checkin/1260790060</link>
	<description>Sat, 01 Apr 2023 04:26:44 +0000</description>
	<guid isPermaLink="true">https://untappd.com/user/gmgall/checkin/1260790060</guid>
</item>
```

Os links estão corretos, mas o título poderia ser melhor. O conteúdo de `<description>` também. Vamos usar a opção `--follow` para tentarmos capturar mais informações por item.

```bash
$ newslinkrss \
	-p '.+/user/gmgall/checkin/[0-9]+' \
	--follow \
	'https://untappd.com/user/gmgall' \
	-o /tmp/feed.xml
```

Agora cada item está como o abaixo:

```xml
<item>
	<title>Guilherme is drinking a Torobayo by Compañia Cervecera Kunstmann on Untappd</title>
	<link>https://untappd.com/user/gmgall/checkin/1260790060</link>
	<description>Guilherme is drinking a Torobayo by Compañia Cervecera Kunstmann on Untappd | UntappdLink text: Sat, 01 Apr 2023 04:26:44 +0000</description>
	<author>The Untappd Team</author>
	<guid isPermaLink="true">https://untappd.com/user/gmgall/checkin/1260790060</guid>
</item>
```

Melhorou bastante, mas tem uma melhora óbvia: capturar a data. A opção `--follow` nos dá a capacidade de capturar a data a partir da página de cada item individual com opções específicas para isso.

Vamos usar o inspetor na página de um *check-in* individual para vermos onde podemos pegar a data.

{{< figure src="inspetor2.png" alt="Firefox Developer Tools sendo usado para inspecionar a página de um check-in no Untappd." title="Inspecionando a página de um check-in no Untappd."  >}}

A data/hora do *check-in* aparece num parágrafo (elemento `p`) com a classe `time`. Podemos capturá-la via um [seletor CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS/CSS_Selectors) com a opção `--date-from-csss` (*date from CSS selector*).

Vamos também usar a opção `--log DEBUG` para vermos exatamente o que está sendo capturado como data.

```bash
$ newslinkrss \
	-p '.+/user/gmgall/checkin/[0-9]+' \
	--follow \
	--date-from-csss '.time' \
	--log DEBUG \
	'https://untappd.com/user/gmgall' \
	-o /tmp/feed.xml
```

A opção `--log DEBUG` vai imprimir linhas como a abaixo para cada item:

```bash
INFO:__main__:Following URL https://untappd.com/user/gmgall/checkin/1260790060
DEBUG:__main__:date-from-csss found candidate text: 'Sat, 01 Apr 2023 04:26:44 +0000'
DEBUG:__main__:date regex matched: src=Sat, 01 Apr 2023 04:26:44 +0000, rx=(.+), result=Sat, 01 Apr 2023 04:26:44 +0000
DEBUG:__main__:Found date from CSS Selector 2023-04-01 04:26:44+00:00
```

Nesse caso específico, já temos uma data em formato utilizável, mas raramente esse é o caso. Use `--log` quando for criar *feeds* para páginas com formatos mais complicados.

Vamos ver como está cada item no *feed* agora:

```xml
<item>
	<title>Guilherme is drinking a Torobayo by Compañia Cervecera Kunstmann on Untappd</title>
	<link>https://untappd.com/user/gmgall/checkin/1260790060</link>
	<description>Guilherme is drinking a Torobayo by Compañia Cervecera Kunstmann on Untappd | UntappdLink text: Sat, 01 Apr 2023 04:26:44 +0000</description>
	<author>The Untappd Team</author>
	<guid isPermaLink="true">https://untappd.com/user/gmgall/checkin/1260790060</guid>
	<pubDate>Sat, 01 Apr 2023 04:26:44 GMT</pubDate>
</item>
```

Nesse ponto, temos as datas de cada item (`<pubDate>` agora está presente).

Vamos melhorar o título de cada item. A parte inicial (`Guilherme is drinking a`) e a final (`on Untappd`) são redundantes. A opção `--title-regex` nos permite filtrar os títulos dos itens. Ela recebe uma regex com um grupo e o que casar dentro desse grupo se torna o novo título.

```bash
$ newslinkrss \
	-p '.+/user/gmgall/checkin/[0-9]+' \
	--follow \
	--date-from-csss '.time' \
	--log DEBUG \
	--title-regex 'Guilherme is drinking a (.+) on Untappd' \
	'https://untappd.com/user/gmgall' \
	-o /tmp/feed.xml
```

Cada item agora tem um título melhor:

```xml
<item>
	<title>Torobayo by Compañia Cervecera Kunstmann</title>
	<link>https://untappd.com/user/gmgall/checkin/1260790060</link>
	<description>Guilherme is drinking a Torobayo by Compañia Cervecera Kunstmann on Untappd | UntappdLink text: Sat, 01 Apr 2023 04:26:44 +0000</description>
	<author>The Untappd Team</author>
	<guid isPermaLink="true">https://untappd.com/user/gmgall/checkin/1260790060</guid>
	<pubDate>Sat, 01 Apr 2023 04:26:44 GMT</pubDate>
</item>
```

Precisamos agora de um corpo melhor em cada item. Atualmente em `<description>` temos apenas um texto com nome da cerveja e data/hora do *check-in*.

Vamos usar `--with-body` para incluirmos um corpo e `--body-csss` para filtrarmos o que fará parte do corpo por meio de um seletor CSS. Usando apenas `--with-body`, tudo entre `<body>` e `</body>` será incluído no corpo de cada item do *feed*. Pode ser esse o comportamento desejado para páginas mais simples, mas não é o caso do Untappd.

Inspecionando a página de cada *check-in*, descobrimos que o *card* com as informações do check-in é uma `div` com as classes `checkin-info` e `pad-it`. Podemos selecioná-la com o seletor `.checkin-info.pad-it`.

```bash
$ newslinkrss \
	-p '.+/user/gmgall/checkin/[0-9]+' \
	--follow \
	--date-from-csss '.time' \
	--log DEBUG \
	--title-regex 'Guilherme is drinking a (.+) on Untappd' \
	--with-body \
	--body-csss '.checkin-info.pad-it' \
	'https://untappd.com/user/gmgall' \
	-o /tmp/feed.xml
```

Se visualizarmos esse *feed* num agregador, temos um resultado bem satisfatório:

{{< figure src="quite_rss.png" alt="Agregador RSS exibindo o feed que acabamos de criar." title="Agregador QuiteRSS mostrando o feed que acabamos de criar nesse post."  >}}

Com o comando que gera o *feed* pronto, podemos remover a opção `--log`. Para assinarmos o *feed* criado podemos agendar a execução periódica do `newslinkrss` via `cron` e assinarmos o *feed* resultante ou então indicarmos no nosso agregador RSS que a origem é um comando.

---

Como você tem lidado com sites que não oferecem *feeds*? Conhece alguma ferramenta parecida com o `newslinkrss`? Adoraria ouvir sobre. Faça [contato](/contact/) se quiser conversar sobre isso.
