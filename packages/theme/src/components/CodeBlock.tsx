import React, { useMemo } from 'react';
import { highlight } from '@docpocalypse/code-live';

interface Props {
  code?: string;
  className?: string;
  language?: string;
}

function CodeBlock({ className, language, code = '' }: Props) {
  const highlighted = useMemo(() => highlight(code, language), [
    code,
    language
  ]);

  return (
    <pre className={className}>
      <code dangerouslySetInnerHTML={{ __html: highlighted }} />
    </pre>
  );
}

export default CodeBlock;
