/* eslint-disable import/no-cycle */

import dstyled, { css as dcss } from 'astroturf';
import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React, { ReactNode } from 'react';
import ExamplesBlock from './DocExamples';
import Params from './DocParams';
import ReturnBlock from './DocReturns';
import { SignatureElement } from './DocSignature';
import Heading, { HeadingLevel } from './Heading';

const Optional = dstyled(`span`)`
  &:before {
    content: ' (optional)';
    color: #4084a1;
    font-weight: 400;
  }
`;

const Description = ({ definition }) => {
  const description =
    definition.description || (definition.type && definition.type.typeDef);

  if (description) {
    return (
      <div
        css={dcss`
          margin-top: 0.5em;

          & p {
            margin: 0;
          }
        `}
      >
        <MDXRenderer>{description.childMdx.body}</MDXRenderer>
      </div>
    );
  }

  return null;
};

interface Props {
  definition: any;
  level: HeadingLevel;
  title?: string | null;
  showSignature?: boolean;
  showSignatureNextToTitle?: boolean;
  ignoreParams?: string[];
  className?: string;
}

const DocBlock = ({
  className,
  definition,
  level = 2,
  title = null,
  showSignature = true,
  ignoreParams = []
}: Props) => {
  if (!definition) return null;
  let titleElement: ReactNode = title || definition.name;

  if (typeof titleElement === 'string' && titleElement.match(/\$\d+$/g)) {
    titleElement = 'destructured object';
    // eslint-disable-next-line no-param-reassign
    showSignature = false;
  } else if (titleElement) {
    titleElement = <code>{titleElement}</code>;
  }
  const nextLevel: HeadingLevel = (level + 1) as any;

  return (
    <div className={className}>
      <Heading level={level}>
        <div
          css={dcss`
            @apply inline-block mr-3;
          `}
        >
          {titleElement}
          {showSignature && (
            <>
              {' '}
              <SignatureElement
                definition={definition}
                ignoreParams={ignoreParams}
              />
            </>
          )}
        </div>
        {definition.optional && <Optional />}
      </Heading>

      <Description definition={definition} />
      <Params
        definition={definition}
        level={nextLevel}
        ignoreParams={ignoreParams}
      />
      <ReturnBlock definition={definition} level={nextLevel} />
      <ExamplesBlock definition={definition} level={nextLevel} />
    </div>
  );
};

export default DocBlock;

export const fragment = graphql`
  fragment DocumentationDescriptionFragment on DocumentationJs {
    name
    description {
      childMdx {
        body
      }
    }
  }
  fragment DocumentationFragment on DocumentationJs {
    kind
    ...DocumentationDescriptionFragment
    ...DocumentationExampleFragment
    ...DocumentationParamsFragment
    ...DocumentationReturnsFragment
  }
`;
