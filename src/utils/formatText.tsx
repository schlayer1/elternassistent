import React from 'react';

/**
 * Formats inline bold (**text**) and markdown links ([label](url)).
 */
export const formatBoldAndLinks = (str: string): string => {
  return str
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-school-blue underline hover:text-school-blueDark font-medium">$1</a>');
};

/**
 * Renders raw text with markdown formatting (bullet points, bold, headings, paragraphs).
 */
export const renderFormattedMarkdown = (raw: string): React.ReactNode => {
  if (!raw) return null;
  const lines = raw.split('\n');
  return lines.map((line, i) => {
    // Bullet points (•, -, or *)
    if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.substring(2);
      return (
        <li key={i} className="ml-4 list-disc text-slate-700 my-1 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formatBoldAndLinks(content) }} />
        </li>
      );
    }
    // Section Headers (### or ##)
    if (line.startsWith('### ')) {
      return (
        <h4 key={i} className="font-bold text-sm text-school-blueDark mt-3 mb-1">
          {line.replace('### ', '')}
        </h4>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h3 key={i} className="font-bold text-base text-slate-900 mt-4 mb-2">
          {line.replace('## ', '')}
        </h3>
      );
    }
    if (!line.trim()) {
      return <div key={i} className="h-2" />;
    }
    return (
      <p
        key={i}
        className="my-1 text-slate-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formatBoldAndLinks(line) }}
      />
    );
  });
};
