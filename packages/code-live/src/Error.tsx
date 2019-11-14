import React from 'react';
import { useError } from './Provider';

/**
 * An Error _component_ for *building*
 */
export default function Error(props: React.HTMLProps<HTMLPreElement>) {
  const error = useError();

  return error ? <pre {...props}>{error.toString()}</pre> : null;
}
