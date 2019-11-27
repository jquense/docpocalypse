import React, { useContext } from 'react';

const ImportsContext = React.createContext(null);

export function useScopes() {
  return useContext(ImportsContext);
}

export default ImportsContext;
