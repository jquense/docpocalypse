/* eslint-disable react/no-array-index-key */

import { graphql } from 'gatsby';
import React from 'react';

import DocTypeWrapper from './DocTypeWrapper';
import TsDocFunctionSignature from './TsDocFunctionSignature';
import TypeExpression from './TsDocTypeExpression';
import { TypedocNode } from './typedoc-types';
import { getFunctionNode } from './utils/tsDocTypeExpression';

interface SignatureProps {
  definition: TypedocNode;
  ignoreParams?: string[];
  compact?: boolean;
  arrowStyle?: boolean;
}

export default function TsDocTypeSignature({
  definition,
  arrowStyle,
  compact,
  ignoreParams = [],
}: SignatureProps) {
  // eventually resolves to a function call
  if (getFunctionNode(definition)) {
    return (
      <TsDocFunctionSignature
        compact={compact}
        definition={definition}
        ignoreParams={ignoreParams}
        arrowStyle={arrowStyle}
      />
    );
  }

  if (definition.type) {
    return (
      <DocTypeWrapper>
        <TypeExpression type={definition.type} compact />
      </DocTypeWrapper>
    );
  }

  if (definition.name) {
    return (
      <DocTypeWrapper>
        <span className="token builtin">{definition.name}</span>
      </DocTypeWrapper>
    );
  }

  return null;
}

export const fragment = graphql`
  fragment JsDocTypeFragment on DocumentationJs {
    optional
    type {
      name
      type
      elements
      expression
      applications
    }
  }
`;
