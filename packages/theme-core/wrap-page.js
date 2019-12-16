import React from 'react';

import ExamplesContext from './ExamplesContext';

// eslint-disable-next-line no-undef
const context = { imports: IMPORTS, scope: SCOPE };

export default ({ element }) => (
  <ExamplesContext.Provider value={context}>{element}</ExamplesContext.Provider>
);
