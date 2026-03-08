import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  buildPageEntries,
  BASE_URL,
  getPageBySlug,
  filterEntriesBySection,
  urlPathToSlug,
  type PageEntry,
} from "@/lib/llms";

function buildToc(entries: PageEntry[]): string {
  const lines: string[] = ["# Documentation Table of Contents", ""];
  for (const entry of entries) {
    const url = `${BASE_URL}${entry.urlPath}`;
    lines.push(`- [${entry.title}](${url})`);
    if (entry.description?.trim()) {
      lines.push(`  - ${entry.description}`);
    }
  }
  return lines.join("\n");
}

function buildFullContent(entries: PageEntry[]): string {
  const parts: string[] = [];
  for (const entry of entries) {
    const url = `${BASE_URL}${entry.urlPath}`;
    const safeTitle = entry.title.replace(/"/g, '\\"');
    parts.push(`---
title: "${safeTitle}"
url: "${url}"
---

`);
    parts.push(
      entry.cleanContent.length > 0 ? entry.cleanContent : `# ${entry.title}`
    );
    parts.push("\n\n");
  }
  return parts.join("").trim();
}

// Zod schemas defined outside to avoid "excessively deep" type instantiation in createMcpHandler
const pageSlugSchema = z.object({ page: z.string().min(1) });
const sectionSchema = z.object({ section: z.string().min(1) });
const querySchema = z.object({ query: z.string().min(1) });

// Type assertion to avoid deep Zod/MCP type instantiation (can cause TS heap pressure)
const handler = createMcpHandler(
  (server: any) => {
    // Table of contents for the whole site (like /llms.txt)
    server.registerTool(
      "docs_toc",
      {
        title: "Docs table of contents",
        description:
          "Returns a markdown table of contents for the documentation (all pages with links and descriptions). Use this to discover available pages before fetching a specific page.",
        inputSchema: z.object({}),
      },
      async () => {
        const entries = buildPageEntries();
        return {
          content: [{ type: "text" as const, text: buildToc(entries) }],
        };
      }
    );

    // Single page by slug (e.g. "quick-start/setting-up-playroomkit")
    server.registerTool(
      "docs_page",
      {
        title: "Docs single page",
        description:
          "Returns a single page's documentation by slug. Slug is the path without leading slash, e.g. 'api-reference', 'examples/live-cursors'. Use docs_toc or docs_search first to find the correct slug.",
        inputSchema: pageSlugSchema,
      },
      async (args) => {
        const { page } = pageSlugSchema.parse(args);
        const entries = buildPageEntries();
        const found = getPageBySlug(entries, page);
        if (!found) {
          const slugs = entries.slice(0, 15).map((e) => urlPathToSlug(e.urlPath));
          return {
            content: [
              {
                type: "text" as const,
                text: `Page not found for slug "${page}". Example slugs: ${slugs.join(", ")}. Use docs_toc to see all pages.`,
              },
            ],
            isError: true,
          };
        }
        const url = `${BASE_URL}${found.urlPath}`;
        const safeTitle = found.title.replace(/"/g, '\\"');
        const text = `---
title: "${safeTitle}"
url: "${url}"
---

${found.cleanContent.length > 0 ? found.cleanContent : `# ${found.title}`}`;
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );

    // Full docs corpus (like /api/llms-full.txt)
    server.registerTool(
      "docs_full",
      {
        title: "Docs full corpus",
        description:
          "Returns the entire documentation as plain text (all pages with frontmatter). Use when you need the full context; prefer docs_toc + docs_page when you only need specific pages.",
        inputSchema: z.object({}),
      },
      async () => {
        const entries = buildPageEntries();
        return {
          content: [{ type: "text" as const, text: buildFullContent(entries) }],
        };
      }
    );

    // Table of contents for one section (e.g. "api-reference")
    server.registerTool(
      "docs_toc_section",
      {
        title: "Docs table of contents for a section",
        description:
          "Returns a markdown table of contents for one section only. Section is the path prefix, e.g. 'api-reference', 'examples'.",
        inputSchema: sectionSchema,
      },
      async (args) => {
        const { section } = sectionSchema.parse(args);
        const entries = buildPageEntries();
        const filtered = filterEntriesBySection(entries, section);
        if (filtered.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No pages found for section "${section}". Use docs_toc to see available paths.`,
              },
            ],
            isError: true,
          };
        }
        const heading = `# Table of Contents: /${section}\n\n`;
        return {
          content: [
            { type: "text" as const, text: heading + buildToc(filtered) },
          ],
        };
      }
    );

    // Full content for one section
    server.registerTool(
      "docs_full_section",
      {
        title: "Docs full content for a section",
        description:
          "Returns the full documentation for one section (all pages under that path). Section is the path prefix, e.g. 'api-reference'.",
        inputSchema: sectionSchema,
      },
      async (args) => {
        const { section } = sectionSchema.parse(args);
        const entries = buildPageEntries();
        const filtered = filterEntriesBySection(entries, section);
        if (filtered.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No pages found for section "${section}". Use docs_toc to see available paths.`,
              },
            ],
            isError: true,
          };
        }
        return {
          content: [
            { type: "text" as const, text: buildFullContent(filtered) },
          ],
        };
      }
    );

    // Search by query (title, description, content snippet)
    server.registerTool(
      "docs_search",
      {
        title: "Search docs",
        description:
          "Search documentation by keyword. Matches page titles, descriptions, and content. Returns a list of matching page slugs and titles so you can call docs_page with the right slug.",
        inputSchema: querySchema,
      },
      async (args) => {
        const { query } = querySchema.parse(args);
        const entries = buildPageEntries();
        const q = query.toLowerCase().trim();
        const matches = entries.filter((entry) => {
          if (entry.title.toLowerCase().includes(q)) return true;
          if (entry.description?.toLowerCase().includes(q)) return true;
          if (entry.cleanContent.slice(0, 800).toLowerCase().includes(q))
            return true;
          if (urlPathToSlug(entry.urlPath).toLowerCase().includes(q))
            return true;
          return false;
        });
        if (matches.length === 0) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No pages matched "${query}". Use docs_toc to see all pages.`,
              },
            ],
          };
        }
        const lines = [
          `# Search results for "${query}" (${matches.length} page(s))`,
          "",
          ...matches.map(
            (e) =>
              `- [${e.title}](${BASE_URL}${e.urlPath}) — slug: \`${urlPathToSlug(e.urlPath)}\``
          ),
        ];
        return {
          content: [{ type: "text" as const, text: lines.join("\n") }],
        };
      }
    );
  },
  {},
  {
    basePath: "/api",
    maxDuration: 60,
    verboseLogs: process.env.NODE_ENV === "development",
    disableSse: true,
  }
);

export { handler as GET, handler as POST };

