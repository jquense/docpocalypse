import React from 'react';
import {
  useImportsForExample,
  useScope
} from '@docpocalypse/gatsby-theme-core';
import CodeBlock from './CodeBlock';
import LiveCode from './LiveCode';

export const toText = (node: React.ReactNode): string => {
  const nodes = React.Children.toArray(node);

  return nodes
    .filter(c => c !== true && c !== false && c !== null)
    .reduce<string>((str, next) => {
      if (!React.isValidElement(next)) return str + String(next);

      return str + toText(next.props.children);
    }, '');
};

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
  return React.isValidElement(props.children) ? (
    <LiveCode
      code={flatCode}
      {...codeProps}
      scope={scope}
      resolveImports={imports}
    />
  ) : (
    <CodeBlock {...props} code={flatCode} />
  );
};

export default Pre;
