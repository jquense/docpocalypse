import React from 'react';
import {
  useImportsForExample,
  useScope
} from '@docpocalypse/gatsby-theme-core';
import { canParse } from '@docpocalypse/gatsby-theme-core/can-parse';
import CodeBlock from './CodeBlock';
import LiveCode from './LiveCode';

export const getLanguage = (className = '') => {
  const [, mode]: RegExpMatchArray = className.match(/language-(\w+)/) || [];
  return mode;
};

export const toText = (node: React.ReactNode): string => {
  const nodes = React.Children.toArray(node);

  return nodes
    .filter(c => c !== true && c !== false && c !== null)
    .reduce<string>((str, next) => {
      if (!React.isValidElement(next)) return str + String(next);

      return str + toText(next.props.children);
    }, '');
};

/** @public */
const Pre = props => {
  const imports = useImportsForExample(props.name);
  const scope = useScope();
  const {
    children,
    originalType: _1,
    metastring: _2,
    mdxType: _3,
    parentName: _4,
    ...codeProps
  } = props.children?.props ?? {};

  const flatCode = toText(children);
  const language = codeProps.language || getLanguage(codeProps.className);
  const isStatic =
    props.static ||
    codeProps.static === true ||
    (!canParse(language) && codeProps.live !== true);

  return !isStatic ? (
    <LiveCode
      code={flatCode}
      {...codeProps}
      scope={scope}
      language={language}
      resolveImports={imports}
    />
  ) : (
    <CodeBlock {...codeProps} language={language} code={flatCode} />
  );
};

export default Pre;
