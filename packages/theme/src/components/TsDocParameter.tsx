/* eslint-disable import/no-cycle */
import React from 'react';
import TsDocSignatureTitle from './TsDocSignatureTitle';
import { Heading } from '../../index';
import TsDocSignatureType from './TsDocSignatureType';
import TsDocBlock from './TsDocBlock';
import TsDocComment from './TsDocComment';
import List from './List';

interface Props {
  definition: any;
  depth?: number;
}

function TsDocParameter({ definition, depth = 0 }: Props) {
  const nextDepth = depth + 1;

  return (
    <List>
      {definition.signatures && definition.signatures.length > 0 && (
        <li>
          <List>
            {definition.signatures.map(signature => (
              <li key={signature.id}>
                <TsDocSignatureTitle definition={signature} hideName />
              </li>
            ))}
          </List>

          <List>
            {definition.signatures.map(signature => (
              <li key={signature.id}>
                <TsDocBlock
                  depth={nextDepth}
                  definition={signature}
                  showHeader={false}
                />
              </li>
            ))}
          </List>
        </li>
      )}

      {definition.indexSignature && definition.indexSignature.length > 0 && (
        /* { [foo: string]: Bar} */
        <li>
          <Heading>
            [
            {definition.indexSignature.parameters.map(param => (
              <React.Fragment key={param.id}>
                {param.flags.isRest && '...'}
                {param.name}
                {': '}
                <TsDocSignatureType type={param.type} />
              </React.Fragment>
            ))}
            ]:
            <TsDocSignatureType type={definition.indexSignature.type} />
          </Heading>
        </li>
      )}

      {definition.typedocs.map(child => (
        <li key={child.id}>
          {child.signatures && child.signatures.length > 0 ? (
            <>
              <Heading>
                {child.flags.isRest && '...'}
                {child.name}
                {child.flags.isOptional && '?'}
                {': '}
                function
              </Heading>
              <TsDocBlock definition={child} depth={nextDepth} />
            </>
          ) : (
            <>
              <Heading>
                {child.flags.isRest && '...'}
                {child.name}
                {child.flags.isOptional && '?'}
                {': '}
                <TsDocSignatureType type={child.type} />
              </Heading>

              <TsDocComment comment={child.comment} />

              {child.typedocs && child.typedocs.length > 0 && (
                <TsDocParameter definition={child} depth={nextDepth} />
              )}

              {child.type.declaration && (
                <TsDocParameter
                  definition={child.type.declaration}
                  depth={nextDepth}
                />
              )}
            </>
          )}
        </li>
      ))}
    </List>
  );
}

export default TsDocParameter;
