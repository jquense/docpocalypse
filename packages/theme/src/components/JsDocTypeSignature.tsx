/* eslint-disable react/no-array-index-key */

import { graphql } from 'gatsby';
import React from 'react';

import DocTypeWrapper from './DocTypeWrapper';
import JsDocFunctionSignature, {
  isFunctionDef,
} from './JsDocFunctionSignature';
import TypeExpression from './JsDocTypeExpression';

const TypeComponent = ({ children }) => (
  <span className="token builtin">{children}</span>
);

interface SignatureProps {
  definition: any;
  ignoreParams?: string[];
  fallbackToName?: boolean;
  block?: boolean;
}

export default function JsDocSignature({
  definition,
  ignoreParams = [],
  fallbackToName = false,
  block = false,
}: SignatureProps) {
  if (isFunctionDef(definition, false)) {
    return (
      <JsDocFunctionSignature
        block={block}
        definition={definition}
        ignoreParams={ignoreParams}
      />
    );
  }

  if (definition.type && definition.type.typeDef) {
    return (
      <JsDocSignature
        definition={definition.type.typeDef}
        fallbackToName
        block={block}
      />
    );
  }

  if (definition.type) {
    return (
      <DocTypeWrapper block={block}>
        <TypeExpression type={definition.type} />
      </DocTypeWrapper>
    );
  }

  if (fallbackToName && definition.name) {
    return (
      <DocTypeWrapper block={block}>
        <TypeComponent>{definition.name}</TypeComponent>
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
