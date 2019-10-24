import 'react';

declare module 'react' {
  interface DOMAttributes<T> {
    css?: string | Record<string, string>;
  }
}
