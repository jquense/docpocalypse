import { MDXRenderer } from 'gatsby-plugin-mdx';
import React from 'react';

import ComponentImport from './ComponentImport';
import Example from './Example';
import LinkedHeading from './LinkedHeading';
import Heading from './OutlineHeading';
import PageLayout from './PageLayout';

let Props: any;

if (process.env.DOCPOC_PROPS_LAYOUT === 'list') {
  Props = require('./PropsList').default;
} else {
  Props = require('./PropsTable').default;
}

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
      <Props metadata={data.docpocalypse} />
    </PageLayout>
  );
}

export default ComponentPage;
