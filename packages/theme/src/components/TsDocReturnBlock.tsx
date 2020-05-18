import React from 'react';

import DocTypeWrapper from './DocTypeWrapper';
import Heading from './Heading';
import Description from './TsDocComment';
import Members from './TsDocMembers';
import TsDocTypeExpression from './TsDocTypeExpression';
import { TypedocNode } from './typedoc-types';
import { getReturnType } from './utils/tsDocTypeExpression';

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

          <Members
            definition={returnType.reference || returnType}
            depth={depth + 1}
          />
        </>
      )}
    </>
  );
}

export default TsDocReturnBlock;
