import { css as dcss } from 'astroturf';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';
import { TypeDocComment } from './typedoc-types';

interface Props {
  comment?: TypeDocComment;
}

export default function TsDocComment({ comment }: Props) {
  if (!comment?.mdx) {
    return null;
  }

  return (
    <div
      css={dcss`
          margin-top: 0.5em;

          & p {
            margin: 0;
          }
        `}
    >
      <MDXRenderer>{comment.mdx.body}</MDXRenderer>
    </div>
  );
}
