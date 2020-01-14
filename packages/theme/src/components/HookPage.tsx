import React from 'react';
import ComponentImport from './ComponentImport';
import DocBlock from './DocBlock';
import Example from './Example';
import LinkedHeading from './LinkedHeading';
import OutlineHeading from './OutlineHeading';
import PageLayout from './PageLayout';

function HookPage({ data }) {
  const { documentation, name, importName, example } = data.docpocalypse;

  return (
    <PageLayout>
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
    </PageLayout>
  );
}

export default HookPage;
