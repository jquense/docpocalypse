import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import SimpleCodeEditor from 'react-simple-code-editor';
import useMergeState from '@restart/hooks/useMergeState';
import useStableMemo from '@restart/hooks/useStableMemo';
import CodeBlock from './CodeBlock';
import InfoMessage from './InfoMessage';
import { useLiveContext } from './Provider';
import { PrismTheme } from './prism';

let uid = 0;

function useStateFromProp<TProp>(prop: TProp) {
  const state = useState(prop);
  const firstRef = useRef(true);

  useStableMemo(() => {
    if (firstRef.current) {
      firstRef.current = false;
      return;
    }
    state[1](prop);
  }, [prop]);

  return state;
}

export interface Props {
  className?: string;
  style?: any;
  theme?: PrismTheme;
  infoComponent?: React.ComponentType<any>;
}

const Editor = React.forwardRef(
  (
    { style, className, theme, infoComponent: Info = InfoMessage }: Props,
    ref: any
  ) => {
    const { code: contextCode, language, onChange } = useLiveContext();
    const [code, setCode] = useStateFromProp(contextCode);

    const mouseDown = useRef(false);

    useLayoutEffect(() => {
      if (code && contextCode !== code) {
        onChange(code);
      }
    }, [code, contextCode, onChange]);

    const [{ visible, ignoreTab, keyboardFocused }, setState] = useMergeState({
      visible: false,
      ignoreTab: false,
      keyboardFocused: false
    });

    const id = useMemo(() => `described-by-${++uid}`, []);

    const handleKeyDown = (event: React.KeyboardEvent) => {
      const { key } = event;

      if (ignoreTab && key !== 'Tab' && key !== 'Shift') {
        if (key === 'Enter') event.preventDefault();
        setState({ ignoreTab: false });
      }
      if (!ignoreTab && key === 'Escape') {
        setState({ ignoreTab: true });
      }
    };

    const handleFocus = (e: React.FocusEvent) => {
      if (e.target !== e.currentTarget) return;
      setState({
        visible: true,
        ignoreTab: !mouseDown.current,
        keyboardFocused: !mouseDown.current
      });
    };

    const handleBlur = (e: React.FocusEvent) => {
      if (e.target !== e.currentTarget) return;
      setState({
        visible: false
      });
    };

    const handleMouseDown = () => {
      mouseDown.current = true;
      setTimeout(() => {
        mouseDown.current = false;
      });
    };

    const handleHighlight = useCallback(
      (value: string) => (
        <CodeBlock theme={theme} code={value} language={language as any} />
      ),
      [language, theme]
    );

    const baseTheme =
      theme && typeof theme.plain === 'object' ? theme.plain : {};

    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <SimpleCodeEditor
          value={code || ''}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onMouseDown={handleMouseDown}
          onValueChange={setCode}
          highlight={handleHighlight}
          ignoreTabKey={ignoreTab}
          className={className}
          aria-describedby={id}
          aria-label="Example code editor"
          style={{ ...baseTheme, ...style }}
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
);

export default Editor;
