import * as Theme from './theme.d';

export type Language = Theme.Language;
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
    language?: Language,
  ) => Array<PrismToken | string>;
  tokenizeWithHooks: (
    code: string,
    grammar: PrismGrammar,
    language: Language,
  ) => Array<PrismToken | string>;
  highlight: (
    code: string,
    grammar: PrismGrammar,
    language: Language,
  ) => string;

  hooks: any;
};

export type StyleObj = {
  [key: string]: string | number | null;
};

export type LineInputProps = {
  key?: string | number;
  style?: StyleObj;
  className?: string;
  line: Token[];

  [key: string]: unknown;
};

export type LineOutputProps = {
  key?: string | number;
  style?: StyleObj;
  className: string;

  [key: string]: unknown;
};

export type TokenInputProps = {
  key?: string | number;
  style?: StyleObj;
  className?: string;
  token: Token;

  [key: string]: unknown;
};

export type TokenOutputProps = {
  key?: string | number;
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

export type PrismThemeEntry = Theme.PrismThemeEntry;

export type PrismTheme = Theme.PrismTheme;
