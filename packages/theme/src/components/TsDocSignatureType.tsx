/* eslint-disable react/no-array-index-key */
// Types are defined in https://github.com/TypeStrong/typedoc/blob/master/src/lib/models/types/index.ts
import React from 'react';
// eslint-disable-next-line import/no-cycle
import TsDocSignatureTitle from './TsDocSignatureTitle';
import { TypedocType } from './typedoc-types';

function Parens({
  children,
  needParens = false,
  openParen = '(',
  closeParen = ')',
}: {
  children: React.ReactNode;
  needParens?: boolean;
  openParen?: string;
  closeParen?: string;
}) {
  return (
    <>
      {needParens && openParen}
      {children}
      {needParens && closeParen}
    </>
  );
}

interface Props {
  type: TypedocType;
  needParens?: boolean;
}

export default function TsDocSignatureType({
  type,
  needParens = false,
}: Props) {
  if (!type) return null;

  if (
    type.type === 'intrinsic' ||
    type.type === 'typeParameter' ||
    type.type === 'unknown'
  ) {
    return <>{type.name}</>;
  }

  if (type.type === 'array') {
    return (
      <>
        <TsDocSignatureType type={type.elementType!} needParens />
        []
      </>
    );
  }

  if (type.type === 'conditional') {
    return (
      <Parens needParens={needParens}>
        <TsDocSignatureType type={type.checkType} needParens />
        extends
        <TsDocSignatureType type={type.extendsType} needParens />
        ?
        <TsDocSignatureType type={type.trueType} />
        :
        <TsDocSignatureType type={type.falseType} />
      </Parens>
    );
  }

  if (type.type === 'indexedAccess') {
    return (
      <>
        <TsDocSignatureType type={type.objectType} />
        [<TsDocSignatureType type={type.indexType} />]
      </>
    );
  }

  if (type.type === 'inferred') {
    return <>{`infer ${type.name}`}</>;
  }

  if (type.type === 'intersection') {
    return (
      <Parens needParens={needParens}>
        {type.types.map((tt, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ' & '}
            <TsDocSignatureType type={tt} />
          </React.Fragment>
        ))}
      </Parens>
    );
  }

  if (type.type === 'predicate') {
    return (
      <>
        {type.asserts && 'asserts '}
        {type.name}
        {type.targetType && <TsDocSignatureType type={type.targetType} />}
      </>
    );
  }

  if (type.type === 'query') {
    return (
      <>
        typeof
        <TsDocSignatureType type={type.queryType} />
      </>
    );
  }

  if (type.type === 'reference') {
    return (
      <>
        {type.reference?.name ?? type.name}
        {!!type.typeArguments?.length && (
          <>
            &lt;
            {type.typeArguments.map((typeArgument, idx) => (
              <React.Fragment key={idx}>
                {!!idx && ', '}
                <TsDocSignatureType type={typeArgument} />
              </React.Fragment>
            ))}
            &gt;
          </>
        )}
      </>
    );
  }

  if (type.type === 'reflection') {
    if (type.declaration.typedocs?.length) {
      // { Object literal }
      return (
        <Parens openParen="{" closeParen="}" needParens>
          {type.declaration.typedocs.map((child, idx) => (
            <React.Fragment key={child.id}>
              {idx > 0 && '; '}
              {child.name}
              {child.flags.isOptional ? '?:' : ':'}
              {child.type ? (
                <TsDocSignatureType type={child.type} />
              ) : (
                <TsDocSignatureTitle hideName definition={child} />
              )}
            </React.Fragment>
          ))}
        </Parens>
      );
    }

    if (type.declaration.signatures && type.declaration.signatures.length > 0) {
      if (type.declaration.signatures.length > 1) {
        return (
          <Parens openParen="{" closeParen="}" needParens>
            {type.declaration.signatures.map((signature, idx) => (
              <React.Fragment key={signature.id}>
                {idx > 0 && '; '}
                <TsDocSignatureTitle
                  key={signature.id}
                  definition={signature}
                  hideName
                />
              </React.Fragment>
            ))}
          </Parens>
        );
      }

      return (
        <Parens needParens={needParens}>
          <TsDocSignatureTitle
            definition={type.declaration.signatures[0]}
            hideName
            arrowStyle
          />
        </Parens>
      );
    }

    return <>{'{}'}</>;
  }

  if (type.type === 'stringLiteral') {
    return <>&quot;{type.value}&quot;</>;
  }

  if (type.type === 'tuple') {
    return (
      <Parens openParen="[" closeParen="]" needParens>
        {type.elements.map((element, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ', '}
            <TsDocSignatureType type={element} />
          </React.Fragment>
        ))}
      </Parens>
    );
  }

  if (type.type === 'typeOperator') {
    return (
      <>
        {type.operator}
        <TsDocSignatureType type={type.target} />
      </>
    );
  }

  if (type.type === 'union') {
    return (
      <Parens needParens={needParens}>
        {type.types.map((tt, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && ' | '}
            <TsDocSignatureType type={tt} needParens />
          </React.Fragment>
        ))}
      </Parens>
    );
  }

  return <>void</>;
}
