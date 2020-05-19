import { withPrefix } from 'gatsby';
import React, { useContext } from 'react';

const ImportsContext = React.createContext({});

export function useScope() {
  return useContext(ImportsContext).scope;
}

// TODO: handle during build?
const getWithPrefixedKey = (imports, name) =>
  imports[Object.keys(imports).find((key) => withPrefix(key) === name)];

export function useImportsForExample(name) {
  const { imports = {} } = useContext(ImportsContext);

  return imports[name] || getWithPrefixedKey(imports, name);
}

export default ImportsContext;
