import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import transpile, { removeImports } from './transpile';

const prettierComment = /(\{\s*\/\*\s+prettier-ignore\s+\*\/\s*\})|(\/\/\s+prettier-ignore)/gim;

export interface LiveContext {
  code?: string;
  language?: string;
  theme?: string;
  disabled?: boolean;
  error: Error | null;
  component: React.ComponentType | null;
  onChange(code: string): void;
  onError(error: Error): void;
}

const Context = React.createContext<LiveContext>({} as any);

const withErrorBoundary = (
  Element: any,
  errorCallback: (err: Error) => void
): React.ComponentType => {
  return class ErrorBoundary extends React.Component {
    componentDidCatch(error: Error) {
      errorCallback(error);
    }

    render() {
      return typeof Element === 'function' ? <Element /> : Element;
    }
  };
};

const getRequire = (imports?: Record<string, any>) =>
  function require(request: string) {
    if (!imports) throw new Error('no imports');
    if (!(request in imports)) throw new Error(`Module not found: ${request}`);
    return imports[request];
  };

function codeToComponent<TScope extends {}>(
  code: string,
  scope?: TScope
): Promise<React.ComponentType> {
  return new Promise((resolve, reject) => {
    const isInline = !code.includes('render(');

    const result = transpile(code, isInline);

    const render = (element: JSX.Element) => {
      if (typeof element === 'undefined') {
        reject(new SyntaxError('`render()` was called without a JSX element'));
        return;
      }

      resolve(withErrorBoundary(element, reject));
    };

    const args = ['React', 'render'].concat(Object.keys(scope || {}));
    const values = [React, render].concat(Object.values(scope || {}));

    // eslint-disable-next-line no-new-func
    const fn = new Function(...args, result.code);

    return fn(...values);
  });
}

type ImportResolver = () => Promise<Record<string, any>>;

interface Props<TScope> {
  code: string;
  scope?: TScope;
  children?: ReactNode;
  language?: string;
  theme?: string;
  showImports?: boolean;
  /**
   * A function that resolves to a hash of import requests to the result
   *
   * ```ts
   * const resolverImports = () => ({
   *   './foo': Foo
   * })
   * ```
   */
  resolveImports?: ImportResolver;
}

export function useLiveContext() {
  return useContext(Context);
}

export function useComponent() {
  return useLiveContext().component;
}

export function useError() {
  return useLiveContext().error;
}

export default function Provider<TScope extends {} = {}>({
  scope,
  children,
  code: codeText,
  language,
  theme,
  showImports = true,
  resolveImports = () => Promise.resolve({})
}: Props<TScope>) {
  const [error, setError] = useState<Error | null>(null);
  const [component, setComponent] = useState<React.ComponentType | null>(null);

  const [code, importBlock] = useMemo<[string, string]>(() => {
    // Remove the prettier comments.
    const nextCode = codeText.replace(prettierComment, '').trim();

    if (showImports) return [nextCode, ''];
    const r = removeImports(nextCode);
    return [r.code, r.imports.map(i => i.code).join('\n')];
  }, [codeText, showImports]);

  const handleChange = useEventCallback((nextCode: string) => {
    resolveImports()
      .then(importHash =>
        codeToComponent(`${importBlock}\n\n${nextCode}`, {
          ...scope,
          require: getRequire(importHash)
        })
      )
      .then(c => {
        setComponent(() => c);
        setError(null);
      }, setError);
  });

  useEffect(() => {
    handleChange(code);
  }, [code, importBlock, scope, handleChange]);

  useEffect(() => {
    handleChange(code);
  }, [code, scope, handleChange]);

  const context = useMemo(
    () => ({
      code,
      error,
      component,
      language,
      theme,
      onError: setError,
      onChange: handleChange
    }),
    [code, component, error, handleChange, language, theme]
  );

  return <Context.Provider value={context}>{children}</Context.Provider>;
}
