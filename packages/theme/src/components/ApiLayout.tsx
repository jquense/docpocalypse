import React from 'react';
import Box from './Box';
import DocumentOutline from './DocumentOutline';
import Link from './Link';
import Navbar from './Navbar';
import PageLayout from './PageLayout';
import SideNav from './SideNav';

function ApiLayout({ children, ...props }) {
  return (
    <PageLayout {...props}>
      <Navbar>
        <Box>
          <Link href="/">Home</Link>
        </Box>
      </Navbar>
      <Box grid height="100">
        <SideNav col={{ _: 12, md: 3, xl: 2 }} />
        <Box
          as={DocumentOutline}
          order={2}
          col={{ xl: 2 }}
          display={{ _: 'hidden', xl: 'block' }}
        />
        <Box
          as="main"
          order={1}
          id="docs-content"
          px={5}
          col={{ md: 9, xl: 8, _: 12 }}
        >
          {children}
        </Box>
      </Box>
    </PageLayout>
  );
}

export default ApiLayout;
