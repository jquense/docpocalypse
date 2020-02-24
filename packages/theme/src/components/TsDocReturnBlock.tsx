import React from 'react';
import Heading, { HeadingLevel } from './Heading';
import TsDocSignatureType from './TsDocSignatureType';
import TsDocParameter from './TsDocParameter';

interface Props {
  definition: any;
  level?: HeadingLevel;
}

function TsDocReturnBlock({ definition, level = 1 }: Props) {
  return (
    <div>
      {definition.type && (
        <>
          <Heading level={level}>Return Value</Heading>
          <TsDocSignatureType type={definition.type} />

          {definition.type.declaration && (
            <TsDocParameter definition={definition.type.declaration} />
          )}
        </>
      )}
    </div>
  );
}

export default TsDocReturnBlock;
