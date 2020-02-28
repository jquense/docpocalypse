import { Key } from 'react';

export type Language =
  | 'markup'
  | 'bash'
  | 'clike'
  | 'c'
  | 'cpp'
  | 'css'
  | 'javascript'
  | 'jsx'
  | 'coffeescript'
  | 'actionscript'
  | 'css-extr'
  | 'diff'
  | 'git'
  | 'go'
  | 'graphql'
  | 'handlebars'
  | 'json'
  | 'less'
  | 'makefile'
  | 'markdown'
  | 'objectivec'
  | 'ocaml'
  | 'python'
  | 'reason'
  | 'sass'
  | 'scss'
  | 'sql'
  | 'stylus'
  | 'tsx'
  | 'typescript'
  | 'wasm'
  | 'yaml';

type PrismGrammar = {
  [key: string]: unknown;
};

type LanguagesDict = Record<Language, PrismGrammar>;

export type PrismToken = {
  type: string | string[];
  alias?: string | string[];
  content: Array<PrismToken | string> | string;
};

export type Token = {
  types: string[];
  content: string;
  empty?: boolean;
};

export type PrismLib = {
  languages: LanguagesDict;
  tokenize: (
    code: string,
    grammar: PrismGrammar,
    language: Language,
  ) => Array<PrismToken | string>;
  highlight: (
    code: string,
    grammar: PrismGrammar,
    language: Language,
  ) => string;
};

export type StyleObj = {
  [key: string]: string | number | null;
};

export type LineInputProps = {
  key?: Key;
  style?: StyleObj;
  className?: string;
  line: Token[];

  [key: string]: unknown;
};

export type LineOutputProps = {
  key?: Key;
  style?: StyleObj;
  className: string;

  [key: string]: unknown;
};

export type TokenInputProps = {
  key?: Key;
  style?: StyleObj;
  className?: string;
  token: Token;

  [key: string]: unknown;
};

export type TokenOutputProps = {
  key?: Key;
  style?: StyleObj;
  className: string;
  children: string;

  [key: string]: unknown;
};

export type RenderProps = {
  tokens: Token[][];
  className: string;
  style?: StyleObj;
  getLineProps: (input: LineInputProps) => LineOutputProps;
  getTokenProps: (input: TokenInputProps) => TokenOutputProps;
};

export type PrismThemeEntry = {
  color?: string;
  backgroundColor?: string;
  fontStyle?: 'normal' | 'italic';
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  textDecorationLine?:
    | 'none'
    | 'underline'
    | 'line-through'
    | 'underline line-through';
  opacity?: number;

  [styleKey: string]: string | number | void;
};

export type PrismTheme = {
  plain: PrismThemeEntry;
  styles: Array<{
    types: string[];
    style: PrismThemeEntry;
    languages?: Language[];
  }>;
};
