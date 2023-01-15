---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
slug: {{ .Name | urlize }}
type: blog
draft: false
categories:
  - default
tags:
  - default
---
