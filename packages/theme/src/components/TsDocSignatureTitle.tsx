import React from 'react';
import TsDocSignatureType from './TsDocSignatureType';

function Parameter({ definition }: { definition: any }) {
  return (
    <>
      {definition.flags.isRest && '...'}
      {definition.name}
      {(definition.flags.isOptional || definition.defaultValue) && '?'}
      {': '}
      <TsDocSignatureType type={definition.type} />
    </>
  );
}

interface Props {
  definition: any;
  title?: string | null;
  hideName?: boolean;
  showSignature?: boolean;
  arrowStyle?: boolean;
}

function TsDocSignatureTitle({
  definition,
  title = null,
  hideName = false,
  arrowStyle = false,
  showSignature = true
}: Props) {
  return (
    <span className="signature">
      {!hideName && <code>{title || definition.name}</code>}
      {definition.typeParameters &&
        definition.typeParameters.length > 0 &&
        `<${definition.typeParameters.map(p => p.name).join(', ')}>`}
      {showSignature && (
        <>
          {' '}
          (
          {definition.parameters.map((param, idx) => (
            <React.Fragment key={param.id}>
              {idx > 0 && ', '}
              <Parameter definition={param} />
            </React.Fragment>
          ))}
          )
          {definition.type && (
            <>
              {arrowStyle ? ' => ' : ': '}
              <TsDocSignatureType type={definition.type} />
            </>
          )}
        </>
      )}
    </span>
  );
}

export default TsDocSignatureTitle;
