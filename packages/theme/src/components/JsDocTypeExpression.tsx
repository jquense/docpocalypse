import React from 'react';
import cn from 'classnames';
import { css as dcss } from 'astroturf';
import typeExpression from './utils/jsDocTypeExpression';

const styles = dcss`
  @component JsDocTypeExpression {
    @apply text-accent;
  }
`;

export default function JsDocTypeExpression({ type, className }) {
  return (
    <span className={cn(className, styles.JsDocTypeExpression)}>
      {typeExpression(type)}
    </span>
  );
}
