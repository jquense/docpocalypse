import PropTypes from 'prop-types';
import React, { useMemo, useRef } from 'react';
import { LiveEditor } from 'react-live';
import useMergeState from '@restart/hooks/useMergeState';
import InfoMessage from './InfoMessage';

let uid = 0;

interface Props {
  className?: string;
  infoComponent: React.ComponentType<any>;
}

const Editor = React.forwardRef(
  ({ className, infoComponent: Info = InfoMessage }: Props, ref: any) => {
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
      setTimeout(() => {
        mouseDown.current = false;
      });
    };

    return (
      <div ref={ref} style={{ position: 'relative' }}>
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
  },
);

export default Editor;
