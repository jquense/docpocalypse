import { withLive, LivePreview } from 'react-live';
import holderjs from 'holderjs';
import React, { useEffect } from 'react';
import useCallbackRef from '@restart/hooks/useCallbackRef';

const Preview = withLive(({ className, live, holderTheme }: any) => {
  const [example, attachRef] = useCallbackRef();
  const hasTheme = !!holderTheme;

  useEffect(() => {
    holderjs.addTheme('userTheme', holderTheme);
  }, [hasTheme]);

  useEffect(() => {
    if (!example) return;

    holderjs.run({
      theme: hasTheme ? 'userTheme' : undefined,
      images: example.querySelectorAll('img'),
    });
  }, [live.element, example]);

  // prevent links in examples from navigating
  const handleClick = (e: any) => {
    if (e.target.tagName === 'A') e.preventDefault();
  };

  return (
    <div
      role="region"
      aria-label="Code Example"
      ref={attachRef}
      className={className}
      onClick={handleClick}
    >
      <LivePreview />
    </div>
  );
});

export default Preview;
