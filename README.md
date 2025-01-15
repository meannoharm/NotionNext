# Notion Next Base

A static blog system built with Next.js and the Notion API, deployed on Vercel

## Intro

This repository hosts my personal blog and portfolio website [gaotian.net](https://gaotian.net).

It uses Notion as a CMS, [notion-next-base](https://github.com/czgaotian/notion-next-base) and [Vercel](https://vercel.com).

## Features

- Setup only takes a few minutes
- Built using Next.js, TS, and React
- Automatic pretty URLs
- Automatic table of contents
- Full support for dark mode
- nobelium and material theme can choice
- Optimized for Next.js and Vercel

## Quick Start

### Deploy on Vercel with one Click

- Star this repo 😉
- Duplicate [this Notion template](https://deeply-amount-134.notion.site/14297ce5427180bcb214d8c92a8e0be8?v=14297ce54271817b9f1e000c627ec579), and share it to the public

and then, just click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fczgaotian%2Fnotion-next-base)

set following environment variables：

- `NEXT_PUBLIC_NOTION_PAGE_ID` (Required): The ID of the Notion page you previously shared to the web, usually has 32 digits after your workspace address

Other environment variables, view [here](https://github.com/czgaotian/notion-next-base/resources/environment.md)

<details><summary>Wait for a sec, what is Page ID？</summary>
  <img src="/resources/pageId.png?raw=true">
</details>

## Todo

- [ ] usage and document
- [x] config from Notion
- [x] new theme **material**
- [ ] font family management
- [ ] test

---

Forked from [tangly1024/NotionNext](https://github.com/tangly1024/NotionNext), thanks for the inspiration.
