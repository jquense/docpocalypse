import ImportsContext from 'docpocalypse-core/ImportsContext';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React, { useContext, useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import LiveCode from './LiveCode';

const toText = (node: React.ReactNode) => {
  const nodes = React.Children.toArray(node);

  return nodes
    .filter(c => c !== true && c !== false && c !== null)
    .reduce((str, next) => {
      if (!React.isValidElement(next)) return str + String(next);

      return str + toText(next.props.children);
    }, '');
};

interface Props {
  example: any;
  name?: string;
}

export default function Example({ example, name }: Props) {
  const pre = useMemo(() => {
    const Pre = props => {
      const imports = useContext<any>(ImportsContext);
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
          imports={imports && imports[name!]}
        />
      ) : (
        <pre {...props} />
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
