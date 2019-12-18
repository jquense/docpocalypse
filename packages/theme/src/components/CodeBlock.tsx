import { css as dcss } from 'astroturf';
import React from 'react';
import { CodeBlock as BaseCodeBlock } from '@docpocalypse/code-live';
import theme from '../syntax-theme';

interface Props {
  code?: string;
  className?: string;
  language?: string;
  title?: string;
}

const styles = dcss`
  @component CodeBlock {
    @theme minimal {
      margin: theme(margin.5);
    }

    @theme full minimal {
      margin: theme(margin.5) theme(margin.-4);
      border-radius: theme(borderRadius.default);
      border: 1px solid theme(colors.gray.300);

      & .title {
        @apply font-medium bg-gray-300 px-5 py-3 font-mono text-sm leading-tight rounded-t;
      }

      & pre {
        @apply px-5 py-6 bg-gray-100 rounded-b;
      }
    }
  }
`;

function CodeBlock({ className, title, language, code = '' }: Props) {
  return (
    <div className={styles.CodeBlock}>
      {title && <div className={styles.title}>{title}</div>}
      <pre className={className} style={theme?.plain as any}>
        <code>
          <BaseCodeBlock theme={theme} code={code} language={language as any} />
        </code>
      </pre>
    </div>
  );
}

export default CodeBlock;
