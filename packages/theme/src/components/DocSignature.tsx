/* eslint-disable react/no-array-index-key */
import styled from 'astroturf';
import { graphql } from 'gatsby';
import React from 'react';
import Heading, { HeadingLevel } from './Heading';

const Wrapper = styled('span')<{ block?: boolean }>`
  &.block {
    display: block;
    margin-top: 20px;
  }
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
`;

const join = (arrayOfElements, joiner) =>
  arrayOfElements.reduce((acc, current, index) => {
    if (index > 0) {
      acc.push(
        React.cloneElement(joiner, {
          key: `joiner ${index}`,
        }),
      );
    }
    acc.push(current);

    return acc;
  }, []);

const TypeComponent = ({ children }) => (
  <span className="token builtin">{children}</span>
);

const Punctuation = ({ children }) => (
  <span className="token punctuation">{children}</span>
);

const Operator = ({ children }) => (
  <span className="token operator">{children}</span>
);

const TypeExpression = ({ type }) => {
  if (type.type === `RecordType`) {
    return <TypeComponent>object</TypeComponent>;
  }
  if (type.type === `NameExpression`) {
    return <TypeComponent>{type.name}</TypeComponent>;
  }
  if (type.type === `NullLiteral`) {
    return <TypeComponent>null</TypeComponent>;
  }
  if (type.type === `UndefinedLiteral`) {
    return <TypeComponent>undefined</TypeComponent>;
  }
  if (type.type === `UnionType`) {
    return (
      <>
        {join(
          type.elements.map((element, index) => (
            <TypeExpression key={`union element ${index}`} type={element} />
          )),
          <Operator> | </Operator>,
        )}
      </>
    );
  }
  if (type.type === `TypeApplication` && type.expression) {
    if (type.expression.name === `Array`) {
      return (
        <>
          <TypeExpression type={type.applications[0]} />
          <Operator>[]</Operator>
        </>
      );
    }
    return (
      <>
        <TypeExpression type={type.expression} />
        {`<`}
        <TypeExpression type={type.applications[0]} />
        {`>`}
      </>
    );
  }
  return null;
};

interface FunctionSignatureProps {
  definition: any;
  ignoreParams: string[];
  block?: boolean;
}

function FunctionSignature({
  definition,
  block,
  ignoreParams,
}: FunctionSignatureProps) {
  const params = definition.params
    ? definition.params
        .filter(param => !ignoreParams.includes(param.name))
        .map((param, index) => (
          <React.Fragment key={param.name}>
            {index > 0 && <Punctuation>, </Punctuation>}
            {param.name}
            {param.type && (
              <>
                <Punctuation>{param.optional && '?'}:</Punctuation>{' '}
                <TypeExpression type={param.type} />
              </>
            )}
          </React.Fragment>
        ))
    : null;

  return (
    <Wrapper block={block}>
      <Punctuation>(</Punctuation>
      {params}
      <Punctuation>)</Punctuation> <Operator>=&gt;</Operator>{' '}
      {definition.returns && definition.returns.length ? (
        <TypeExpression type={definition.returns[0].type} />
      ) : (
        <TypeComponent>void</TypeComponent>
      )}
    </Wrapper>
  );
}

const isFunctionDef = (definition: any, recursive = true) =>
  (definition.params && definition.params.length > 0) ||
  (definition.returns && definition.returns.length > 0) ||
  (recursive &&
    definition.type &&
    definition.type.typeDef &&
    isFunctionDef(definition.type.typeDef, false));

interface SignatureProps {
  definition: any;
  ignoreParams?: string[];
  fallbackToName?: boolean;
  block?: boolean;
}

function SignatureElement({
  definition,
  ignoreParams = [],
  fallbackToName = false,
  block = false,
}: SignatureProps) {
  if (isFunctionDef(definition, false)) {
    return (
      <FunctionSignature
        block={block}
        definition={definition}
        ignoreParams={ignoreParams}
      />
    );
  }

  if (definition.type && definition.type.typeDef) {
    return (
      <SignatureElement
        definition={definition.type.typeDef}
        fallbackToName
        block={block}
      />
    );
  }

  if (definition.type) {
    return (
      <Wrapper block={block}>
        <TypeExpression type={definition.type} />
      </Wrapper>
    );
  }

  if (fallbackToName && definition.name) {
    return (
      <Wrapper block={block}>
        <TypeComponent>{definition.name}</TypeComponent>
      </Wrapper>
    );
  }

  return null;
}

const SignatureBlock = ({ definition, level = 1 }) => (
  <>
    <Heading level={level as HeadingLevel}>Signature</Heading>
    <SignatureElement definition={definition} />
  </>
);

export {
  isFunctionDef,
  SignatureElement,
  SignatureBlock,
  TypeComponent,
  Wrapper as SignatureWrapper,
};

export const fragment = graphql`
  fragment DocumentationTypeFragment on DocumentationJs {
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
