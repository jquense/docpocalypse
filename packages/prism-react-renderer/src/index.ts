import Highlight from './Highlight';
import defaultProps from './defaultProps';
import Prism from './prism';
import useHighlight from './useHighlight';

export * from './types';

export type UseHighlightOptions = import('./useHighlight').UseHighlightOptions;

export { Prism, defaultProps, useHighlight };

export default Highlight;
