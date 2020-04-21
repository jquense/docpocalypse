import { css as dcss } from 'astroturf';
import React from 'react';

import Heading from './Heading';
import List from './List';
import DocBlock from './TsDocBlock';
import TitleSignature from './TsDocTitleSignature';
import { Kind, TypedocNode } from './typedoc-types';
import { getLinkedNode, isObjecty } from './utils/tsDocTypeExpression';

const DocList = ({ elements, depth, ignoreParams }) => (
  <List>
    {(elements as TypedocNode[])
      .filter(param => !ignoreParams.includes(param.name))
      .map(param => (
        <li
          key={param.name}
          css={dcss`
            @component TsDocMemberListItem & {
              margin-top: theme(margin.4);
            }
          `}
        >
          <TitleSignature definition={param} />
          <DocBlock definition={param} depth={depth + 1} hideReturns />
        </li>
      ))}
  </List>
);

interface Props {
  definition: TypedocNode;
  depth?: number;
  ignoreParams?: string[];
  hideProperties?: boolean;
}

const typeParamsWithComment = (params?: TypedocNode[]) =>
  params?.filter(p => p.description);

function TsDocMembers({
  definition,
  depth = 0,
  hideProperties,
  ignoreParams = [],
}: Props) {
  const typeDef = getLinkedNode(definition) ?? definition;
  const typeParams = typeParamsWithComment(definition.typeParameter);
  return (
    <>
      {!!typeParams?.length && (
        <>
          <Heading level={depth}>Type Parameters</Heading>
          <DocList
            depth={depth}
            elements={definition.typeParameter}
            ignoreParams={ignoreParams}
          />
        </>
      )}

      {!!definition.parameters?.length && (
        <>
          <Heading level={depth}>Parameters</Heading>
          <DocList
            depth={depth}
            elements={definition.parameters}
            ignoreParams={ignoreParams}
          />
        </>
      )}
      {!hideProperties && !!typeDef.typedocs?.length && isObjecty(typeDef) && (
        <>
          <DocList
            depth={depth}
            elements={typeDef.typedocs}
            ignoreParams={ignoreParams}
          />
        </>
      )}
    </>
  );
}

export default TsDocMembers;
