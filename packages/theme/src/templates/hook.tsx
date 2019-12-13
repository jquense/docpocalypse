import { graphql } from 'gatsby';
import React from 'react';
import ApiLayout from '../components/ApiLayout';
import ComponentImport from '../components/ComponentImport';
import DocBlock from '../components/DocBlock';
import Example from '../components/Example';
import LinkedHeading from '../components/LinkedHeading';
import OutlineHeading from '../components/OutlineHeading';

const propTypes = {};

function HookPageTemplate({ data }) {
  const { documentation, name, importName, example } = data.docpocalypse;

  return (
    <ApiLayout>
      <div>
        <OutlineHeading h={1} id={`${name}-page`} title={name}>
          {name}
          {importName && (
            <ComponentImport
              importName={importName}
              docNode={data.docpocalypse}
            />
          )}
        </OutlineHeading>
      </div>
      <Example example={example} name={name} />

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
        ...Example_example
      }
      documentation {
        ...DocumentationFragment
      }
    }
  }
`;
