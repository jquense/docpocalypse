import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';

import ComponentImport from './ComponentImport';
import Example from './Example';
import LinkedHeading from './LinkedHeading';
import Heading from './OutlineHeading';
import PageLayout from './PageLayout';
import PropsTable from './PropsTable';

function ComponentPage({ data }) {
  const { description, importName, name, example } = data.docpocalypse;

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

      {description?.mdx && (
        <div>
          <MDXRenderer scope={{ React }}>{description.mdx.body}</MDXRenderer>
        </div>
      )}
      <PropsTable metadata={data.docpocalypse} />
    </PageLayout>
  );
}

export default ComponentPage;
