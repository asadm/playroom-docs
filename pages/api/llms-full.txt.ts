import { NextApiRequest, NextApiResponse } from 'next';
import { buildPageEntries, BASE_URL } from '@/lib/llms';

/**
 * llms-full.txt:
 * - No section: whole docs (all pages).
 * - With ?section=path: current page + nested pages only (e.g. from /docs/setup/llms-full.txt).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    let entries = buildPageEntries();

    const rawSection = req.query.section;
    const section = typeof rawSection === 'string'
      ? rawSection.trim()
      : Array.isArray(rawSection)
        ? rawSection.join('/').trim()
        : '';

    if (section) {
      const sectionPath = section.startsWith('/') ? section : `/${section}`;
      entries = entries.filter(
        (e) => e.urlPath === sectionPath || e.urlPath.startsWith(sectionPath + '/')
      );
    }

    let fullContent = '';

    for (const entry of entries) {
      const url = `${BASE_URL}${entry.urlPath}`;
      const safeTitle = entry.title.replace(/"/g, '\\"');
      fullContent += `---
title: "${safeTitle}"
url: "${url}"
---

`;
      fullContent += entry.cleanContent.length > 0 ? entry.cleanContent : `# ${entry.title}\n`;
      fullContent += `\n\n`;
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(fullContent.trim());
  } catch (error) {
    console.error('Error generating llms-full.txt:', error);
    res.status(500).json({ error: 'Failed to generate llms-full.txt' });
  }
}
