import dstyled from 'astroturf';
import React from 'react';
// eslint-disable-next-line import/no-cycle
import TsDocSignatureType from './TsDocSignatureType';
import { Kind, TypedocType, TypedocNode } from './typedoc-types';

const Wrapper = dstyled('span')<{ wrap: boolean }>`
  @apply ml-2;

  &.wrap {
    &:before,
    &:after {
      color: #969584;
    }
    &:before {
      content: '{ ';
    }
    &:after {
      content: ' }';
    }
  }
`;

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
  definition: TypedocNode;
  title?: string | null;
  hideName?: boolean;
  showSignature?: boolean;
  arrowStyle?: boolean;
  wrap?: boolean;
}

function TsDocSignatureTitle({
  definition,
  title = null,
  hideName = false,
  arrowStyle = false,
  showSignature = true,
  wrap = false,
}: Props) {
  if (definition.signatures?.length) {
    definition = definition.signatures[0];
  }
  return (
    <span className="signature">
      {!hideName && <code>{title || definition.name}</code>}
      {!!definition.typeParameter?.length &&
        `<${definition.typeParameter.map(p => p.name).join(', ')}>`}
      {showSignature && (
        <Wrapper wrap={wrap}>
          (
          {definition.parameters?.map((param, idx) => (
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
        </Wrapper>
      )}
    </span>
  );
}

export default TsDocSignatureTitle;