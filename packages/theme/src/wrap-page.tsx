import { MDXProvider } from '@mdx-js/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from '@reach/router';
import React from 'react';

import DocumentOutlineProvider from './components/DocumentOutlineProvider';
import InlineCode from './components/InlineCode';
import LinkedHeading from './components/LinkedHeading';
import List from './components/List';
import Heading from './components/OutlineHeading';
import Paragraph from './components/Paragraph';
import Pre from './components/Pre';
import DataProvider from './components/DataProvider';
import Anchor from './components/Anchor';

const stripTrailing = (path: string) =>
  path === '/' ? '/' : path.replace(/\/$/, '');

export const components = {
  wrapper: props => <>{props.children}</>,
  a: Anchor,
  h1: props => <Heading h="1" {...props} />,
  h2: props => <LinkedHeading h="2" {...props} />,
  h3: props => <LinkedHeading h="3" {...props} />,
  h4: props => <LinkedHeading h="4" {...props} />,
  h5: props => <LinkedHeading h="5" {...props} />,
  h6: props => <LinkedHeading h="6" {...props} />,
  ul: props => <List {...props} />,
  pre: props => {
    return (
      <Location>
        {ctx => (
          <Pre
            {...props}
            name={stripTrailing(ctx.location.pathname)}
            static={props.children?.props.live !== true}
          />
        )}
      </Location>
    );
  },
  p: Paragraph,
  inlineCode: InlineCode,
};

export default ({ element }) => {
  return (
    <DataProvider>
      <DocumentOutlineProvider>
        <MDXProvider components={components}>{element}</MDXProvider>
      </DocumentOutlineProvider>
    </DataProvider>
  );
};
