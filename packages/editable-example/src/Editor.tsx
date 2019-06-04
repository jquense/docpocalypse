import { useRef, useMemo } from 'react';
import InfoMessage from './InfoMessage';
import useMergeState from '@restart/hooks/useMergeState';
import React from 'react';
import { LiveEditor } from 'react-live';

let uid = 0;
export default function Editor({
  className,
  infoComponent: Info = InfoMessage,
}) {
  const mouseDown = useRef(false);

  const [{ visible, ignoreTab, keyboardFocused }, setState] = useMergeState({
    visible: false,
    ignoreTab: false,
    keyboardFocused: false,
  });

  const id = useMemo(() => `described-by-${++uid}`, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLPreElement>) => {
    const { key } = event;

    if (ignoreTab && key !== 'Tab' && key !== 'Shift') {
      if (key === 'Enter') event.preventDefault();
      setState({ ignoreTab: false });
    }
    if (!ignoreTab && key === 'Escape') {
      setState({ ignoreTab: true });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLPreElement>) => {
    if (e.target !== e.currentTarget) return;
    setState({
      visible: true,
      ignoreTab: !mouseDown.current,
      keyboardFocused: !mouseDown.current,
    });
  };
  const handleBlur = (e: React.FocusEvent<HTMLPreElement>) => {
    if (e.target !== e.currentTarget) return;
    setState({
      visible: false,
    });
  };

  const handleMouseDown = () => {
    mouseDown.current = true;
    window.setTimeout(() => {
      mouseDown.current = false;
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      <LiveEditor
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        ignoreTabKey={ignoreTab}
        className={className}
        aria-describedby={id}
        aria-label="Example code editor"
      />
      {visible && (keyboardFocused || !ignoreTab) && (
        <Info id={id} aria-live="polite">
          {ignoreTab ? (
            <>
              Press <kbd>enter</kbd> or type a key to enable tab-to-indent
            </>
          ) : (
            <>
              Press <kbd>esc</kbd> to disable tab trapping
            </>
          )}
        </Info>
      )}
    </div>
  );
}
