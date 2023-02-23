---
title: "Acompanhando Suas Inscrições no YouTube por RSS"
date: 2023-02-23T15:01:04-03:00
slug: acompanhando-suas-inscricoes-no-youtube-por-rss
type: blog
draft: false
categories:
  - tech
tags:
  - rss
  - youtube
  - opml
---
TL;DR. Escrevi uma ferramenta que converte um CSV com suas inscrições no YouTube em um arquivo [OPML](http://opml.org/) com os *feeds* RSS dos canais. Esse arquivo OPML é importável em quase todos os agregadores RSS. Use o conversor em https://yt2opml.gmgall.net/

Com FreshRSS + extensões, não é necessário nem sair do agregador para assistir aos vídeos.

------

Procurei colocar RSS de volta na minha vida desde a [debacle do Twitter](/blog/tchau-twitter).

Sempre fui fã do padrão RSS. Acho que é a melhor forma de consumo de conteúdo na *web*. Hoje, é mais importante do que nunca, já que dá liberdade ao usuário de desviar das diversas formas pelas quais [a *web* se tornou uma merda](https://thewebisfucked.com/).

Só que eu era uma das folclóricas viúvas do [Google Reader](https://pt.wikipedia.org/wiki/Google_Reader). Não tinha me adaptado bem a nenhum outro agregador depois dele. Tentei usar vários, mas nunca parava com nenhum. O que usei por mais tempo depois do Reader foi o [Feedly](https://feedly.com/), mas ele nunca virou meu "ponto central" de consumo da *web* como o Reader foi.

{{< figure src="viuva_google_reader_23-02-2023.png" title="Toda viúva do Google Reader desde 2013." alt="Print de tweet com texto \"Eu trocaria fácil todas as minhas redes sociais pelo Google Reader\"." >}}

Então fui mantendo o Twitter como "agregador". Junta isso com o fato de estarem lá várias pessoas que eu gosto e a comodidade falou mais alto. Meu "ponto central" virou o Twitter.

O novo senhor feudal do Twitter ser um [déspota](https://www.platformer.news/p/yes-elon-musk-created-a-special-system) [mimado](https://arstechnica.com/tech-policy/2023/02/musk-fired-top-engineer-for-explaining-why-his-tweets-views-are-down/) me colocou para procurar, mais uma vez, um agregador que pudesse usar rotineiramente.

Estou feliz em dizer que parece que a busca terminou. Estou usando o [FreshRSS](https://freshrss.org/) há uns 15 dias e estou bem satisfeito.

Minha "dieta de informações" melhorou demais. Já não fico tão ansioso com o *doomscrolling* na *timeline* do Twitter ou lendo a última polêmica de política que chegou aos *trending topics*. Estou lendo textos mais longos, sem um algoritmo no caminho.

Foi apenas natural que eu quisesse consumir **tudo** via RSS, não apenas texto. O próximo candidato óbvio era o YouTube. Com frequência eu abro o *app* e vejo alguma coisa indicada na *home* ou então entro numa sequência de *Shorts* que me fazem gastar um tempão neles enquanto os vídeos dos canais em que sou inscrito mesmo vão ficando para depois.

Minha intuição é que a Google não ia deixar os canais com *feeds* RSS, justamente para forçar a visita ao site. Fico feliz de estar errado. Todo canal tem um *feed* (por enquanto?), só é uma funcionalidade um pouco "escondida".

Os canais no YouTube têm um *Channel ID* único e a URL dos canais seguem o formato `https://www.youtube.com/channel/ID`.  O feed fica em `https://www.youtube.com/feeds/videos.xml?channel_id=ID`. Usando como exemplo o canal [Tese Onze](https://www.youtube.com/@TeseOnze), temos:

* URL do canal: http://www.youtube.com/channel/UC0fGGprihDIlQ3ykWvcb9hg
* URL do *feed* RSS: https://www.youtube.com/feeds/videos.xml?channel_id=UC0fGGprihDIlQ3ykWvcb9hg

O problema é que ninguém divulga a URL do seu canal nesse formato. Em geral se usa o formato mais amigável https://www.youtube.com/@TeseOnze.

Então, quem quer acompanhar via RSS os vídeos de suas inscrições no YouTube precisa:

* obter uma lista dos IDs de todos os canais em que é inscrito;
* gerar uma lista das URLs dos *feeds*;
* importar todos os *feeds* da lista no agregador.

O formato usado no mundo RSS para importar/exportar listas de *feeds* é o [OPML](http://opml.org/), baseado em XML.

Segue um exemplo de OPML:

```XML
<?xml version="1.0" encoding="ISO-8859-1"?>
<opml version="2.0">
	<head>
		<title>mySubscriptions.opml</title>
		<dateCreated>Sat, 18 Jun 2005 12:11:52 GMT</dateCreated>
		</head>
	<body>
		<outline text="Yahoo! News: Technology" description="Technology" htmlUrl="http://news.yahoo.com/news?tmpl=index&amp;cid=738" language="unknown" title="Yahoo! News: Technology" type="rss" version="RSS2" xmlUrl="http://rss.news.yahoo.com/rss/tech"/>
		</body>
</opml>
```

O padrão OPML é quase autoexplicativo: é simplesmente um elemento `<opml>` com 2 elementos obrigatórios: `<head>` e `<outline>`.

Dentro do 1º vão metainformações do arquivo.

Dentro do 2º vai a lista dos *feeds* em si, cada um dentro de um `<outline>`. Os `<outlines>`s podem ser aninhados (caso se deseje colocar *feeds* dentro de uma categoria, por exemplo) e claro que uma lista típica vai trazer mais de um *feed*, mas a intenção aqui é só mostrar o formato. O atributo chave para a gente aqui é o `xmlUrl`, que é o endereço do *feed*.

Nós já sabemos o formato usado para importação de *feeds* e como formar a URL de um *feed* de um canal no YouTube a partir do seu ID.

Só precisamos obter a lista dos IDs dos canais agora.

O [Google Takeout](https://takeout.google.com/) é uma forma de fazer download de todos os registros que a Google possui de um usuário. Basta não esquecer de marcar o YouTube que o arquivo resultante vai conter uma lista de inscrições em `Takeout/YouTube and YouTube Music/subscriptions/subscriptions.csv`.

O formato é bem simples, é um CSV de 3 colunas:

```
Channel ID,Channel URL,Channel title
UC0fGGprihDIlQ3ykWvcb9hg,http://www.youtube.com/channel/UC0fGGprihDIlQ3ykWvcb9hg,Tese Onze
```

Se você é como eu, pensou logo em fazer um *shell script* que para cada linha do CSV:

* concatena `https://www.youtube.com/feeds/videos.xml?channel_id=` com os valores da 1ª coluna;

* joga o valor resultante dentro de um `<outline>`, numa propriedade `xmlURL`.

Provavelmente funcionaria, mas decidi não [correr](https://stackoverflow.com/questions/3034611/whats-so-bad-about-building-xml-with-string-concatenation) com [tesouras](https://news.ycombinator.com/item?id=16915823) dessa vez e usei pacotes JavaScript próprios para processar [CSV](https://d3js.org/) e [OPML](https://github.com/scripting/opmlPackage).

Se quiser usar no seu navegador, acesse: https://yt2opml.gmgall.net/

Tudo é 100% feito no lado do cliente. O [código](https://github.com/gmgall/YTtoOPML) é de um *backender*, então as manipulações do DOM provavelmente poderiam ser mais elegantes, mas funciona.

Com o arquivo OPML gerado, foi só importá-lo no FreshRSS. Uma possibilidade **muito interessante** nele é a instalação de uma [extensão](https://github.com/kevinpapst/freshrss-youtube) que incorpora os vídeos dentro. Assim, não é necessário sair do agregador para assistir aos vídeos. Mostrei como fica no vídeo abaixo.

{{< youtube id="FwTSpqo4Ucw" title="FreshRSS com extensão pra embutir vídeos do YouTube ativada." >}}

Bem prático, não?
