import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Copy, Check } from 'lucide-react';

const CopyMarkdownButton: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const copyMarkdown = async () => {
    try {
      setLoading(true);

      const currentPath = router.asPath.split('?')[0].split('#')[0].replace(/\/$/, '') || '/';

      // On homepage: copy the llms.txt index (table of contents)
      if (currentPath === '/') {
        const response = await fetch('/api/llms.txt');
        if (!response.ok) throw new Error('Failed to fetch llms.txt');
        const indexContent = await response.text();
        await navigator.clipboard.writeText(indexContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }

      // On other pages: copy raw MDX via get-markdown
      const filePath = `${currentPath.replace(/^\//, '')}.mdx`;
      const response = await fetch(`/api/get-markdown?path=${encodeURIComponent(filePath)}`);
      if (!response.ok) throw new Error('Failed to fetch markdown');

      const data = await response.json();
      await navigator.clipboard.writeText(data?.content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy markdown:', error);
      alert('Failed to copy markdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={copyMarkdown}
      disabled={loading || copied}
      title="Copy page as Markdown"
      className={`
        flex items-center gap-2 px-3 py-2 text-sm
        rounded-md border transition-all
        ${copied 
          ? 'bg-green-500/10 border-green-600 dark:text-white' 
          : 'bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/15'
        }
        ${loading ? 'opacity-70 cursor-wait' : copied ? 'cursor-default' : 'cursor-pointer'}
        disabled:cursor-not-allowed
      `}
    >
      {copied ? (
        <>
          <Check size={16} />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <Copy size={16} />
          <span className="hidden sm:inline">Copy Markdown</span>
          <span className="sm:hidden">Copy</span>
        </>
      )}
    </button>
  );
};

export default CopyMarkdownButton;
