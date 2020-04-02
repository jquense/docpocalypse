/* eslint-disable import/no-cycle */

import { css as dcss } from 'astroturf';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';

const JsDocDescription = ({ definition }) => {
  const description =
    definition.description || (definition.type && definition.type.typeDef);

  if (!description) return null;

  return (
    <div
      css={dcss`
        @component JsDocDescription & {
          margin-top: 0.5em;

          & p {
            margin: 0;
          }
        }
      `}
    >
      <MDXRenderer>{description.childMdx.body}</MDXRenderer>
    </div>
  );
};

export default JsDocDescription;

export const fragment = graphql`
  fragment JsDocDescriptionFragment on DocumentationJs {
    name
    description {
      childMdx {
        body
      }
    }
  }
`;
