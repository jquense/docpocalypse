/* eslint-disable import/no-cycle */

import { graphql } from 'gatsby';
import React from 'react';

import ExamplesBlock from './JsDocExamples';
import Members from './JsDocMembers';
import Description from './JsDocDescription';
import ReturnBlock from './JsDocReturnBlock';
import { HeadingLevel } from './Heading';

interface Props {
  definition: any;
  depth: HeadingLevel;
  ignoreParams?: string[];
}

const JsDocBlock = ({ definition, depth = 2, ignoreParams = [] }: Props) => {
  if (!definition) return null;

  const nextLevel: HeadingLevel = (depth + 1) as any;

  return (
    <>
      <Description definition={definition} />
      <Members
        definition={definition}
        level={nextLevel}
        ignoreParams={ignoreParams}
      />
      <ReturnBlock definition={definition} level={nextLevel} />
      <ExamplesBlock definition={definition} level={nextLevel} />
    </>
  );
};

export default JsDocBlock;

export const fragment = graphql`
  fragment JsDocBlockFragment on DocumentationJs {
    kind
    ...JsDocDescriptionFragment
    ...JsDocExampleFragment
    ...JsDocMembersFragment
    ...JsDocReturnBlockFragment
  }
`;
