import React from 'react';

import DocTypeWrapper from './DocTypeWrapper';
import Heading from './Heading';
import Description from './TsDocComment';
import { getReturnType } from './TsDocFunctionSignature';
import Members from './TsDocMembers';
import TsDocTypeExpression from './TsDocTypeExpression';
import { TypedocNode } from './typedoc-types';

interface Props {
  definition: TypedocNode;
  depth?: number;
}

function TsDocReturnBlock({ definition, depth = 0 }: Props) {
  const returnType = getReturnType(definition);
  return (
    <>
      {definition.type && (
        <>
          <Heading level={depth}>
            Return Value{' '}
            <DocTypeWrapper>
              <TsDocTypeExpression type={returnType} compact />
            </DocTypeWrapper>
          </Heading>

          <Description comment={definition.returnsDescription} />

          <Members definition={returnType} depth={depth + 1} />
        </>
      )}
    </>
  );
}

export default TsDocReturnBlock;
