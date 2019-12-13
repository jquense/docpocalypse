import React from 'react';
import { highlight } from '@docpocalypse/code-live';

interface Props {
  importName: string;
  docNode: any;
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
