/* eslint-disable import/no-cycle */

import { graphql } from 'gatsby';
import React from 'react';

import DocBlock from './JsDocBlock';
import Heading, { HeadingLevel } from './Heading';
import JsDocTitleSignature from './JsDocTitleSignature';

interface Props {
  definition: any;
  level: HeadingLevel;
}

export default function JsDocReturnBlock({ definition, level }: Props) {
  let def = definition.returns?.length ? definition : definition.type?.typeDef;

  if (!def?.returns?.length) return null;

  def = definition.returns[0];

  return (
    <>
      <Heading level={level}>
        Return Value <JsDocTitleSignature definition={def} />
      </Heading>
      <DocBlock definition={def} depth={level} />
    </>
  );
}

export const fragment = graphql`
  fragment JsDocReturnBlockFragment on DocumentationJs {
    returns {
      ...JsDocDescriptionFragment
      ...JsDocTypeFragment
    }
  }
`;
