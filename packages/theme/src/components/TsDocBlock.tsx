/* eslint-disable import/no-cycle */

import React from 'react';

import Description from './TsDocComment';
import Members from './TsDocMembers';
import ReturnBlock from './TsDocReturnBlock';
import { TypedocNode } from './typedoc-types';
import { getFunctionNode } from './utils/tsDocTypeExpression';

interface Props {
  definition: TypedocNode;
  depth?: number;
  hideReturns?: boolean;
  hideProperties?: boolean;
}

const TsDocBlock = ({
  definition,
  hideReturns,
  hideProperties = !!getFunctionNode(definition),
  depth = 2,
}: Props) => {
  if (!definition) return null;

  const nextDepth = depth + 1;

  return (
    <>
      <Description comment={definition.description} />
      <Members
        depth={nextDepth}
        definition={definition}
        hideProperties={hideProperties}
      />
      {!hideReturns && (
        <ReturnBlock depth={nextDepth} definition={definition} />
      )}
    </>
  );
};

export default TsDocBlock;
