import { css } from 'astroturf';
import { graphql } from 'gatsby';
import React from 'react';
// eslint-disable-next-line import/no-cycle
import DocBlock from './DocBlock';
import Heading, { HeadingLevel } from './Heading';

const List = ({ elements, level, ignoreParams }) => (
  <ul
    css={css`
      composes: mt-3 ml-5 p-0 mb-0 from global;
    `}
  >
    {elements
      .filter(param => !ignoreParams.includes(param.name))
      .map(param => (
        <li key={param.name}>
          <DocBlock definition={param} level={level + 1} />
        </li>
      ))}
  </ul>
);

interface ParamsProps {
  definition: any;
  level: HeadingLevel;
  ignoreParams?: string[];
  block?: boolean;
}

function Params({ definition, level = 1, ignoreParams = [] }: ParamsProps) {
  if (definition.params && definition.params.length > 0) {
    return (
      <React.Fragment>
        <Heading level={level}>Parameters</Heading>
        <List
          elements={definition.params}
          level={level}
          ignoreParams={ignoreParams}
        />
      </React.Fragment>
    );
  }
  if (definition.properties && definition.properties.length > 0) {
    return (
      <>
        {level === 1 && <Heading level={level}>Properties</Heading>}
        <List
          elements={definition.properties}
          level={level}
          ignoreParams={ignoreParams}
        />
      </>
    );
  }
  if (
    definition.members &&
    definition.members.static &&
    definition.members.static.length > 0
  ) {
    return (
      <React.Fragment>
        {level === 1 && <Heading level={level}>Fields</Heading>}
        <List
          elements={definition.members.static}
          level={level}
          ignoreParams={ignoreParams}
        />
      </React.Fragment>
    );
  }
  if (definition.type && definition.type.typeDef) {
    return <Params definition={definition.type.typeDef} level={level} />;
  }

  return null;
}

export default Params;

export const fragment = graphql`
  fragment DocumentationParamBase on DocumentationJs {
    params {
      name
      ...DocumentationDescriptionFragment
      ...DocumentationExampleFragment
      ...DocumentationTypeFragment
    }
    properties {
      name
      ...DocumentationExampleFragment
      ...DocumentationTypeFragment
    }
    ...DocumentationTypeFragment
    ...DocumentationDescriptionFragment
    ...DocumentationExampleFragment
    ...DocumentationReturnsFragment
  }
  fragment DocumentationParamsFieldsFragment on DocumentationJs {
    ...DocumentationParamBase
    members {
      static {
        ...DocumentationParamBase
        type {
          typeDef {
            ...DocumentationParamBase
          }
        }
      }
    }
    type {
      typeDef {
        ...DocumentationParamBase
        members {
          static {
            ...DocumentationParamBase
          }
        }
      }
    }
  }
  fragment DocumentationParamsFragmentR1 on DocumentationJs {
    ...DocumentationParamsFieldsFragment
    params {
      ...DocumentationParamsFieldsFragment
    }
    properties {
      ...DocumentationParamsFieldsFragment
    }
    members {
      static {
        ...DocumentationParamsFieldsFragment
      }
    }
    type {
      typeDef {
        ...DocumentationParamsFieldsFragment
      }
    }
  }
  fragment DocumentationParamsFragmentR2 on DocumentationJs {
    ...DocumentationParamsFragmentR1
    params {
      ...DocumentationParamsFragmentR1
    }
    properties {
      ...DocumentationParamsFragmentR1
    }
    members {
      static {
        ...DocumentationParamsFragmentR1
      }
    }
    type {
      typeDef {
        ...DocumentationParamsFragmentR1
      }
    }
  }
  fragment DocumentationParamsFragment on DocumentationJs {
    ...DocumentationParamsFragmentR2
    params {
      ...DocumentationParamsFragmentR2
    }
    properties {
      ...DocumentationParamsFragmentR2
    }
    members {
      static {
        ...DocumentationParamsFragmentR2
      }
    }
    type {
      typeDef {
        ...DocumentationParamsFragmentR2
      }
    }
  }
`;
