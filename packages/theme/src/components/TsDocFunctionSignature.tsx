import React from 'react';

import DocTypeWrapper from './DocTypeWrapper';
import { InlineHighlight } from './InlineTypeHighlight';
import { TypedocNode } from './typedoc-types';
import { tsFunctionExpression } from './utils/tsDocTypeExpression';

export interface TsDocFunctionSignatureProps {
  definition: TypedocNode;
  arrowStyle?: boolean;
  compact?: boolean;
}

export default function TsDocFunctionSignature({
  definition,
  arrowStyle = true,
  compact = true,
}: TsDocFunctionSignatureProps) {
  const def = tsFunctionExpression(definition, { arrowStyle, compact });

  return def ? (
    <DocTypeWrapper>
      <InlineHighlight code={def} />
    </DocTypeWrapper>
  ) : null;
}
