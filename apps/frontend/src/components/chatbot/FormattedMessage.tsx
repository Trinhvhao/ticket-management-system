import React from 'react';

interface FormattedMessageProps {
  content: string;
  className?: string;
}

export function FormattedMessage({ content, className = '' }: FormattedMessageProps) {
  // Parse markdown-like formatting
  const formatText = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      if (!line.trim()) {
        elements.push(<br key={`br-${index}`} />);
        return;
      }

      // Headers (##)
      if (line.startsWith('##')) {
        const headerText = line.replace(/^##\s*/, '').replace(/\*\*/g, '');
        elements.push(
          <h3 key={index} className="font-bold text-base mt-3 mb-2 text-gray-900">
            {headerText}
          </h3>
        );
        return;
      }

      // Bold headers (**text:**)
      if (line.match(/^\*\*[^*]+:\*\*/)) {
        const headerText = line.replace(/\*\*/g, '');
        elements.push(
          <p key={index} className="font-semibold text-sm mt-2 mb-1 text-gray-800">
            {headerText}
          </p>
        );
        return;
      }

      // Bullet points (• or -)
      if (line.match(/^[•\-]\s/)) {
        const bulletText = line.replace(/^[•\-]\s*/, '');
        const formatted = formatInlineMarkdown(bulletText);
        elements.push(
          <div key={index} className="flex items-start space-x-2 ml-2 my-1">
            <span className="text-blue-600 mt-0.5">•</span>
            <span className="text-sm text-gray-700 flex-1">{formatted}</span>
          </div>
        );
        return;
      }

      // Numbered lists (1., 2., etc)
      if (line.match(/^\d+\.\s/)) {
        const match = line.match(/^(\d+)\.\s(.+)$/);
        if (match) {
          const [, number, text] = match;
          const formatted = formatInlineMarkdown(text);
          elements.push(
            <div key={index} className="flex items-start space-x-2 ml-2 my-1">
              <span className="text-blue-600 font-medium min-w-[20px]">{number}.</span>
              <span className="text-sm text-gray-700 flex-1">{formatted}</span>
            </div>
          );
          return;
        }
      }

      // Regular paragraph with inline formatting
      const formatted = formatInlineMarkdown(line);
      elements.push(
        <p key={index} className="text-sm text-gray-700 my-1">
          {formatted}
        </p>
      );
    });

    return elements;
  };

  // Format inline markdown (bold, code, links)
  const formatInlineMarkdown = (text: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let partKey = 0;

    // Regex patterns
    const boldPattern = /\*\*([^*]+)\*\*/g;
    const codePattern = /`([^`]+)`/g;
    const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;

    // Combine all patterns
    const combinedPattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
    const matches = Array.from(text.matchAll(combinedPattern));

    matches.forEach((match) => {
      const matchText = match[0];
      const matchIndex = match.index!;

      // Add text before match
      if (matchIndex > currentIndex) {
        parts.push(
          <span key={`text-${partKey++}`}>
            {text.substring(currentIndex, matchIndex)}
          </span>
        );
      }

      // Handle bold
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        const boldText = matchText.replace(/\*\*/g, '');
        parts.push(
          <strong key={`bold-${partKey++}`} className="font-semibold text-gray-900">
            {boldText}
          </strong>
        );
      }
      // Handle code
      else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        const codeText = matchText.replace(/`/g, '');
        parts.push(
          <code
            key={`code-${partKey++}`}
            className="px-1.5 py-0.5 bg-gray-200 text-gray-800 rounded text-xs font-mono"
          >
            {codeText}
          </code>
        );
      }
      // Handle links
      else if (matchText.startsWith('[')) {
        const linkMatch = matchText.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          parts.push(
            <a
              key={`link-${partKey++}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {linkText}
            </a>
          );
        }
      }

      currentIndex = matchIndex + matchText.length;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={`text-${partKey++}`}>
          {text.substring(currentIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div className={`formatted-message ${className}`}>
      {formatText(content)}
    </div>
  );
}
