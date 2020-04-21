import { css as dcss } from 'astroturf';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';

import { TypeDocCommentText } from './typedoc-types';

interface Props {
  comment?: TypeDocCommentText;
}

export default function TsDocComment({ comment }: Props) {
  if (!comment?.mdx) {
    return null;
  }

  return (
    <div
      css={dcss`
      @component TsDocDescription & {
        margin-top: 0.5em;

        & p {
          margin: 0;
        }
      }
        `}
    >
      <MDXRenderer>{comment.mdx.body}</MDXRenderer>
    </div>
  );
}
