import { css as dcss } from 'astroturf';
import React from 'react';
import ComponentImport from './ComponentImport';
import DocBlock from './DocBlock';
import Example from './Example';
import LinkedHeading from './LinkedHeading';
import OutlineHeading from './OutlineHeading';
import PageLayout from './PageLayout';

function HookPage({ data }) {
  const { signatures, name, importName, example } = data.docpocalypse;

  return (
    <PageLayout>
      <div>
        <OutlineHeading h={1} id={`${name}-page`} title={name}>
          {name}
        </OutlineHeading>
      </div>
      <Example example={example} name={name} />

      <LinkedHeading h={2} id={`${name}-api`}>
        API
      </LinkedHeading>
      {importName && (
        <ComponentImport importName={importName} docNode={data.docpocalypse} />
      )}
      {signatures?.map(doc => (
        <DocBlock
          definition={doc}
          showSignatureNextToTitle={false}
          level={3}
          css={dcss`
            @apply mt-8;
          `}
        />
      ))}
    </PageLayout>
  );
}

export default HookPage;
