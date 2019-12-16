import React from 'react';
import { highlight } from '@docpocalypse/code-live';
import { DocumentationNode } from '@docpocalypse/gatsby-theme-core';

interface Props {
  importName: string;
  docNode?: DocumentationNode;
}

function ComponentImport({ importName, docNode: _, ...props }: Props) {
  return (
    <code
      {...props}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: highlight(importName, 'js')
      }}
    />
  );
}

export default ComponentImport;
