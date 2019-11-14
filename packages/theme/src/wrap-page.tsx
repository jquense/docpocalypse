import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import CodeBlock from './components/CodeBlock';
import LinkedHeading from './components/LinkedHeading';
import Heading from './components/OutlineHeading';

declare const IMPORTS: any;

// const getMode = (className = '') => {
//   const [, mode]: RegExpMatchArray = className.match(/language-(\w+)/) || [];
//   return mode;
// };

const components = {
  wrapper: props => <>{props.children}</>,
  h1: props => <Heading h="1" {...props} />,
  h2: props => <LinkedHeading h="2" {...props} />,
  h3: props => <LinkedHeading h="3" {...props} />,
  h4: props => <LinkedHeading h="4" {...props} />,
  h5: props => <LinkedHeading h="5" {...props} />,
  h6: props => <LinkedHeading h="6" {...props} />,
  pre: props => <CodeBlock {...props.children.props} />
};

export default ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
);
