import { css as dcss } from 'astroturf';
import React from 'react';

import TsDocTypeSignature from './TsDocTypeSignature';
import { TypedocNode } from './typedoc-types';
import { getReadableName } from './utils/tsDocTypeExpression';

interface Props {
  definition: TypedocNode;
  title?: React.ReactNode;
  hideName?: boolean;
  showSignature?: boolean;
  arrowStyle?: boolean;
  wrap?: boolean;
  className?: string;
}

function TsDocTitleSignature({
  definition,
  className,
  title,
  showSignature = true,
  wrap: _ = false,
}: Props) {
  if (definition.signatures?.length) {
    definition = definition.signatures[0];
  }

  if (!title && definition.name) {
    title = (
      <code>
        {getReadableName(definition)}
        {definition.flags.isOptional && '?'}
      </code>
    );
  }

  return (
    <div
      className={className}
      css={dcss`
        @component TsDocTitleSignature & {
          @apply inline-flex items-center;

          margin: calc(theme(margin.2) / -2);
          flex-wrap: wrap;

          & > *  {
            margin: calc(theme(margin.2) / 2);
          }
        }
      `}
    >
      {title}
      {showSignature && (
        <TsDocTypeSignature definition={definition} arrowStyle />
      )}
    </div>
  );
}

export default TsDocTitleSignature;
