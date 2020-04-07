/* eslint-disable import/no-cycle */

import { css as dcss } from 'astroturf';
import { graphql } from 'gatsby';
import React from 'react';

import TypeSignature from './JsDocTypeSignature';

interface Props {
  definition: any;
  title?: React.ReactNode;
  showSignature?: boolean;
  ignoreParams?: string[];
  className?: string;
}

const JsDocTitleSignature = ({
  definition,
  title,
  showSignature = true,
  ignoreParams = [],
  className,
}: Props) => {
  if (!title && definition.name) {
    title = (
      <code>
        {definition.name}
        {definition.optional && '?'}
      </code>
    );
  }

  return (
    <div
      className={className}
      css={dcss`
        @component JsDocTitleSignature & {
          @apply inline-flex items-center;

          margin: calc(theme(margin.2) / -2);
          flex-wrap: wrap;

          & > *  {
            margin:  calc(theme(margin.2) / 2);
          }
        }
      `}
    >
      {title}
      {showSignature && (
        <TypeSignature definition={definition} ignoreParams={ignoreParams} />
      )}
    </div>
  );
};

export default JsDocTitleSignature;

export const fragment = graphql`
  fragment JsDocDescriptionFragment on DocumentationJs {
    name
    description {
      childMdx {
        body
      }
    }
  }
  fragment DocumentationFragment on DocumentationJs {
    kind
    ...JsDocDescriptionFragment
    ...JsDocExampleFragment
    ...JsDocMembersFragment
    ...JsDocReturnBlockFragment
  }
`;
