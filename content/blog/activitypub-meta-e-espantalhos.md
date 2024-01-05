---
title: "ActivityPub, Meta e Espantalhos"
date: 2024-01-05T13:10:58-03:00
slug: activitypub-meta-e-espantalhos
type: blog
draft: false
comments: https://ursal.zone/@gmgall/111704291649195857
categories:
  - non-tech
tags:
  - mastodon
  - email
  - spam
  - meta
  - activitypub
---
Existem muitos textos sobre a entrada da Meta no [fediverso](https://fedi.tips/what-is-mastodon-what-is-the-fediverse/), este é mais um. Cometo este aqui na tendência que pretendo seguir de [escrever mais livremente por aqui](/blog/resolucao-para-2024/). Não tem muita revisão, foi baseado num _toot_ e nem de longe pretendo exaurir o assunto. Tem até um tom de desabafo.

Recentemente chegou um post de um administrador de instância[^3] - que respeito e geralmente gosto de ler - no agregador RSS aqui. Ele explica no texto porque a instância dele não vai desfederar a Meta por enquanto.

Vai rebatendo vários argumentos a favor da desfederação. Fala de privacidade, de anúncios e de gente que baseia sua opinião só em "não queremos eles aqui".

**Não** fala de [_embrace, extend and extinguish_](https://en.wikipedia.org/wiki/Embrace,_extend,_and_extinguish). **Não** fala do risco que uma instância gigantesca de uma _big tech_ representa para o fediverso.

Honestamente - e essa é a parte do desabafo - fico aqui matutando se nessa altura do campeonato algumas pessoas não estão simplesmente fazendo [espantalhos](https://pt.wikipedia.org/wiki/Fal%C3%A1cia_do_espantalho) dos argumentos de quem é contra as instâncias de _big techs_, para que eles pareçam mais burros ou desnecessariamente radicais.

Digo isso porque o cara veio de uma instância focada em software _open source_, ele é um administrador (ou seja, tem proficiência técnica)... Certamente ele já teve contato com argumentos mais importantes do que os que escolheu rebater. Há uma pilha de esterco no meio da sala e ele escolheu falar das cortinas.

Não vou nomear a pessoa, nem linkar para o texto porque eu posso estar cometendo uma grande injustiça. Assumir má vontade onde realmente pode existir só ignorância é horrível. Só que nesse caso específico, uma pessoa não leiga, interagindo com frequência com programadores e _sysadmins_... Fica bem limitado o espaço para ignorância.

Para não dizer que esse texto é só um resmungo...

## O risco de servidores gigantes numa federação

Percebeu que o título acima não fala em "fediverso"? Nem em "instâncias"? É porque eu não quero que você pense em [ActivityPub](https://pt.wikipedia.org/wiki/ActivityPub), Mastodon e seus amigos no momento.

Pense no serviço de e-mail e no protocolo [SMTP](https://pt.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol). É um protocolo aberto, qualquer um pode escrever softwares que "falem" SMTP, existem vários softwares livres que o implementam... Deve ser fácil entrar nessa "federação" do e-mail, né? Ter o seu próprio servidor para você, para sua família ou empresa...

Errado. Em 2024 é um inferno manter o seu próprio servidor. [Tem gente experiente desistindo](https://cfenollosa.com/blog/after-self-hosting-my-email-for-twenty-three-years-i-have-thrown-in-the-towel-the-oligopoly-has-won.html). O bom senso é usar os serviços de um _player_ maior para lidar com e-mail para você.

Por quê? Porque eles podem. Problemas de entrega de mensagens, mensagens sendo classificadas como _spam_ arbitrariamente, seu IP caindo em _blacklists_[^1]... Tudo isso rola mesmo com quem "faz tudo certo". Qual exatamente a motivação dos grandes _players_ para tratarem os servidores pequenos com equidade? Boa sorte convencendo seus usuários de que uma mensagem não chegou por culpa do Google, não sua.

**É perfeitamente possível ter um oligopólio em que o pequeno não entra mesmo com protocolos abertos.**

Citando [@prma@fosstodon.org](https://fosstodon.org/@prma) [em 27/12/2023](https://fosstodon.org/@prma/111651240157863347):

> Have you considered that when threads becomes a fact of fediverse, they will be the ones that dictate how activitypub-based federation is going to go? Most users of activitypub will be threads users and for those that post-threads activitypub users, well behaved communication with threads will become the expectation, even if the misbehaving is caused by threads. 
If you don't think so, just consider gmail and chrome as they basically dictate the norms of usage of the open standards.

Leia mais sobre os riscos que _big techs_ representam em [_How to Kill a Decentralised Network (such as the Fediverse)_](https://ploum.net/2023-06-23-how-to-kill-decentralised-networks.html). Aqui aparecem XMPP, OOXML e Kerberos... Para não dizerem que e-mail é um exemplo isolado.

## O espantalho

O autor do texto lá falou algo que ao menos tangenciou as preocupações acima? Não. Ele falou em...

### Privacidade

O Mastodon (e outras redes no fediverso) possui uma API aberta e a maior parte das coisas postadas lá são com privacidade pública. Sabemos disso. Esse não é o cerne da questão. Próxima.

### Anúncios

Todos os lados concordam que são chatos e sabemos que mostrar anúncios é fonte de renda para Meta. Esse não é o cerne da questão. Próxima.

### "Não queremos eles aqui"

Esse é talvez o mais irritante porque tenta pintar os que são a favor da desfederação como birrentos, como intransigentes incapazes de aceitar os "impuros" que vêm de redes comerciais.

Se você leu até aqui. Se entendeu o que rolou com e-mail, XMPP, OOXML... Você não pode honestamente dizer que o nosso ponto é "tira a Meta daqui porque eles são bobos, feios e cara de melão[^2]".

Você tem o direito de achar que nossas preocupações são exageradas ou que simplesmente não se aplicam ao fediverso, que o ActivityPub é um protocolo especial em alguma forma, mas não pode dizer que o que está sendo defendido é só um _gatekeeping_ besta de "não gostamos da Meta, sai daqui".

---

Bom, é o que eu tinha sobre esse assunto por hoje. Se o tom aqui pareceu mais espontâneo, é porque foi mesmo. Talvez nenhuma intenção de fazer espantalho tenha existido por parte do autor que motivou esse post, talvez eu tenha exagerado.

Infelizmente quanto mais penso nisso, mais me parece que não. Quis falar sobre.

[^1]: _Blacklists_ aliás que podem ter práticas de milícia, [cobrando por proteção](https://blog.roastidio.us/posts/spam_blacklists_are_out_of_control/).
[^2]: Quem realmente [se debruçou sobre os aspectos éticos da questão](https://erinkissane.com/untangling-threads) pode chamá-los de muito mais que "bobos e feios"...
[^3]: Não brasileira.
