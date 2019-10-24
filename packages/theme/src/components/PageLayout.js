import React from 'react';
import Box from './Box';
import DocumentOutlineProvider from './DocumentOutlineProvider';

export default function Layout({ children }) {
  return (
    <Box display="flex" direction="column" minVh100>
      <DocumentOutlineProvider>{children}</DocumentOutlineProvider>
    </Box>
  );
}
