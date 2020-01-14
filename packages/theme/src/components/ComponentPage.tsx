import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';
import ComponentImport from './ComponentImport';
import Example from './Example';
import LinkedHeading from './LinkedHeading';
import Heading from './OutlineHeading';
import PageLayout from './PageLayout';
import PropsTable from './PropsTable';

function ComponentPage({ data }) {
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

export default ComponentPage;
