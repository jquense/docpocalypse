import { Prism } from '@docpocalypse/prism-react-renderer';

import CodeBlock from './CodeBlock';
import Editor from './Editor';
import Error from './Error';
import InfoMessage from './InfoMessage';
import Preview from './Preview';
import Provider, { ImportResolver as _ImportResolver } from './Provider';
import highlight, { useHighlight } from './highlight';

export type ImportResolver = _ImportResolver;

export {
  Prism,
  CodeBlock,
  Error,
  Editor,
  Preview,
  Provider,
  InfoMessage,
  highlight,
  useHighlight,
};

export * from './prism';
