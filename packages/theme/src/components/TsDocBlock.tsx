/* eslint-disable import/no-cycle */

import { css as dcss } from 'astroturf';
import React from 'react';
import Heading from './Heading';
import TsDocSignatureTitle from './TsDocSignatureTitle';
import TsDocComment from './TsDocComment';
import TsDocReturnBlock from './TsDocReturnBlock';
import TsDocParams from './TsDocParams';
import { TypedocNode } from './typedoc-types';

interface Props {
  definition: TypedocNode;
  depth?: number;
  title?: string | null;
  showSignature?: boolean;
  showHeader?: boolean;
  className?: string;
}

const TsDocBlock = ({
  className,
  definition,
  depth = 2,
  title = null,
  showHeader = true,
  showSignature = true,
}: Props) => {
  if (!definition) return null;

  const nextDepth = depth + 1;

  return (
    <div className={className}>
      {showHeader && (
        <Heading>
          <div
            css={dcss`
            @apply inline-block mr-3;
          `}
          >
            <TsDocSignatureTitle
              title={title}
              definition={definition}
              showSignature={showSignature}
              arrowStyle
              wrap
            />
          </div>
        </Heading>
      )}

      <TsDocComment comment={definition.comment} />
      <TsDocParams depth={nextDepth} definition={definition} />
      <TsDocReturnBlock depth={nextDepth} definition={definition} />
    </div>
  );
};

export default TsDocBlock;
