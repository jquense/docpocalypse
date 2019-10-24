import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';
import ApiLayout from '../components/ApiLayout';
import DocBlock from '../components/DocBlock';
import LinkedHeading from '../components/LinkedHeading';
import Heading from '../components/OutlineHeading';
import ExamplesBlock from './DocExamples';
import Params from './DocParams';
import ReturnBlock from './DocReturns';
import {
  SignatureElement,
  SignatureWrapper,
  TypeComponent,
  isFunctionDef,
} from './DocSignature';

const propTypes = {};

function HookPageTemplate({ data }) {
  const { documentation, name, importName, example } = data.docpocalypse;

  return (
    <ApiLayout>
      <div>
        <Heading h={1} id={`${name}-page`} title={name}>
          {name}
          {importName && <code>{importName}</code>}
        </Heading>
      </div>
      {example ? <MDXRenderer>{example.body}</MDXRenderer> : 'No example'}

      <LinkedHeading h={2} id={`${name}-api`}>
        API
      </LinkedHeading>

      <DocBlock
        definition={documentation}
        showSignatureNextToTitle={false}
        level={3}
      />
    </ApiLayout>
  );
}

HookPageTemplate.propTypes = propTypes;

export default HookPageTemplate;

export const pageQuery = graphql`
  query($nodeId: String) {
    docpocalypse(id: { eq: $nodeId }) {
      id
      name
      example {
        body
      }
      documentation {
        ...DocumentationFragment
      }
    }
  }
`;
