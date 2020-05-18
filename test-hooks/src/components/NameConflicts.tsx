import React from 'react';

/**
 * The actual type
 */
export declare interface Foo {
  (props: any): JSX.Element | null;
  displayName?: string;
}

/**
 * The Main Thing here
 */
const Foo: Foo = React.forwardRef((props: any, _ref: any) => {
  return <div {...props} />;
});

Foo.displayName = 'Foo';

export default Foo;
