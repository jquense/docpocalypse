import { graphql } from 'gatsby';
import { css as dcss } from 'astroturf';
import React from 'react';

// eslint-disable-next-line import/no-cycle
import DocBlock from './JsDocBlock';
import Heading, { HeadingLevel } from './Heading';
import List from './List';

import TitleSignature from './JsDocTitleSignature';

const DocList = ({ elements, level, ignoreParams }) => (
  <List>
    {elements
      .filter(param => !ignoreParams.includes(param.name))
      .map(param => (
        <li
          key={param.name}
          css={dcss`
            @component JsDocMemberListItem & {
              margin-top: theme(margin.4);
            }
          `}
        >
          <TitleSignature definition={param} />
          <DocBlock definition={param} depth={level + 1} />
        </li>
      ))}
  </List>
);

interface ParamsProps {
  definition: any;
  level: HeadingLevel;
  ignoreParams?: string[];
  block?: boolean;
}

function JsDocMembers({
  definition,
  level = 1,
  ignoreParams = [],
}: ParamsProps) {
  if (definition.params && definition.params.length > 0) {
    return (
      <>
        <Heading level={level}>Parameters</Heading>
        <DocList
          level={level}
          elements={definition.params}
          ignoreParams={ignoreParams}
        />
      </>
    );
  }
  if (definition.properties && definition.properties.length > 0) {
    return (
      <>
        {level === 1 && <Heading level={level}>Properties</Heading>}
        <DocList
          level={level}
          elements={definition.properties}
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
      <>
        {level === 1 && <Heading level={level}>Fields</Heading>}
        <DocList
          level={level}
          elements={definition.members.static}
          ignoreParams={ignoreParams}
        />
      </>
    );
  }
  if (definition.type && definition.type.typeDef) {
    return <JsDocMembers definition={definition.type.typeDef} level={level} />;
  }

  return null;
}

export default JsDocMembers;

export const fragment = graphql`
  fragment DocumentationParamBase on DocumentationJs {
    params {
      name
      ...JsDocDescriptionFragment
      ...JsDocExampleFragment
      ...JsDocTypeFragment
    }
    properties {
      name
      ...JsDocExampleFragment
      ...JsDocTypeFragment
    }
    ...JsDocTypeFragment
    ...JsDocDescriptionFragment
    ...JsDocExampleFragment
    ...JsDocReturnBlockFragment
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
  fragment JsDocMembersFragment on DocumentationJs {
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
