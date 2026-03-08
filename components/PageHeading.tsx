import React from 'react';
import CopyMarkdownButton from './CopyMarkdownButton';

interface PageHeadingProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ children, id, className, ...props }) => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
      <h1 
        id={id} 
        className={className || "mt-2 text-4xl font-bold tracking-tight"}
        {...props}
      >
        {children}
      </h1>
      <div className="shrink-0">
        <CopyMarkdownButton />
      </div>
    </div>
  );
};

export default PageHeading;
