import React, { useEffect } from 'react';
import useCallbackRef from '@restart/hooks/useCallbackRef';
import { useComponent } from './Provider';

let holderjs;
if (typeof window !== 'undefined') {
  holderjs = require('holderjs');
}

const Preview = ({ className, holderTheme }: any) => {
  const [example, attachRef] = useCallbackRef();
  const hasTheme = !!holderTheme;
  const Component = useComponent();

  useEffect(() => {
    holderjs.addTheme('userTheme', holderTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTheme]);

  useEffect(() => {
    if (!example) return;

    holderjs.run({
      theme: hasTheme ? 'userTheme' : undefined,
      images: example.querySelectorAll('img'),
    });
  }, [Component, example, hasTheme]);

  // prevent links in examples from navigating
  const handleClick = (e: any) => {
    if (e.target.tagName === 'A') e.preventDefault();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <div
      role="region"
      aria-label="Code Example"
      ref={attachRef}
      className={className}
      onClick={handleClick}
    >
      {Component && <Component />}
    </div>
  );
};

export default Preview;
