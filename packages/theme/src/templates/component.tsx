import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';
import ComponentImport from '../components/ComponentImport';
import Example from '../components/Example';
import LinkedHeading from '../components/LinkedHeading';
import Heading from '../components/OutlineHeading';
import PageLayout from '../components/PageLayout';
import PropsTable from '../components/PropsTable';

const propTypes = {};

function ComponentPageTemplate({ data }) {
  const { metadata, importName, name, example } = data.docpocalypse;

  return (
    <PageLayout>
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
          <ComponentImport
            importName={importName}
            docNode={data.docpocalypse}
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
    </PageLayout>
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
