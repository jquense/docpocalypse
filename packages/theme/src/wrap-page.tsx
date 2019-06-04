import React from 'react';
import { MDXProvider } from '@mdx-js/react';

import Heading from './components/Heading';
// import CodeBlock from './components/CodeBlock';
import LinkedHeading from './components/LinkedHeading';

const getMode = (className = '') => {
  const [, mode]: RegExpMatchArray = className.match(/language-(\w+)/) || [];
  return mode;
};

const components = {
  wrapper: props => <React.Fragment {...props} />,
  h1: props => <Heading h="1" {...props} />,
  h2: props => <LinkedHeading h="2" {...props} />,
  h3: props => <LinkedHeading h="3" {...props} />,
  h4: props => <LinkedHeading h="4" {...props} />,
  h5: props => <LinkedHeading h="5" {...props} />,
  h6: props => <LinkedHeading h="6" {...props} />,
  // pre: props =>
  //   React.isValidElement(props.children) ? (
  //     <CodeBlock
  //       codeText={props.children.props.children}
  //       mode={getMode(props.children.props.className)}
  //     />
  //   ) : (
  //     <pre {...props} />
  //   ),
};

export default ({ element }) => (
  <MDXProvider components={components}>{element}</MDXProvider>
);
