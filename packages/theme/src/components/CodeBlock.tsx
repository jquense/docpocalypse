import { CodeBlock as BaseCodeBlock } from '@docpocalypse/code-live';
import { css as dcss } from 'astroturf';
import React from 'react';

import theme from '../syntax-theme';

interface Props {
  code?: string;
  className?: string;
  language?: string;
  title?: string;
  lineNumbers?: boolean;
}

const styles = dcss`
  @component CodeBlock {
    margin: theme(margin.5) theme(margin.-4) theme(margin.8);
    border-radius: theme(borderRadius.default);
    border: 1px solid theme(colors.gray.300);

    & .title {
      @apply font-medium bg-gray-300 px-5 py-3 font-mono text-sm leading-tight rounded-t;
    }

    & pre {
      @apply px-5 py-6 bg-gray-100 rounded-b;
    }
  }
`;

function CodeBlock({
  className,
  title,
  language,
  lineNumbers,
  code = '',
}: Props) {
  return (
    <div className={styles.CodeBlock}>
      {title && <div className={styles.title}>{title}</div>}

      <BaseCodeBlock
        className={className}
        theme={theme}
        code={code}
        lineNumbers={lineNumbers}
        language={language as any}
      />
    </div>
  );
}

export default CodeBlock;
