import React from 'react';

import typeExpression from './utils/jsDocTypeExpression';

import JsDocTypeWrapper from './JsDocTypeWrapper';
import { InlineHighlight } from './InlineTypeHighlight';

export interface JsDocFunctionSignatureProps {
  definition: any;
  ignoreParams: string[];
  block?: boolean;
}

export const isFunctionDef = (definition: any, recursive = true) =>
  (definition.params && definition.params.length > 0) ||
  (definition.returns && definition.returns.length > 0) ||
  (recursive &&
    definition.type &&
    definition.type.typeDef &&
    isFunctionDef(definition.type.typeDef, false));

export default function JsDocFunctionSignature({
  block,
  definition,
  ignoreParams,
}: JsDocFunctionSignatureProps) {
  const params = definition.params
    ? definition.params
        .filter(param => !ignoreParams.includes(param.name))
        .map(param => {
          const type =
            param.type &&
            `${param.optional ? '?' : ''}: ${typeExpression(param.type)}`;
          return `${param.name}${type || ''}`;
        })
    : [];

  const returns =
    definition.returns && definition.returns.length
      ? typeExpression(definition.returns[0].type)
      : 'void';

  return (
    <JsDocTypeWrapper block={block}>
      <InlineHighlight code={`(${params.join(', ')}) => ${returns}`} />
    </JsDocTypeWrapper>
  );
}
