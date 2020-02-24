import React from 'react';
import TsDocSignatureTitle from './TsDocSignatureTitle';
import { HeadingLevel } from './Heading';
import { Heading } from '../../index';
import TsDocSignatureType from './TsDocSignatureType';
import TsDocBlock from './TsDocBlock';
import TsDocComment from './TsDocComment';

interface Props {
  definition: any;
  level?: HeadingLevel;
}

function TsDocParameter({ definition, level = 1 }: Props) {
  const nextLevel: HeadingLevel = (level + 1) as any;

  return (
    <ul>
      {definition.signatures && definition.signatures.length > 0 && (
        <li>
          <ul>
            {definition.signatures.map(signature => (
              <li key={signature.id}>
                <TsDocSignatureTitle definition={signature} hideName />
              </li>
            ))}
          </ul>

          <ul>
            {definition.signatures.map(signature => (
              <li key={signature.id}>
                <TsDocBlock
                  level={nextLevel}
                  definition={signature}
                  showHeader={false}
                />
              </li>
            ))}
          </ul>
        </li>
      )}

      {definition.indexSignature && definition.indexSignature.length > 0 && (
        /* { [foo: string]: Bar} */
        <li>
          <Heading level={level}>
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
              <Heading level={level}>
                {child.flags.isRest && '...'}
                {child.name}
                {child.flags.isOptional && '?'}
                {': '}
                function
              </Heading>
              <TsDocBlock definition={child} level={nextLevel} />
            </>
          ) : (
            <>
              <Heading level={level}>
                {child.flags.isRest && '...'}
                {child.name}
                {child.flags.isOptional && '?'}
                {': '}
                <TsDocSignatureType type={child.type} />
              </Heading>

              <TsDocComment comment={child.comment} />

              {child.typedocs && child.typedocs.length > 0 && (
                <TsDocParameter definition={child} level={nextLevel} />
              )}

              {child.type.declaration && (
                <TsDocParameter
                  definition={child.type.declaration}
                  level={nextLevel}
                />
              )}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default TsDocParameter;
