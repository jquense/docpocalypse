import React, { ReactNode } from 'react';

import { Language, PrismLib, PrismTheme, RenderProps } from './types';
import useHighlight from './useHighlight';

type Props = {
  Prism: PrismLib;
  theme?: PrismTheme;
  language: Language;
  code: string;
  children: (props: RenderProps) => ReactNode;
};

function Highlight({ children, ...rest }: Props) {
  const { props, tokens, getLineProps, getTokenProps } = useHighlight(rest);

  return (
    <>
      {children({
        ...props,
        tokens,
        getLineProps,
        getTokenProps,
      })}
    </>
  );
}

export default Highlight;
