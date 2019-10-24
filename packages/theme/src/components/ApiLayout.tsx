import styled from 'astroturf';
import React from 'react';
import Layout from '@4c/layout';
import Box from './Box';
import DocumentOutline from './DocumentOutline';
import Link from './Link';
import Navbar from './Navbar';
import PageLayout from './PageLayout';
import SideNav from './SideNav';

const Container = styled(Layout)`
  width: 100%;
`;

// const styles = css`
//   .nav {
//     position: sticky;
//     top: 4rem;
//     height: calc(100vh - 4rem);
//     background-color: #f7f7f7;
//   }

//   .main {
//     order: 1;
//     padding: 2rem 4rem;

//     @include media-breakpoint-down(sm) {
//       padding: 1rem 0.83rem;
//     }

//     & > h2:not(:first-child) {
//       margin-top: 3rem;
//     }

//     > h3 {
//       margin-top: 1.5rem;
//     }

//     > ul li,
//     > ol li {
//       margin-bottom: 0.25rem;
//     }

//     > table {
//       width: 100%;
//       max-width: 100%;
//       margin-bottom: 1rem;

//       @include media-breakpoint-down(sm) {
//         display: block;
//         overflow-x: auto;
//         -ms-overflow-style: -ms-autohiding-scrollbar;
//       }
//     }

//     @include media-breakpoint-up(lg) {
//       > ul,
//       > ol,
//       > p {
//         max-width: 80%;
//       }
//     }
//   }
// `;

function ApiLayout({ children, ...props }) {
  return (
    <PageLayout {...props}>
      <Navbar>
        <Box>
          <Link href="/">Home</Link>
        </Box>
      </Navbar>
      <Box grid height="100">
        <SideNav col={{ _: 12, md: 3, xl: 2 }}></SideNav>
        <Box
          as={DocumentOutline}
          order={2}
          display={{ _: 'none', xl: 'block' }}
          col={{ xl: 2 }}
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
