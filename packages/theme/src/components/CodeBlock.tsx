import React, { useMemo } from 'react';
import { highlight } from '@docpocalypse/code-live';

export const getLanguage = (className = '') => {
  const [, mode]: RegExpMatchArray = className.match(/language-(\w+)/) || [];
  return mode;
};

interface Props {
  children?: string;
  className?: string;
  language?: string;
}

function CodeBlock({
  className,
  language = getLanguage(className),
  children = ''
}: Props) {
  const code = useMemo(() => highlight(children, language), [
    children,
    language
  ]);

  return (
    <pre className={className}>
      <code dangerouslySetInnerHTML={{ __html: code }} />
    </pre>
  );
}

export default CodeBlock;
