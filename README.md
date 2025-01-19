# Notion Next Base

A static site system built with Next.js and the Notion API, deployed on Vercel

## Intro

This repository hosts my personal blog and portfolio website [gaotian.net](https://gaotian.net).

It uses Notion as a CMS, powered by [notion-next-base](https://github.com/czgaotian/notion-next-base), and deployed on [Vercel](https://vercel.com).

## Features

- Setup only takes a few minutes
- Built using Next.js, TS, and React
- Automatic pretty URLs
- Automatic table of contents
- Full support for dark mode
- nobelium and material theme can choice
- Optimized for Next.js and Vercel

## Warning

This project is actively under development. Welcome to follow its progress, provide feedback, or contribute to its development.

## Quick Start

### Deploy on Vercel with one Click

Duplicate [this Notion template](https://deeply-amount-134.notion.site/14297ce5427180bcb214d8c92a8e0be8?v=14297ce54271817b9f1e000c627ec579), and share it to the public.

Customize the `Config`, `Notice` and `HeadMenu` content in your duplicated Notion template. You can find Document for template [here](/resources/template.md).

and then, just click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fczgaotian%2Fnotion-next-base&env=EXT_PUBLIC_NOTION_PAGE_ID&envDescription=The%20ID%20of%20the%20Notion%20page%20you%20previously%20shared%20to%20the%20web%2C%20usually%20has%2032%20digits%20after%20your%20workspace%20address&envLink=https%3A%2F%2Fgithub.com%2Fczgaotian%2Fnotion-next-base%2Fresources%2Fenvironment.md)

set following environment variables:

- `NEXT_PUBLIC_NOTION_PAGE_ID` (Required): The ID of the Notion page you previously shared to the web, usually has 32 digits after your workspace address

<details><summary>Wait for a second, what is Page ID？</summary>
  <img src="/resources/pageId.png?raw=true">
</details>

Other environment variables, view [here](/resources/environment.md)

## Todo

- [ ] usage and document
- [x] config from Notion
- [x] new theme **material**
- [ ] font family management
- [ ] test
- [ ] more fine-grained i18n

---

Forked from [tangly1024/NotionNext](https://github.com/tangly1024/NotionNext), thanks for the inspiration.
