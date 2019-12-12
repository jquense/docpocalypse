import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React, { useMemo } from 'react';
import {
  useImportsForExample,
  useScope
} from '@docpocalypse/gatsby-theme-core';
import { MDXProvider } from '@mdx-js/react';
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

interface Props {
  example: any;
  name: string;
}

export default function Example({ example, name }: Props) {
  const pre = useMemo(() => {
    const Pre = props => {
      const imports = useImportsForExample(name);
      const scope = useScope();
      const {
        children,
        originalType: _1,
        metastring: _2,
        mdxType: _3,
        parentName: _4,
        ...codeProps
      } = props.children.props;

      return React.isValidElement(props.children) ? (
        <LiveCode
          code={toText(children)}
          {...codeProps}
          scope={scope}
          resolveImports={imports}
        />
      ) : (
        <CodeBlock {...props} />
      );
    };

    return Pre;
  }, [name]);

  return example ? (
    <MDXProvider components={{ pre }}>
      <MDXRenderer>{example.body}</MDXRenderer>
    </MDXProvider>
  ) : null;
}

export const fragment = graphql`
  fragment Example_example on Mdx {
    body
  }
`;
