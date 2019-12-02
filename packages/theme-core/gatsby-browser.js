import React from 'react';

import ExamplesContext from './ExamplesContext';

// eslint-disable-next-line no-undef
const context = { imports: IMPORTS, scope: SCOPE };

export const wrapPageElement = ({ element }) => (
  <ExamplesContext.Provider value={context}>{element}</ExamplesContext.Provider>
);
