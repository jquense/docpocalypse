import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React, { useMemo } from 'react';
import { MDXProvider } from '@mdx-js/react';
import BasePre from './Pre';

interface Props {
  example: any;
  name: string;
}

export default function Example({ example, name }: Props) {
  const pre = useMemo(() => {
    return props => <BasePre {...props} name={name} />;
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
