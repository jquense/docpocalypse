import { css as dcss } from 'astroturf';
import cn from 'classnames';
import React from 'react';

import { TypedocNode, TypedocType } from './typedoc-types';
import typeExpression from './utils/tsDocTypeExpression';

const styles = dcss`
  @component TsDocTypeExpression {
    @apply text-accent;
  }
`;

export interface TsDocTypeExpressionProps {
  type: TypedocType | TypedocNode;
  compact?: boolean;
  className?: string;
}

export default function TsDocTypeExpression({
  type,
  className,
  compact = false,
}: TsDocTypeExpressionProps) {
  return (
    <span className={cn(className, styles.TsDocTypeExpression)}>
      {typeExpression(type, { compact })}
    </span>
  );
}
