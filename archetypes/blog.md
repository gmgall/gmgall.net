---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: {{ .Name | urlize }}
type: blog
draft: false
replyByEmail: true
categories:
  - default
tags:
  - default
---
