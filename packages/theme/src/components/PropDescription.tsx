import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';

interface Props {
  as?: React.ElementType;
  html?: string;
  mdx?: { body: string };
}

/** @public */
function PropDescription({ mdx, html, as: Tag = 'div' }: Props) {
  if (mdx)
    return (
      <Tag>
        <MDXRenderer>{mdx.body}</MDXRenderer>
      </Tag>
    );

  return <Tag dangerouslySetInnerHTML={{ __html: html }} />;
}

export default PropDescription;
