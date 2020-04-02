import {
  LineOutputProps,
  Prism,
  useHighlight,
} from '@docpocalypse/prism-react-renderer';
import cn from 'classnames';
import React from 'react';

import { Language, PrismTheme, RenderProps } from './prism';

type MapTokens = Omit<ReturnType<typeof useHighlight>, 'props'> & {
  lineNumbers?: boolean;
  errorLocation?: { line: number; col: number };
};

function addErrorHighlight(
  props: LineOutputProps,
  index: number,
  errorLocation?: MapTokens['errorLocation'],
) {
  if (errorLocation && index === errorLocation.line) {
    props.className = cn(props.className, 'token-line-error');
  }
  return props;
}

export const mapTokens = ({
  tokens,
  getLineProps,
  getTokenProps,
  lineNumbers,
  errorLocation,
}: MapTokens) => (
  <>
    {tokens.map((line, i) => (
      // eslint-disable-next-line react/no-array-index-key
      <div
        {...addErrorHighlight(
          getLineProps({ line, key: String(i) }),
          i,
          errorLocation,
        )}
      >
        {lineNumbers && <span className="token-line-number">{i + 1}</span>}
        {line.map((token, ii) => (
          // eslint-disable-next-line react/no-array-index-key
          <span key={ii} {...getTokenProps({ token, key: String(ii) })} />
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
  lineNumbers?: boolean;
  highlighter?: (props: RenderProps) => React.ReactNode;
}

function CodeBlock({ code, theme, language, lineNumbers, ...props }: Props) {
  const highlight = useHighlight({ code: code.trim(), Prism, theme, language });
  return (
    <pre
      className={cn(props.className, highlight.props.className)}
      style={{ ...props.style, ...highlight.props.style }}
    >
      <code>{mapTokens({ ...highlight, lineNumbers })}</code>
    </pre>
  );
}

export default CodeBlock;
