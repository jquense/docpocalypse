/* eslint-disable import/no-cycle */

import { css as dcss } from 'astroturf';
import React from 'react';
import Heading, { HeadingLevel } from './Heading';
import TsDocSignatureTitle from './TsDocSignatureTitle';
import TsDocComment from './TsDocComment';
import TsDocReturnBlock from './TsDocReturnBlock';
import TsDocParams from './TsDocParams';

interface Props {
  definition: any;
  level: HeadingLevel;
  title?: string | null;
  showSignature?: boolean;
  showHeader?: boolean;
  className?: string;
}

const TsDocBlock = ({
  className,
  definition,
  level = 2,
  title = null,
  showHeader = true,
  showSignature = true,
}: Props) => {
  if (!definition) return null;

  const nextLevel: HeadingLevel = (level + 1) as any;

  return (
    <div className={className}>
      {showHeader && (
        <Heading level={level}>
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
      <TsDocParams level={nextLevel} definition={definition} />
      <TsDocReturnBlock level={nextLevel} definition={definition} />
    </div>
  );
};

export default TsDocBlock;
