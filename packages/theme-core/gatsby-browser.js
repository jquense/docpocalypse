import React from 'react';
import ImportsContext from './ImportsContext';

export const wrapPageElement = ({ element }) => (
  // eslint-disable-next-line no-undef
  <ImportsContext.Provider value={IMPORTS}>{element}</ImportsContext.Provider>
);
