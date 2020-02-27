import { MDXProvider } from '@docpocalypse/gatsby-theme';
import PageLayout from '@docpocalypse/gatsby-theme/src/components/PageLayout';
import React from 'react';

import Shadow from '../../../components/Shadow';

const shortcodes = {
  Shadow,
};

export default function AppPageLayout(props) {
  return (
    <MDXProvider components={shortcodes}>
      <PageLayout {...props} />
    </MDXProvider>
  );
}
