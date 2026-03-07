import { NextApiRequest, NextApiResponse } from 'next';
import { buildPageEntries, BASE_URL } from '@/lib/llms';

/**
 * llms.txt:
 * - No section: site-wide table of contents (links + descriptions).
 * - With ?section=path: that section's subtree.
 *   - If subtree is a single page (non-index): full page content.
 *   - If subtree has multiple pages: table of contents for the subtree.
 * - Use llms-full.txt for full content of a section + all nested pages.
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

    const isSinglePage = section && entries.length === 1;
    let llmsContent: string;

    if (isSinglePage) {
      // Non-index page: show full content of the page itself
      const entry = entries[0];
      const url = `${BASE_URL}${entry.urlPath}`;
      const safeTitle = entry.title.replace(/"/g, '\\"');
      llmsContent = `---
title: "${safeTitle}"
url: "${url}"
---

`;
      llmsContent += entry.cleanContent.length > 0 ? entry.cleanContent : `# ${entry.title}\n`;
      llmsContent = llmsContent.trim();
    } else {
      // Site-wide or multi-page section: table of contents only
      const heading = section
        ? `# Table of Contents\n\n`
        : `# Documentation Table of Contents\n\n`;
      llmsContent = heading;
      for (const entry of entries) {
        const url = `${BASE_URL}${entry.urlPath}`;
        llmsContent += `- [${entry.title}](${url})\n`;
        if (entry.description && entry.description.trim().length > 0) {
          llmsContent += `  - ${entry.description}\n`;
        }
      }
      llmsContent = llmsContent.trim();
    }

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.status(200).send(llmsContent);
  } catch (error) {
    console.error('Error generating llms.txt:', error);
    res.status(500).json({ error: 'Failed to generate llms.txt' });
  }
}
