import { useHighlight } from '@docpocalypse/code-live';
import theme from '@docpocalypse/code-live/themes/ultramin';
import React from 'react';

export function InlineHighlight({ code }) {
  const { tokens, getTokenProps } = useHighlight({
    theme,
    code,
    language: 'tsx',
  });

  return (
    <>
      {tokens.map((line, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={i}>
          {line.map((token, ii) => (
            // eslint-disable-next-line react/no-array-index-key
            <span key={ii} {...getTokenProps({ token, key: String(ii) })} />
          ))}
        </React.Fragment>
      ))}
    </>
  );
}
