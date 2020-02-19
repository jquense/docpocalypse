import { css as dcss } from 'astroturf';
import React from 'react';

interface Props {
  comment: any;
}

export default function TsDocComment({ comment }: Props) {
  if (!comment) {
    return null;
  }

  // FIXME: render MDX here by creating a way to query for the comment MDX
  return (
    <div
      css={dcss`
          margin-top: 0.5em;

          & p {
            margin: 0;
          }
        `}
    >
      {comment.shortText && <p>{comment.shortText}</p>}
      {comment.text && <p>{comment.text}</p>}
    </div>
  );
}
