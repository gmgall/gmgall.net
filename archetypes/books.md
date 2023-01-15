---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: {{ .Name | urlize }}
type: livros
draft: false
categories:
  - default
tags:
  - default
---
Resenha aqui
