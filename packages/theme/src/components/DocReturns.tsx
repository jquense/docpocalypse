import { graphql } from 'gatsby';
import React from 'react';
// eslint-disable-next-line import/no-cycle
import DocBlock from './DocBlock';
import Heading, { HeadingLevel } from './Heading';

interface Props {
  definition: any;
  level: HeadingLevel;
}

export default function DocReturns({ definition, level }: Props) {
  if (definition.returns && definition.returns.length > 0) {
    return (
      <div>
        <Heading level={level}>Return value</Heading>
        <DocBlock
          definition={definition.returns[0]}
          level={(level + 1) as HeadingLevel}
        />
      </div>
    );
  }
  if (definition.type && definition.type.typeDef) {
    return <DocReturns definition={definition.type.typeDef} level={level} />;
  }
  return null;
}

export const fragment = graphql`
  fragment DocumentationReturnsFragment on DocumentationJs {
    returns {
      ...DocumentationDescriptionFragment
      ...DocumentationTypeFragment
    }
  }
`;
