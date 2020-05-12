/* eslint-disable react/jsx-indent */
import dstyled from 'astroturf';
import React from 'react';

import ComponentImport from './ComponentImport';
import Example from './Example';
import HookSignature from './HookSignature';
import LinkedHeading from './LinkedHeading';
import OutlineHeading from './OutlineHeading';
import PageLayout from './PageLayout';

const SignatureList = dstyled('ul')`
  list-style: none;
  counter-reset: signature-list-counter;

  & > li {
    counter-increment: signature-list-counter;
  }
`;

function HookPage({ data }) {
  const { signatures, tsType, name, importName, example } = data.docpocalypse;

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
      <SignatureList>
        {tsType?.signatures
          ? tsType?.signatures.map((doc) => (
              <HookSignature level={3} tsDocType={doc} />
            ))
          : signatures?.map((doc) => (
              <HookSignature level={3} jsDocType={doc} />
            ))}
      </SignatureList>
    </PageLayout>
  );
}

export default HookPage;
