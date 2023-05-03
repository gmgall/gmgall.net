---
title: "Adicionando Comentários via Mastodon em Sites Estáticos"
date: 2023-05-03T11:43:58-03:00
slug: comentarios-via-mastodon
type: blog
draft: false
comments: https://bolha.us/@gmgall/110306021306905329
categories:
  - tech
tags:
  - mastodon
  - html
  - hugo
  - javascript
---
Esse site agora possui um botão `Carregar comentários` abaixo das postagens cujos *links* anunciei no Mastodon. Ao clicar nele, as respostas ao *toot* são exibidas. Foi possível fazer isso apenas no lado do cliente com JavaScript acessando a API do Mastodon, então é uma solução para ter comentários em sites estáticos.

Essa ideia não é minha, me baseei fortemente [numa postagem de Joel Garcia](https://joelchrono12.xyz/blog/how-to-add-mastodon-comments-to-jekyll-blog/). Ele não é, porém, o [único que fez isso](https://carlschwan.eu/2020/12/29/adding-comments-to-your-static-blog-with-mastodon/). Existe também [quem faça uso de código no lado do servidor](https://dusanmitrovic.xyz/blog/post/2022-05-18/Adding-support-for-comments-through-integration-with-Mastodon).

O cerne da solução é o [seguinte método](https://docs.joinmastodon.org/methods/statuses/#context) na API do Mastodon:

```
GET /api/v1/statuses/:id/context
```

A resposta será um JSON com 2 *arrays*, um chamado `ancestors` e outro chamado `descendants`. As respostas ao *toot* estarão em `descendants`. Para *toots* públicos, não é necessário autenticação. A ideia, portanto, é ter um botão[^1] que chama uma função em JavaScript que acessa esse método e cria `div`s com os comentários abaixo de cada postagem.

## O código

Criei um [partial](https://gohugo.io/templates/partials/) chamado `comments.html` que trata dos comentários. Listo o código abaixo:

```html
{{ with .Params.comments }}
<h3>Comentários</h3>
<details>
  <summary>Responda pelo fediverso</summary>
  <p>Responda pelo fediverso colando a URL abaixo no seu cliente: <pre>{{ . }}</pre></p>
  <button onclick="navigator.clipboard.writeText('{{ . }}')">COPIAR URL</button>
</details>
<a id="load-comments">Carregar comentários</a>

<div id="comments-list"></div>
{{ $server := replaceRE `(https://.*?)/.*` "$1" . }}
{{ $toot_id := replaceRE `https://.+?/([0-9]*)$` "$1" . }}
<script src="{{ "js/purify.min.js" | relURL }}"></script>
<script>
  document.getElementById('load-comments').addEventListener('click', async () => {
    document.getElementById('load-comments').remove()
    const response = await fetch('{{ $server }}/api/v1/statuses/{{ $toot_id }}/context')
    const data = await response.json()

    if (data.descendants && data.descendants.length > 0) {
      let descendants = data.descendants
      for (let descendant of descendants) {
        document.getElementById('comments-list').appendChild(DOMPurify.sanitize(createCommentEl(descendant), { 'RETURN_DOM_FRAGMENT': true }))
      }
    } else {
      document.getElementById('comments-list').innerHTML = '<p>⚠️ Sem comentários no fediverso. ⚠️</p>'
    }
  })

  function createCommentEl(d) {
    let comment = document.createElement('div')
    comment.classList.add('comment')

    let commentHeader = document.createElement('div')
    commentHeader.classList.add('comment-header')

    let userAvatar = document.createElement('img')
    userAvatar.classList.add('avatar')
    userAvatar.setAttribute('height', 60 )
    userAvatar.setAttribute('width', 60 )
    userAvatar.setAttribute('src', d.account.avatar_static)

    let userLink = document.createElement('a')
    userLink.classList.add('user-link')
    userLink.setAttribute('href', d.account.url)
    for (let emoji of d.account.emojis) {
      d.account.display_name = d.account.display_name.replace(
        `:${emoji.shortcode}:`,
        `<img src="${emoji.static_url}" alt="${emoji.shortcode}" height="14px" width="14px" />`
        )
    }
    let serverName = d.account.url.replace(/https?:\/\/(.+)\/@.+/, '$1')
    userLink.innerHTML = d.account.display_name + " (@" + d.account.username + "@" + serverName + ")"

    let commentDateTime = document.createElement('a')
    commentDateTime.classList.add('comment-date')
    commentDateTime.setAttribute('href', d.url)
    commentDateTime.innerHTML = d.created_at.substr(0, 10).replace(/([0-9]{4})-([0-9]{2})-([0-9]{2})/, '$3/$2/$1')

    commentHeader.appendChild(userAvatar)
    commentHeader.appendChild(userLink)
    commentHeader.appendChild(commentDateTime)

    let commentContent = document.createElement('p')
    commentContent.innerHTML = d.content

    comment.appendChild(commentHeader)
    comment.appendChild(commentContent)

    return comment
  }
</script>
{{ end }}
```

É bastante parecido com o [código do Joel](https://joelchrono12.xyz/blog/how-to-add-mastodon-comments-to-jekyll-blog/#main-function), as diferenças são as seguinte:

* Na [linha 1](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L1) garanto que vai ser incluído o código do *partial* **apenas** nas páginas que fornecerem um contexto com um *link* para um *toot* numa variável `comments`. Isso é feito graças à [função `with` do Hugo](https://gohugo.io/functions/with/).

* Na [linha 6](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L6) incluo um botão para copiar o *link* para o *toot* para a área de transferência. Isso facilita para quem deseja comentar. Não é necessário selecionar e copiar o *link* manualmente. Como a [função `with`](https://gohugo.io/functions/with/) faz um *rebinding* do contexto, o *link* estará em `{{ . }}`.

* Nas [linhas 11](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L11) e [12](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L12) extraio o servidor e o `id` do *toot* do *link* para o *toot* com [*regex*](https://gohugo.io/functions/replacere/). Isso me permite construir a URL para o método `GET /api/v1/statuses/:id/context` da API do Mastodon na [linha 17](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L17). **Acho que essa é uma diferença interessante entre a minha solução e a do Joel.** A minha só precisa que cada página tenha adicionado ao seu [*front matter*](https://gohugo.io/content-management/front-matter/) uma variável `comments` com um *link* para um *toot*. A dele precisa de [3 variáveis diferentes](https://joelchrono12.xyz/blog/how-to-add-mastodon-comments-to-jekyll-blog/#jekyll-set-up).

* Na [linha 52](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L52) eu extraio o nome do servidor. O Joel não faz questão de mostrar o nome do servidor nos comentários do site dele.

* Na [linha 58](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L58) eu troco o formato da data para DD/MM/AAAA.

O resto é praticamente igual:

* Da [linha 15 à linha 28](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L15) defino uma função que falará com a API do Mastodon se o botão `Carregar comentários` for clicado.

* Da [linha 30 à linha 71](https://github.com/gmgall/gmgall.net/blob/main/layouts/partials/comments.html#L30) defino uma função que retorna uma `div` para cada item no [*array* `descendants`](https://docs.joinmastodon.org/entities/Context/#descendants).

Com o *partial* definido, bastou chamá-lo nos *layouts* das páginas em que eu desejo ativar comentários. Eu quero nos [*posts* do blog](https://github.com/gmgall/gmgall.net/commit/2c0b89bd238e1c136b4086cb1bc5c88d482d161b#diff-5942e866d871d1df37aadd5f735f37d2708ea0c3ebc753ccd1cc38a71a68e19bR19) e em cada [livro que eu postar impressões de leitura](https://github.com/gmgall/gmgall.net/commit/2c0b89bd238e1c136b4086cb1bc5c88d482d161b#diff-48079b3f67152acaf42b23c1205c876a542c5a83e2be44e4548d4a847ab54cb5R34).

## Vantagens

* Simples de implementar.

* Nada é executado no servidor, funciona para sites estáticos.

* Basta a adição de [uma variável](https://github.com/gmgall/gmgall.net/commit/996e3941cd666ece381daba209d41780a088c24d) no *front matter* para ativar os comentários.

## Desvantagens

* Se esse site se tornar acessado demais, ele pode começar a fazer mais requisições ao servidor da instância que uso do que ele suporta.

* Só tenho o *link* para *toot* que anuncia o *post* **depois** de fazer o *toot* e preciso fornecê-lo **antes** do *build* da página. Isso quer dizer ter um *toot* público com um *link* para um *post* que só estará disponível depois de uns 3 minutos. 

* Migrações entre instâncias do Mastodon carregam os perfis seguidos e os seguidores, mas ainda não os *toots*. Se eu migrar de instância, os comentários ficam "presos" na instância anterior.

## Possibilidades futuras

Posso ter um *workflow* do GitHub Actions que faz o *toot* anunciando os *posts* novos e insere os *links* para os *toots* no *front matter* para mim. Isso me pouparia o trabalho de fazer o *toot* manualmente e eliminaria o problema de ter um *toot* indicando um *post* novo enquanto o *build* do site ainda está terminando.

Não sei se vou nesse caminho. Deixaria de ser uma solução simples. O *workflow* precisaria se autenticar para fazer o *toot* por mim e seria aumentada a dependência do GitHub Actions.

[^1]: Seria possível chamar a função a cada carregamento de página, mas quero reduzir a quantidade de requisições à API da instância em que tenho conta.
