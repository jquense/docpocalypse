import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import DocumentOutlineProvider from './components/DocumentOutlineProvider';
import InlineCode from './components/InlineCode';
import LinkedHeading from './components/LinkedHeading';
import Heading from './components/OutlineHeading';
import Paragraph from './components/Paragraph';
import Pre from './components/Pre';

export const components = {
  wrapper: props => <>{props.children}</>,
  h1: props => <Heading h="1" {...props} />,
  h2: props => <LinkedHeading h="2" {...props} />,
  h3: props => <LinkedHeading h="3" {...props} />,
  h4: props => <LinkedHeading h="4" {...props} />,
  h5: props => <LinkedHeading h="5" {...props} />,
  h6: props => <LinkedHeading h="6" {...props} />,
  pre: props => <Pre {...props} static />,
  p: Paragraph,
  inlineCode: InlineCode
};

export default ({ element }) => (
  <DocumentOutlineProvider>
    <MDXProvider components={components}>{element}</MDXProvider>
  </DocumentOutlineProvider>
);
