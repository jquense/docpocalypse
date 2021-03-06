import renderProps from '@docpocalypse/props-table';
import { TokenMap } from '@docpocalypse/props-table/src/TypescriptTypeValue';
import { css as dcss } from 'astroturf';
import { graphql } from 'gatsby';
import React from 'react';

import PropDescription from './PropDescription';

export { renderProps };

const tokenMap: TokenMap = dcss`
  .union {
    & > * {
      display: block;
    }

    & :global(.pt-elements)  & > * {
      padding-left: theme('spacing.3')
    }

    & > *::before {
      content: '| ';
    }
    & > &::before {
      content: '';
    }
  }
`;

/** @public */
function PropsTable({ metadata }) {
  const props = renderProps(metadata.props || [], {
    tokenMap
  });

  if (!props.length) {
    return null;
  }

  return (
    <>
      <table
        css={dcss`
          @apply py-4 mt-6;

          display: grid;
          width: auto;
          border-collapse: collapse;
          grid-gap: 2rem;
          grid-template-columns: repeat(3, minmax(auto, 1fr)) 2fr;

          & thead,
          & tbody,
          & tr {
            display: contents;
          }

          & th {
            text-align: left;
          }
        `}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map(prop => (
            <tr key={prop.name}>
              <td>{prop.name}</td>
              <td className="font-mono whitespace-pre">{prop.type}</td>
              <td className="font-mono whitespace-pre">{prop.defaultValue}</td>
              <PropDescription
                as="td"
                html={prop.description}
                mdx={prop.propData.description?.mdx}
              />
            </tr>
          ))}
        </tbody>
      </table>
      {/* {metadata.composes && metadata.composes.length && (
        <Text size="body" color="primary" className="pt-4">
          Props also compose:{' '}
          <span className="text-monospace">
            {metadata.composes.join(', ')}
          </span>
        </Text>
      )} */}
    </>
  );
}

export const metadataFragment = graphql`
  fragment PropsTable_description on ComponentDescription {
    mdx {
      body
    }
    markdownRemark {
      html
    }
  }

  fragment PropsTable_metadata on Docpocalypse {
    composes {
      path
      metadata {
        displayName
      }
    }
    name
    description {
      ...PropsTable_description
    }
    props {
      name
      tags {
        name
        value
      }
      defaultValue {
        value
        computed
      }
      description {
        ...PropsTable_description
      }
      required
      tsType
      type {
        name
        value
        raw
      }
    }
  }
`;

export default PropsTable;
