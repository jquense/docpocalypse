import React from 'react';

import DocTypeWrapper from './DocTypeWrapper';
import { InlineHighlight } from './InlineTypeHighlight';
import { TypedocNode } from './typedoc-types';
import typeExpression, {
  getFunctionNode,
  getLinkedNode,
  getReadableName,
} from './utils/tsDocTypeExpression';

export interface TsDocFunctionSignatureProps {
  definition: TypedocNode;
  ignoreParams: string[];
  arrowStyle?: boolean;
  compact?: boolean;
}

export const getParams = (
  def: TypedocNode,
  {
    includeTypes = true,
    ignoreParams = [],
  }: { includeTypes?: boolean; ignoreParams?: string[] } = {},
) =>
  def.parameters
    ? def
        .parameters!.filter(param => !ignoreParams.includes(param.name))
        .map(param => {
          const name = getReadableName(param);
          const type =
            param.type && includeTypes ? `: ${typeExpression(param.type)}` : '';

          return `${param.flags.isRest ? '...' : ''}${name}${
            param.flags.isOptional ? '?' : ''
          }${type}`;
        })
    : [];

export const getReturnType = (definition: TypedocNode) => {
  if (definition.signatures?.length)
    return getReturnType(definition.signatures[0]);

  const typeNode = getLinkedNode(definition);
  if (typeNode) return getReturnType(typeNode);
  return definition.type || definition || { name: 'void', type: 'intrinsic' };
};

export default function TsDocFunctionSignature({
  definition,
  ignoreParams,
  arrowStyle = true,
  compact = true,
}: TsDocFunctionSignatureProps) {
  const def = getFunctionNode(definition);

  if (!def) return null;

  const typeParams = definition.typeParameter?.length
    ? `<${definition.typeParameter.map(p => p.name).join(', ')}>`
    : '';

  const params = getParams(def, { ignoreParams });

  const returnType = getReturnType(definition);

  return (
    <DocTypeWrapper>
      <InlineHighlight
        code={`${typeParams}(${params.join(', ')})${
          arrowStyle ? ' => ' : ': '
        }${typeExpression(returnType, { compact })}`}
      />
    </DocTypeWrapper>
  );
}
