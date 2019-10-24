import React from 'react';
import { LiveError } from 'react-live';

/**
 * An Error _component_ for *building*
 */
export default function Error(props) {
  return <LiveError style={{ whiteSpace: 'pre' }} {...props} />;
}
