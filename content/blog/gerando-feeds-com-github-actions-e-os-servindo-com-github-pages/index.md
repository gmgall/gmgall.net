---
title: "Gerando Feeds Com GitHub Actions e os Servindo Com GitHub Pages"
date: 2023-04-16T14:01:34-03:00
slug: gerando-feeds-com-github-actions-e-os-servindo-com-github-pages
type: blog
draft: false
comments: https://bolha.us/@gmgall/110210588620721950
categories:
  - tech
tags:
  - rss
  - github-actions
  - github-pages
---
Terminei o [post anterior](/blog/criando-feeds-rss-com-newslinkrss/) sobre o [newslinkrss](https://github.com/ittner/newslinkrss) falando o seguinte:

> Com o comando que gera o *feed* pronto, podemos remover a opção `--log`. Para assinarmos o *feed* criado podemos agendar a execução periódica do `newslinkrss` via `cron` e assinarmos o *feed* resultante ou então indicarmos no nosso agregador RSS que a origem é um comando.

Isso cobre 2 de 3 possibilidades de consumo dos *feeds* criados. São elas:

1) arquivo local;
2) comando e
3) URL.

A 1ª possibilidade, a de agendar o `newslinkrss` para escrever periodicamente um *feed* em `/path/para/o/feed.xml` e depois informar ao agregador que a origem do *feed* é um arquivo, não é viável caso o nosso agregador RSS seja um serviço *web* como o [Feedly](https://feedly.com/). Ele naturalmente não tem acesso ao nosso sistema de arquivos local.

A 2ª possibilidade, a de informar que a origem do *feed* é um comando, é interessante por não nos obrigar a agendar a execução periódica do `newslinkrss`, mas não são todos os agregadores que possuem essa funcionalidade.

{{< figure src="liferea.png" alt="Tela de cadastro do agregador RSS Liferea mostrando 3 fontes possíveis para o feed: URL, comando e arquivo local." title="Tela de cadastro de feed no agregador Liferea. Não são todos que permitem usar um comando como fonte." >}}

Resta a última possibilidade: gerar os *feeds*, servi-los na *web* e informar no agregador que a origem é a URL dos *feeds* gerados. Isso vai funcionar em agregadores *web*, *mobile* ou *desktop* e vai permitir que outras pessoas também cadastrem o *feed* que você criou. É a possibilidade mais versátil porque estaremos fazendo o trabalho que o dono do site **deveria ter feito, mas não fez**: servir um *feed* para o site acessível a qualquer um na *web*.

A desvantagem dessa abordagem é que nem todo mundo vai ter um servidor *web* acessível na internet e configurar um só para servir *feeds* de sites de terceiros pode ser trabalho demais. Seria ótimo uma alternativa mais simples e sugiro uma que depende apenas de termos uma conta no [GitHub](https://github.com): gerar os *feeds* com [GitHub Actions](https://docs.github.com/en/actions) e servi-los via [GitHub Pages](https://pages.github.com/).

O "estalo" veio ao pensar no [*workflow* que uso para publicar meu site](https://github.com/gmgall/gmgall.net/blob/main/.github/workflows/gh-pages-deployment.yml). Se tenho um *workflow* que executa o [Hugo](https://gohugo.io/) e faz o *deploy* dos arquivos HTML/CSS/JS/etc. gerados por ele no GitHub Pages, seria questão de pouca adaptação ter um *workflow* que executa o `newslinkrss` e faz o *deploy* dos arquivos XML gerados.

Funcionou praticamente na 1ª tentativa. O [repositório](https://github.com/gmgall/feeds) com o [script que gera os *feeds*](https://github.com/gmgall/feeds/blob/main/generate_feeds.sh) e o [*workflow* que executa o script e faz o *deploy*](https://github.com/gmgall/feeds/blob/main/.github/workflows/feeds.yml) dos arquivos é público. O script `generate_feeds.sh` é só um script Bash com uma sucessão de chamadas ao `newslinkrss`. Os arquivos gerados em são escritos em `./feeds`.

O arquivo `.github/workflows/feeds.yml` descreve um *workflow* do GitHub Actions que prepara o ambiente, executa o script `generate_feeds.sh` e faz o *deploy* dos arquivos em `./feeds` no GitHub Pages. Vou descrever o que cada trecho do arquivo faz sem muito detalhamento porque acho que é praticamente autoexplicativo. Vou me deter no processo de configuração do Pages e das chaves no final, por ser as maiores "pegadinhas" do processo.

```yml
name: Generate and deploy feeds
on:
  schedule: # Run workflow automatically
    - cron: '0 * * * *' # Runs every hour, on the hour
  workflow_dispatch:
```

O trecho acima nomeia o *workflow* e define que ele será executado em 2 situações:

* Periodicamente, a cada 1h. A sintaxe usada é a do `cron`. Se precisar de ajuda com ela, veja o assistente [crontab guru](https://crontab.guru/).
* Ao se clicar no botão **Run workflow** na página das *Actions* do repositório no GitHub. Não é estritamente necessário, mas é interessante enquanto você estiver testando. Imagine precisar esperar uma hora pela próxima execução do *workflow* só para descobrir se alguma alteração funcionou como previsto?

```yml
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v1
```

Aqui é definido que a máquina virtual (o *runner*) em que os passos seguintes serão executados usará a última versão disponível do Ubuntu Linux.

Também executa o primeiro passo: fazer *checkout* do repositório. O *runner* vai precisar usar o script `generate_feeds.sh`. Essa *action* torna o script disponível no *runner*. É como se estivéssemos fazendo `git clone` no *runner*.

```yml
    - name: Instala Python 3
      uses: actions/setup-python@v2
      with:
        python-version: 3.9

    - name: Instala newslinkrss
      run: pip3 install newslinkrss
```

Acima instalamos o Python e o `newslinkrss` via `pip`.

```yml
    - name: Cria diretório que receberá os feeds
      run: mkdir feeds
```

Acima criamos o diretório `feeds`. Lembram que `generate_feeds.sh` escreve sempre no diretório `feeds`? Com esse passo, criamos esse diretório no *runner*.

```yml
    - name: Executa newslinkrss
      run: bash generate_feeds.sh
```

Acima executamos o script `generate_feeds.sh`. O script está disponível no *runner* porque o 1º passo que fizemos foi um *checkout*.

```yml
    - name: Deploy
      uses: peaceiris/actions-gh-pages@v2
      env:
        ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_DEPLOY_KEY }}
        PUBLISH_BRANCH: gh-pages
        PUBLISH_DIR: ./feeds
```

Acima é feito o *deploy* com a *action* [`peaceiris/actions-gh-pages`](https://github.com/peaceiris/actions-gh-pages). Essa é a parte final do *workflow* e a que eu acho que merece um pouco mais de atenção **porque demanda configurações em outros locais**. Vou falar de cada variável abaixo de `env:`.

`PUBLISH_DIR` define o diretório cujo conteúdo será servido via GitHub Pages. Os *feeds* são escritos em `./feeds` no *runner* pelo script `generate_feeds.sh`.

`PUBLISH_BRANCH` define o nome do *branch* no nosso repositório que terá os arquivos servidos via GitHub Pages. Ele será um branch órfão do repositório. Não terá o script `generate_feeds.sh`, o `README.md`, o arquivo YAML que descreve o *workflow* ou qualquer outra coisa que não sejam os arquivos servidos via GitHub Pages. Aqui estamos definindo o *branch* `gh-pages`.

Certifique-se de que as configurações do seu repositório em *Settings* > *Pages* estejam como na imagem abaixo: definindo que a origem é um *branch* de nome `gh-pages`. No momento em que escrevo esse post, a URL para acessar essa configuração é https://github.com/USER/REPO/settings/pages.

{{< figure src="pages_config.png" alt="Configurações do GitHub Pages para um repositório no GitHub. As configurações mostram que o branch de origem é gh-pages." title="Configurações do GitHub Pages." >}}

`ACTIONS_DEPLOY_KEY` define um [*segredo criptografado*](https://docs.github.com/en/actions/security-guides/encrypted-secrets) de mesmo nome com a **parte privada** de um par de chaves que será usada para o [*deploy*](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys). Os segredos são configurados em *Settings* > *Secrets and variables*. No momento em que escrevo esse post, a URL é https://github.com/USER/REPO/settings/secrets/actions.

A **parte pública** deve ser configurada em *Settings* > *Deploy keys*. No momento em que escrevo esse post, a URL para essa configuração é https://github.com/USER/REPO/settings/keys.

A lógica é análoga a configurar login numa máquina remota via SSH com um par de chaves. A sua máquina local fica com a parte privada. A máquina remota fica com a parte pública.

O repositório tem uma chave pública configurada para que apenas **as máquinas com a parte privada correspondente** possam fazer *deploy* nele. Essa parte privada é usada pelos *runners* do GitHub Actions. Eles nada mais são que máquinas virtuais efêmeras, então não podemos logar nelas uma única vez e configurar a chave privada como faríamos em uma máquina qualquer que controlamos. A parte privada fica acessível aos *runners* por meio dos [segredos](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

Como configuramos ambas as partes nas configurações de um mesmo repositório, pode ficar confuso o papel de cada parte. Espero as linhas acima tenham ajudado a elucidar o papel de cada uma. Mostro como fazer na prática abaixo.

## Configurando as chaves

### Criando as chaves

A criação do par de chaves pode ser feita com um comando como o seguinte:

```bash
ssh-keygen -t rsa -b 4096 -C "$(git config user.email)" -f gh-pages -N ""
```

2 arquivos serão criados por esse comando: `gh-pages` e `gh-pages.pub`, as chaves privada e pública, respectivamente.

### Adicionando a chave pública como *deploy key*

Acesse https://github.com/USER/REPO/settings/keys, clique em *Add deploy key* e cole a **parte pública**. Lembre-se de marcar a caixa *Allow write access* e clique em *Add key*.

As configurações em *Settings* > *Deploy keys* devem ficar parecidas às da figura abaixo.

{{< figure src="deploy_keys.png" alt="Configurações das deploy keys num repositório do GitHub após a configuração de uma chave." title="Configurações das deploy keys." >}}

### Adicionando a chave privada como segredo

Acesse https://github.com/USER/REPO/settings/secrets/actions, clique no botão verde *New repository secret*, use `ACTIONS_DEPLOY_KEY` como nome, cole a **parte privada** no campo *Secret* e clique em *Add secret*.

As configurações em *Settings* > *Secrets and variables* > *Actions* devem ficar parecidas às da figura abaixo.

{{< figure src="secrets.png" alt="Configurações dos segredos criptografados num repositório do GitHub após a inserção de um segredo chamado \"ACTIONS_DEPLOY_KEY\"." title="Configurações dos segredos num repositório após a inserção de um segredo chamado ACTIONS_DEPLOY_KEY." >}}

Com o *workflow* funcionando, os *feeds* estarão disponíveis numa URL como https://USER.github.io/REPO/FILE.xml. No caso do *feed* de exemplo que fiz para o [post anterior](/blog/criando-feeds-rss-com-newslinkrss/), a URL é https://gmgall.github.io/feeds/gmgall_untappd.xml (`feeds` é o [nome do repositório](https://github.com/gmgall/feeds) e `gmgall_untappd.xml` é o [nome do arquivo gerado pelo script](https://github.com/gmgall/feeds/blob/464ddf704a3ee2d46bbc40220331b0bb27d4e767/generate_feeds.sh#L20) `generate_feeds.sh`).

---

Usa o GitHub Actions para algo parecido? Pensou em outra forma de servir os *feeds*? Seria ótimo conversar sobre isso. Entre com [contato](/contact/) se quiser trocar ideia.
