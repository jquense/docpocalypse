import dstyled from 'astroturf';
import React from 'react';

import Heading from './Heading';
import List from './List';
import DocBlock from './TsDocBlock';
import TitleSignature from './TsDocTitleSignature';
import TsDocTypeExpression from './TsDocTypeExpression';
import { TypedocNode } from './typedoc-types';
import typeExpression, {
  getLinkedNode,
  getPropertyKey,
  isObjecty,
  propertyEntries,
} from './utils/tsDocTypeExpression';

const DocListItem = dstyled('li')`
  @component TsDocMemberListItem & {
    margin-top: theme(margin.4);
  }
`;

interface Props {
  definition: TypedocNode;
  depth?: number;
  ignoreParams?: string[];
  hideProperties?: boolean;
}

const typeParamsWithComment = (params?: TypedocNode[]) =>
  params?.filter((p) => p.description);

function TsDocMembers({ definition, depth = 0, hideProperties }: Props) {
  const typeDef = getLinkedNode(definition) ?? definition;
  const typeParams = typeParamsWithComment(definition.typeParameter);
  return (
    <>
      {!!typeParams?.length && (
        <>
          <Heading level={depth}>Type Parameters</Heading>
          <List>
            {definition.typeParameter!.map((param) => (
              <DocListItem key={param.name}>
                <TitleSignature definition={param} />
                <DocBlock definition={param} depth={depth + 1} hideReturns />
              </DocListItem>
            ))}
          </List>
        </>
      )}

      {!!definition.parameters?.length && (
        <>
          <Heading level={depth}>Parameters</Heading>
          <List>
            {definition.parameters.map((param) => (
              <DocListItem key={param.name}>
                <TitleSignature definition={param} />
                <DocBlock definition={param} depth={depth + 1} hideReturns />
              </DocListItem>
            ))}
          </List>
        </>
      )}
      {!hideProperties && !!typeDef.typedocs?.length && isObjecty(typeDef) && (
        <>
          <Heading level={depth}>
            <TsDocTypeExpression type={typeDef} compact />
          </Heading>
          <List>
            {propertyEntries(typeDef.typedocs).map(([keyNode, valueNode]) => (
              <DocListItem key={valueNode.name}>
                <TitleSignature
                  title={<code>{getPropertyKey(keyNode)}</code>}
                  definition={valueNode}
                />
                <DocBlock
                  definition={valueNode}
                  depth={depth + 1}
                  hideReturns
                />
              </DocListItem>
            ))}
          </List>
        </>
      )}
    </>
  );
}

export default TsDocMembers;
