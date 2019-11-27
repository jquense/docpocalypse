import { css } from 'astroturf';
import { graphql } from 'gatsby';
import React from 'react';
import renderProps from '@docpocalypse/props-table';
import { TokenMap } from '@docpocalypse/props-table/src/TypescriptTypeValue';

export { renderProps };

const tokenMap: TokenMap = css`
  .union {
    & > *:not(:last-child)::after {
      content: ' | ';
    }
  }
`;

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
        css={css`
          composes: px-4 from global;
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
              <td dangerouslySetInnerHTML={{ __html: prop.description }} />
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
  fragment Description_markdown on ComponentDescription {
    childMarkdownRemark {
      html
    }
  }
  fragment PropsTable_metadata on ComponentMetadata {
    composes
    displayName
    description {
      ...Description_markdown
    }
    props {
      name
      doclets
      defaultValue {
        value
        computed
      }
      description {
        ...Description_markdown
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
