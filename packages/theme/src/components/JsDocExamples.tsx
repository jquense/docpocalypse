/* eslint-disable react/no-array-index-key */
import { graphql } from 'gatsby';
import React from 'react';
import Heading, { HeadingLevel } from './Heading';

function JsDocExample({
  definition,
  level,
}: {
  definition: any;
  level: HeadingLevel;
}) {
  const examples =
    definition.examples && definition.examples.length
      ? definition.examples
      : definition.type && definition.type.typeDef;

  if (examples && examples.length) {
    return (
      <div>
        <Heading level={level}>Example</Heading>
        {definition.examples.map((example, i) => (
          <div className="gatsby-highlight">
            <pre key={`example ${i}`} className="language-javascript">
              <code
                className="language-javascript"
                dangerouslySetInnerHTML={{
                  __html: example.highlighted,
                }}
              />
            </pre>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default JsDocExample;

export const fragment = graphql`
  fragment JsDocExampleFragment on DocumentationJs {
    examples {
      highlighted
    }
    type {
      typeDef {
        examples {
          highlighted
        }
      }
    }
  }
`;
