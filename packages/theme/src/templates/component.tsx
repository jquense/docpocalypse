import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';
import { highlight } from '@docpocalypse/code-live';
import ApiLayout from '../components/ApiLayout';
import Example from '../components/Example';
import LinkedHeading from '../components/LinkedHeading';
import Heading from '../components/OutlineHeading';
import PropsTable from '../components/PropsTable';

const propTypes = {};

function ComponentPageTemplate({ data }) {
  const { metadata, importName, name, example } = data.docpocalypse;

  return (
    <ApiLayout>
      <div>
        <Heading h={1} id={`${name}-page`} title={name}>
          {name}
        </Heading>
      </div>

      <Example example={example} name={name} />

      <LinkedHeading h={2} id={`${name}-api`}>
        API
      </LinkedHeading>
      <div>
        {importName && (
          <code
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: highlight(importName, 'js')
            }}
          />
        )}
      </div>

      {metadata.description && metadata.description.childMdx && (
        <div>
          <MDXRenderer scope={{ React }}>
            {metadata.description.childMdx.body}
          </MDXRenderer>
        </div>
      )}
      <PropsTable metadata={metadata} />
    </ApiLayout>
  );
}

ComponentPageTemplate.propTypes = propTypes;

export default ComponentPageTemplate;

export const pageQuery = graphql`
  query($nodeId: String) {
    docpocalypse(id: { eq: $nodeId }) {
      id
      name
      importName
      example {
        ...Example_example
      }
      metadata {
        id
        description {
          childMdx {
            body
          }
        }
        ...PropsTable_metadata
      }
    }
  }
`;
