import dstyled from 'astroturf';
import React from 'react';
import Heading from './Heading';
import TsDocSignatureType from './TsDocSignatureType';
import TsDocComment from './TsDocComment';
import TsDocParameter from './TsDocParameter';
import List from './List';
import { TypedocNode } from './typedoc-types';

const StyledList = dstyled(List)`
  @apply ml-5 p-0 mt-0 mb-0;

  & li {
    @apply mt-3;
  }
`;

interface Props {
  definition: TypedocNode;
  depth?: number;
}

function TsDocParams({ definition, depth = 0 }: Props) {
  const nextDepth = depth + 1;

  return (
    <>
      {definition.typeParameter && definition.typeParameter.length > 0 && (
        <>
          <Heading>Type Parameters</Heading>
          <StyledList>
            {definition.typeParameter.map(typeParam => (
              <li key={typeParam.id}>
                <Heading>
                  {typeParam.name}{' '}
                  {typeParam.type && (
                    <>
                      {': '}
                      <TsDocSignatureType type={typeParam.type} />
                    </>
                  )}
                </Heading>
              </li>
            ))}
          </StyledList>
        </>
      )}

      {!!definition.parameters?.length && (
        <>
          <Heading>Parameters</Heading>
          <StyledList>
            {definition.parameters.map(param => (
              <li key={param.id}>
                <Heading>
                  {param.flags.isRest && '...'}
                  {param.name}
                  {': '}
                  <TsDocSignatureType type={param.type} />
                  {param.defaultValue && (
                    <>
                      &nbsp;=&nbsp;
                      {param.defaultValue}
                    </>
                  )}
                </Heading>

                <TsDocComment comment={param.comment} />

                {/* {param.declaration && (
                  <TsDocParameter
                    definition={param.declaration}
                    depth={nextDepth}
                  />
                )} */}
              </li>
            ))}
          </StyledList>
        </>
      )}
    </>
  );
}

export default TsDocParams;
