import { graphql } from 'gatsby';
import React from 'react';
import HookPage from '../components/HookPage';

function HookPageTemplate(props) {
  return <HookPage {...props} />;
}

export default HookPageTemplate;

export const pageQuery = graphql`
  query($nodeId: String) {
    docpocalypse(id: { eq: $nodeId }) {
      id
      name
      example {
        ...Example_example
      }
      documentation {
        ...DocumentationFragment
      }
    }
  }
`;
