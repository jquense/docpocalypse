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
      ...DocpocalypseBase
      example {
        ...Example_example
      }
      description {
        ...PropsTable_description
      }
      ...PropsTable_metadata
    }
  }
`;
