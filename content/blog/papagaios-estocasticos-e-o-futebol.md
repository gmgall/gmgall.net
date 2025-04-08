---
title: "Papagaios Estocásticos e o Futebol"
date: 2025-04-07T21:15:19-03:00
slug: papagaios-estocasticos-e-o-futebol
type: blog
draft: false
replyByEmail: true
categories:
  - non-tech
tags:
  - linguistics
  - ai
  - llm
---
Se você não tem interesse técnico no assunto ou não está cronicamente no Mastodon (culpado 🙋‍♂️), pode ser que esses *chatbots*, como o ChatGPT, ainda pareçam algo meio mágico[^2]. "Inteligência" mesmo, como tentam vender.

Só que eles são apenas [papagaios estocásticos](https://en.wikipedia.org/wiki/Stochastic_parrot), *autocompletes on steroids*. Cospem palavras numa sequência que fazem parecer que máquinas no outro lado **entendem o significado** do que estão dizendo. Não entendem.

Há um exemplo que talvez funcione bem para mostrar isso para brasileiros[^3]: esquemas táticos de futebol.

Pergunte ao GPT-4o mini algo como "Explique-me o esquema tático 4-3-3"[^1]:

> O esquema tático 4-3-3 é uma formação de futebol que utiliza quatro defensores, três meio-campistas e três atacantes. Essa formação é bastante popular e é utilizada por muitas equipes ao redor do mundo devido à sua flexibilidade e equilíbrio entre defesa e ataque. Aqui está uma explicação detalhada de cada parte da formação:
> [...]
> Em resumo, o 4-3-3 é uma formação versátil que pode ser utilizada de várias maneiras, dependendo das características dos jogadores e da estratégia do treinador.

Agora diga "Agora explique o esquema 4-4-3". Nesse ponto, até que parece existir alguma inteligência envolvida, pois ele nos corrige:

> Parece que houve um pequeno erro de digitação, pois o esquema tático mais comum é o 4-4-2, 4-3-3 ou 3-5-2, mas não existe uma formação padrão chamada 4-4-3 no futebol. No entanto, posso explicar o esquema 4-4-2, que é uma formação bastante utilizada e que pode ser confundida com o 4-4-3. [...]

Mas rapidamente essa fachada desaba. Fale "Perdão, eu me referia ao 4-3-4":

> Sem problemas! O esquema tático 4-3-4 é uma formação menos comum no futebol moderno, mas pode ser interessante em certas situações. Vamos explorar como essa formação é estruturada e suas características.
> [...]
> Em resumo, o 4-3-4 é uma formação bastante ofensiva que pode ser eficaz em situações onde a equipe precisa buscar um resultado, mas também apresenta riscos defensivos que devem ser gerenciados. É uma formação que pode ser utilizada em contextos específicos, como em jogos onde a equipe precisa marcar muitos gols.

Aqui, se você quiser muito defender o {{< strike >}}papagaio{{</ strike >}} *chatbot*, pode argumentar que ele estava considerando situações desesperadas em que o goleiro está atuando como jogador de linha.

Vamos testar essa hipótese colocando 12 jogadores de linha então. Digite "Obrigado, a 4-3-5 é ainda mais ofensiva então?":

> Sim, a formação 4-3-5 é ainda mais ofensiva do que a 4-3-4, pois adiciona mais um atacante ao esquema. No entanto, é importante notar que essa formação é bastante rara e não é comumente utilizada no futebol profissional, pois pode deixar a equipe muito vulnerável defensivamente. Vamos explorar como seria essa formação:
> [...]
> Em resumo, a formação 4-3-5 é extremamente ofensiva e pode ser utilizada em situações onde uma equipe precisa desesperadamente marcar gols, como em um jogo em que está perdendo. No entanto, devido à sua natureza arriscada, é uma formação que pode levar a resultados desastrosos se a equipe não tiver um bom controle defensivo.

Ok...

Com 13 jogadores de linha, com certeza a "inteligência" vai perceber que estamos violando as regras do esporte, não?

Mande "No caso de desespero extremo, poderia ser usada uma formação 4-3-6 então?":

> Sim, em situações de desespero extremo, como quando uma equipe precisa urgentemente marcar gols para reverter uma desvantagem significativa em um jogo, uma formação 4-3-6 poderia ser utilizada. Essa formação é ainda mais ofensiva, com quatro defensores, três meio-campistas e seis atacantes. No entanto, é importante ressaltar que essa formação é extremamente rara e praticamente nunca vista no futebol profissional, devido à sua vulnerabilidade defensiva extrema. Vamos explorar como seria essa formação:
> [...]
> Em resumo, a formação 4-3-6 é uma abordagem extremamente arriscada que poderia ser utilizada em situações desesperadoras, mas é muito improvável que seja adotada em jogos profissionais devido à sua natureza vulnerável. A maioria das equipes preferiria manter um equilíbrio mais saudável entre defesa e ataque, mesmo em situações críticas.

Err... Não.

Ok, 14 jogadores de linha agora. Fale "Supondo apenas um minuto e perdendo por 2 gols, um 4-3-7 poderia ser usado?"

> Sim, em uma situação extrema, como estar perdendo por dois gols com apenas um minuto restante, uma formação 4-3-7 poderia ser utilizada. Essa formação seria extremamente ofensiva, com quatro defensores, três meio-campistas e sete atacantes. Embora essa abordagem seja altamente arriscada e praticamente nunca vista no futebol profissional, ela poderia ser uma tentativa desesperada de marcar gols rapidamente. Vamos explorar como seria essa formação:
> [...]
> Em resumo, a formação 4-3-7 é uma abordagem extremamente arriscada que poderia ser utilizada em uma situação desesperadora, como a que você descreveu. No entanto, é importante lembrar que, na prática, essa formação é altamente improvável e não é uma estratégia viável em jogos profissionais, onde o equilíbrio entre defesa e ataque é crucial.

Não sei você, mas *essa formação é altamente improvável* me diverte.

Llama 3.3 70B vai um pouco melhor. Ao perguntar de uma formação 4-3-6, ele nos diz que seria uma quantidade impossível de jogadores em campo, mas uma 4-3-5 ainda gera uma resposta mesmo tendo o mesmo problema.

[^1]: Omiti o "miolo" da resposta porque ela é bem longa. Ela lista 5 subseções: defensores, meio-campistas, atacantes, vantagens e desvantagens. Essa estrutura foi repetida em todas as respostas, só mudando a quantidade de jogadores de acordo com a pergunta.
[^2]: 3ª [lei de Clarke](https://pt.wikipedia.org/wiki/Leis_de_Clarke).
[^3]: A gente ainda se interessa por futebol no geral? Acho que sim, né.
