import React from 'react';
import DocumentOutlineProvider from './DocumentOutlineProvider';

export default function Layout({ children }) {
  return (
    <div
      style={{
        // Layout styling
        margin: `10%`,
        backgroundColor: `#fafafa`,
      }}
    >
      <DocumentOutlineProvider>{children}</DocumentOutlineProvider>
    </div>
  );
}
