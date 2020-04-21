import { css as dcss } from 'astroturf';
import cn from 'classnames';
import React from 'react';

import typeExpression from './utils/jsDocTypeExpression';

const styles = dcss`
  @component JsDocTypeExpression {
    @apply text-accent;
  }
`;

export default function JsDocTypeExpression({ type, className }: any) {
  return (
    <span className={cn(className, styles.JsDocTypeExpression)}>
      {typeExpression(type)}
    </span>
  );
}
