import useEventCallback from '@restart/hooks/useEventCallback';
import useMounted from '@restart/hooks/useMounted';
import { SyntheticEvent, useCallback, useRef } from 'react';

export interface FocusManagerOptions {
  /**
   * A callback fired when focus shifts. returning `false` will prevent
   * handling the focus event
   */
  willHandle?(focused: boolean, event: React.FocusEvent): boolean | void;

  /**
   * A callback fired after focus is handled but before onChange is called
   */
  didHandle?(focused: boolean, event: React.FocusEvent): void;

  /**
   * A callback fired after focus has changed
   */
  onChange?(focused: boolean, event: React.FocusEvent): void;

  /**
   * When true, the event handlers will not report focus changes
   */
  isDisabled: () => boolean;
}

export interface FocusEventHandlers {
  onBlur(event?: SyntheticEvent): any;
  onFocus: (event?: SyntheticEvent) => any;
}

/**
 * useFocusManager provides a way to track and manage focus as it moves around
 * a container element. An `onChange` is fired when focus enters or leaves the
 * element, but not when it moves around inside the element, similar to
 * `pointerenter` and `pointerleave` DOM events.
 *
 * ```jsx
 * const [focused, setFocusState] = useState(false)
 *
 * const { onBlur, onFocus } = useFocusManager({
 *   onChange: nextFocused => setFocusState(nextFocused)
 * })
 *
 * return (
 *   <div tabIndex="-1" onFocus={onFocus} onBlur={onBlur}>
 *     {String(focused)}
 *     <input />
 *     <input />
 *
 *     <button>A button</button>
 *   </div>
 * ```
 *
 * @param opts Options
 * @returns a set of paired focus and blur event handlers
 */
export default function useFocusManager(
  opts: FocusManagerOptions,
): FocusEventHandlers {
  const isMounted = useMounted();

  const lastFocused = useRef<boolean | undefined>();
  const handle = useRef<number | undefined>();

  const willHandle = useEventCallback(opts.willHandle);
  const didHandle = useEventCallback(opts.didHandle);
  const onChange = useEventCallback(opts.onChange);
  const isDisabled = useEventCallback(opts.isDisabled);

  const handleFocusChange = useCallback(
    (focused: boolean, event: React.FocusEvent) => {
      if (event && event.persist) event.persist();

      if (willHandle && willHandle(focused, event) === false) return;

      clearTimeout(handle.current);
      handle.current = setTimeout(() => {
        if (focused !== lastFocused.current) {
          if (didHandle) didHandle(focused, event);

          // only fire a change when unmounted if its a blur
          if (isMounted() || !focused) {
            lastFocused.current = focused;
            onChange && onChange(focused, event);
          }
        }
      });
    },
    [isMounted, willHandle, didHandle, onChange, lastFocused],
  );

  const handleBlur = useCallback(
    (event) => {
      if (!isDisabled()) handleFocusChange(false, event);
    },
    [handleFocusChange, isDisabled],
  );

  const handleFocus = useCallback(
    (event) => {
      if (!isDisabled()) handleFocusChange(true, event);
    },
    [handleFocusChange, isDisabled],
  );

  return { onBlur: handleBlur, onFocus: handleFocus };
}
