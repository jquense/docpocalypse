import Highlight, { Prism } from 'prism-react-renderer';
import React from 'react';
import { Language, PrismTheme, RenderProps } from './prism';

export const defaultHighligher = ({
  tokens,
  getLineProps,
  getTokenProps
}: RenderProps) => (
  <>
    {tokens.map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div {...getLineProps({ line, key: String(i) })}>
        {line.map((token, ii) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={ii} {...getTokenProps({ token, key: String(i) })} />
        ))}
      </div>
    ))}
  </>
);

interface Props {
  className?: string;
  style?: any;
  theme?: PrismTheme;
  code: string;
  language: Language;
  highlighter?: (props: RenderProps) => React.ReactNode;
}

function CodeBlock({ highlighter = defaultHighligher, code, ...props }: Props) {
  return (
    <Highlight Prism={Prism} code={code.trim()} {...props}>
      {highlighter}
    </Highlight>
  );
}

export default CodeBlock;
