import { MDXProvider } from '@docpocalypse/gatsby-theme';
import PageLayout from '@docpocalypse/gatsby-theme/src/components/PageLayout';
import React from 'react';

import Shadow from '../../../components/Shadow';
import SourceLink from '../../../components/SourceLink';

const shortcodes = {
  Shadow,
  SourceLink,
};

export default function AppPageLayout(props) {
  return (
    <MDXProvider components={shortcodes}>
      <PageLayout {...props} />
    </MDXProvider>
  );
}
