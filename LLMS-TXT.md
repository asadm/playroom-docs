# llms.txt Implementation

This documentation site supports two LLM-optimized formats: **llms.txt** (index only) and **llms-full.txt** (full content for every page).

## llms.txt vs llms-full.txt

| | llms.txt | llms-full.txt |
|---|----------|----------------|
| **Content** | Table of contents only: every page as a link + short description | Full markdown body for every page |
| **Use case** | Overview and navigation for LLMs; copyable index | Complete docs for context; source for Copy Markdown |

- **llms.txt** = single index document. One flat list: `- [Title](url)` with `  - description` under each. No full page bodies.
- **llms-full.txt** = every page's full cleaned markdown, with `title` and `url` in frontmatter per section.

## Access

- **llms.txt** (main index): **`/llms.txt`** — table of contents for whole site (also `/api/llms.txt`)
- **llms.txt** (per-route): **`/:section/llms.txt`** — table of contents for that section only, e.g. `/api-reference/llms.txt`, `/setup/llms.txt`
- **llms-full.txt**: full content at `/api/llms-full.txt` (whole site) or `/:section/llms-full.txt` (that section only)

## Features

- **Automatic generation** from all MDX files in `pages/`
- **Descriptions** from frontmatter `description` or first line of content
- **Copy Markdown**: On the **homepage** (`/`), copies the **llms.txt** index. On other pages, copies the raw MDX via **`/api/get-markdown`**.

## Implementation

- **`lib/llms.ts`**: Shared helpers to scan pages, add description, and clean content.
- **`pages/api/llms.txt.ts`**: Builds the index-only llms.txt (table of contents).
- **`pages/api/llms-full.txt.ts`**: Builds the full llms-full.txt (every page's full content with frontmatter).
- **Copy Markdown button**: On `/` fetches and copies `/api/llms.txt`. On other pages fetches `/api/get-markdown?path=...` and copies the raw MDX content.

## Format

### llms.txt (index)

```
# Documentation Table of Contents

- [Introduction](https://docs.joinplayroom.com/)
  - Build multiplayer games in minutes.
- [Quick Start](https://docs.joinplayroom.com/setup)
  - Get started with Playroom Kit.
...
```

### llms-full.txt (section example)

```
---
title: "Live Cursors"
url: "https://docs.joinplayroom.com/examples/live-cursors"
---

# Live Cursors

Full page content here...
```

## Maintenance

Both files are generated on demand; no manual updates are needed when docs change.

## MCP Server

The same content is exposed via an **MCP (Model Context Protocol)** server at `/api/mcp`, so AI agents can call tools (`docs_toc`, `docs_page`, `docs_full`, `docs_toc_section`, `docs_full_section`, `docs_search`) instead of fetching URLs. See [MCP Server](/mcp) in the docs and `app/api/[transport]/route.ts` for implementation.
