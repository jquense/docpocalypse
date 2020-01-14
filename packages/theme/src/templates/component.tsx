import { graphql } from 'gatsby';
import React from 'react';
import ComponentPage from '../components/ComponentPage';

export default function ComponentPageTemplate(props) {
  return <ComponentPage {...props} />;
}

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
