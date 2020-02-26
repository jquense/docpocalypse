import { MDXProvider } from '@mdx-js/react';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { useMDXScope } from 'gatsby-plugin-mdx/context';
import React, { useMemo } from 'react';

import BasePre from './Pre';

interface Props {
  example: any;
  name: string;
}

export default function Example({ example, name }: Props) {
  const scope = useMDXScope();
  const pre = useMemo(() => {
    return props => <BasePre {...props} name={name} />;
  }, [name]);

  return example ? (
    <MDXProvider components={{ pre }}>
      <MDXRenderer scope={{ frontmatter: example.frontmatter, ...scope }}>
        {example.body}
      </MDXRenderer>
    </MDXProvider>
  ) : null;
}

export const fragment = graphql`
  fragment Example_example on DocpocalypseExample {
    body
  }
`;
