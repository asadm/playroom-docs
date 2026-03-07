import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const PAGES_DIR = path.join(process.cwd(), 'pages');

export type PageEntry = {
  filePath: string;
  urlPath: string;
  title: string;
  description: string;
  content: string;
  cleanContent: string;
  isIndex: boolean;
  children: PageEntry[];
};

function getAllMdxFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'api') {
        getAllMdxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function getUrlPath(filePath: string, pagesDir: string): string {
  const relativePath = path.relative(pagesDir, filePath);
  let urlPath = relativePath
    .replace(/\\/g, '/')
    .replace(/\.mdx?$/, '')
    .replace(/\/index$/, '');
  if (urlPath === 'index' || urlPath === '') return '/';
  return `/${urlPath}`;
}

function cleanContent(content: string): string {
  return content
    .replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '')
    .replace(/export\s+.*?;?\s*$/gm, '')
    .replace(/<[^>]+>/g, '')
    .replace(/^\s*;\s*$/gm, '') // drop lines that are only semicolons (leftover from stripped imports)
    .replace(/\n{3,}/g, '\n\n')   // collapse excessive newlines
    .trim();
}

/** Treat empty, ";", or punctuation-only as no description. */
function toMeaningfulDescription(s: string): string {
  const t = s.trim();
  if (!t) return '';
  if (t === ';' || t === ':' || t === '-' || t === '–' || t === '—') return '';
  if (/^[;\-:.,\s]+$/i.test(t)) return '';
  return t;
}

/** Build all page entries and mark index pages (pages that have direct children). */
export function buildPageEntries(): PageEntry[] {
  const mdxFiles = getAllMdxFiles(PAGES_DIR);
  const entries: PageEntry[] = [];

  for (const filePath of mdxFiles) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    const urlPath = getUrlPath(filePath, PAGES_DIR);
    const title = data.title || path.basename(filePath, path.extname(filePath));
    const rawClean = cleanContent(content);
    const descFromContent = rawClean.split(/\n/)[0]?.replace(/^#+\s*/, '').slice(0, 200).trim() || '';
    const rawDesc = (data.description as string) || descFromContent || '';
    const description = toMeaningfulDescription(rawDesc);
    entries.push({
      filePath,
      urlPath,
      title,
      description,
      content,
      cleanContent: rawClean,
      isIndex: false,
      children: [],
    });
  }

  // Sort by URL for stable order
  entries.sort((a, b) => a.urlPath.localeCompare(b.urlPath));

  // Mark index pages: has at least one direct child (same prefix, one path segment deeper)
  function isDirectChild(parentPath: string, childPath: string): boolean {
    if (childPath === parentPath || !childPath.startsWith(parentPath + '/')) return false;
    const suffix = childPath.slice(parentPath.length + 1);
    return suffix.indexOf('/') === -1;
  }

  for (const entry of entries) {
    const directChildren = entries.filter((e) => isDirectChild(entry.urlPath, e.urlPath));
    entry.isIndex = directChildren.length > 0;
    entry.children = directChildren;
  }

  return entries;
}

export const BASE_URL = 'https://docs.joinplayroom.com';

/** Get slug from urlPath (e.g. "/examples/live-cursors" -> "examples/live-cursors"). */
export function urlPathToSlug(urlPath: string): string {
  return urlPath.replace(/^\/+/, '').trim() || '';
}

/** Find a single page by slug (e.g. "quick-start/setting-up-playroomkit" or "api-reference"). */
export function getPageBySlug(entries: PageEntry[], slug: string): PageEntry | undefined {
  const normalized = slug.replace(/^\/+/, '').trim();
  const path = normalized ? `/${normalized}` : '/';
  return entries.find((e) => e.urlPath === path);
}

/** Filter entries to a section (e.g. "api-reference" -> all pages under /api-reference). */
export function filterEntriesBySection(entries: PageEntry[], section: string): PageEntry[] {
  const sectionPath = section.replace(/^\/+/, '').trim();
  const path = sectionPath ? `/${sectionPath}` : '';
  if (!path) return entries;
  return entries.filter(
    (e) => e.urlPath === path || e.urlPath.startsWith(path + '/')
  );
}
