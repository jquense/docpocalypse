import dstyled from 'astroturf';
import React from 'react';
import Heading, { HeadingLevel } from './Heading';
import TsDocSignatureType from './TsDocSignatureType';
import TsDocComment from './TsDocComment';
import TsDocParameter from './TsDocParameter';

const List = dstyled('ul')`
  @apply ml-5 p-0 mt-0 mb-0;

  & li {
    @apply mt-3;
  }
`;

interface Props {
  definition: any;
  level?: HeadingLevel;
}

function TsDocParams({ definition, level = 1 }: Props) {
  const nextLevel: HeadingLevel = (level + 1) as any;

  return (
    <>
      {definition.typeParameter && definition.typeParameter.length > 0 && (
        <>
          <Heading level={level}>Type Parameters</Heading>
          <List>
            {definition.typeParameter.map(typeParam => (
              <li key={typeParam.id}>
                <Heading level={nextLevel}>
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
          </List>
        </>
      )}

      {definition.parameters && definition.parameters.length > 0 && (
        <>
          <Heading level={level}>Parameters</Heading>
          <List>
            {definition.parameters.map(param => (
              <li key={param.id}>
                <Heading level={nextLevel}>
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

                {param.declaration && (
                  <TsDocParameter definition={param.declaration} />
                )}
              </li>
            ))}
          </List>
        </>
      )}
    </>
  );
}

export default TsDocParams;
