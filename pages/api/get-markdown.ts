import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { path: filePath } = req.query;

    if (!filePath || typeof filePath !== 'string') {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    // Normalize: strip leading/trailing slashes and prevent path traversal
    const normalizedPath = filePath.replace(/^\/+/, '').replace(/\.\./g, '');
    if (!normalizedPath || normalizedPath.endsWith('/')) {
      return res.status(400).json({ error: 'Invalid file path' });
    }

    // Security: Ensure the path is within the pages directory
    const cwd = process.cwd();
    const pagesDir = path.join(cwd, 'pages');
    const fullPath = path.join(pagesDir, normalizedPath);

    // Check if the resolved path is actually within pages directory
    const realPagesDir = path.resolve(pagesDir);
    const realFullPath = path.resolve(fullPath);
    if (!realFullPath.startsWith(realPagesDir)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Read the file content
    const content = fs.readFileSync(fullPath, 'utf-8');

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    
    res.status(200).json({ content });
  } catch (error) {
    console.error('Error fetching markdown:', error);
    res.status(500).json({ error: 'Failed to fetch markdown content' });
  }
}
