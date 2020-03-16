import React from 'react';
import Heading from './Heading';
import TsDocSignatureType from './TsDocSignatureType';
import TsDocParameter from './TsDocParameter';

interface Props {
  definition: any;
  depth?: number;
}

function TsDocReturnBlock({ definition, depth = 0 }: Props) {
  return (
    <div>
      {definition.type && (
        <>
          <Heading>Return Value</Heading>
          <TsDocSignatureType type={definition.type} />

          {/* {definition.type.declaration && (
            <TsDocParameter
              definition={definition.type.declaration}
              depth={depth + 1}
            />
          )} */}
        </>
      )}
    </div>
  );
}

export default TsDocReturnBlock;
