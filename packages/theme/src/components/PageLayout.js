import React from 'react';

import Box from './Box';
import DocumentOutlineProvider from './DocumentOutlineProvider';

export default function PageLayout({ children }) {
  return (
    <Box display="flex" direction="col" minVh100>
      <DocumentOutlineProvider>{children}</DocumentOutlineProvider>
    </Box>
  );
}
