import React, { useContext } from 'react';

const ImportsContext = React.createContext({});

export function useScope() {
  return useContext(ImportsContext).scope;
}

export function useImportsForExample(name) {
  const { imports = {} } = useContext(ImportsContext);
  return imports[name];
}

export default ImportsContext;
