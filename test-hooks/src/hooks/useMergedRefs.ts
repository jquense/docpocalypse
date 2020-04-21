import { useMemo } from 'react';

type CallbackRef<T> = (ref: T | null) => void;
type Ref<T> = React.MutableRefObject<T> | CallbackRef<T>;

const toFnRef = <T>(ref?: Ref<T> | null) =>
  !ref || typeof ref === 'function'
    ? ref
    : (value: T) => {
        ref.current = value;
      };

export function mergeRefs<T>(refA?: Ref<T> | null, refB?: Ref<T> | null) {
  const a = toFnRef(refA);
  const b = toFnRef(refB);
  return (value: T | null) => {
    if (a) a(value);
    if (b) b(value);
  };
}

/**
 * Create and returns a single callback ref composed from two other Refs.
 *
 * ```tsx
 * const Button = React.forwardRef((props, ref) => {
 *   const [element, attachRef] = useCallbackRef<HTMLButtonElement>();
 *   const mergedRef = useMergedRefs(ref, attachRef);
 *
 *   return <button ref={mergedRef} {...props}/>
 * })
 * ```
 *
 * @param refA A Callback or mutable Ref
 * @param refB A Callback or mutable Ref
 * @typeParam T The Ref subject, usually a host node or instance handle
 * @category refs
 */
function useMergedRefs<T extends object>(
  refA?: Ref<T> | null,
  refB?: Ref<T> | null,
) {
  return useMemo(() => mergeRefs(refA, refB), [refA, refB]);
}

export default useMergedRefs;
