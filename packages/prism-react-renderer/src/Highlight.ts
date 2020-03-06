import { Component, ReactNode } from 'react';

import {
  Language,
  LineInputProps,
  LineOutputProps,
  PrismLib,
  PrismTheme,
  RenderProps,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from './types';
import normalizeTokens from './normalizeTokens';
import themeToDict, { ThemeDict } from './themeToDict';

type Props = {
  Prism: PrismLib;
  theme?: PrismTheme;
  language: Language;
  code: string;
  children: (props: RenderProps) => ReactNode;
};

class Highlight extends Component<Props, any> {
  prevTheme!: PrismTheme | void;

  prevLanguage!: Language | void;

  themeDict!: ThemeDict | void;

  getThemeDict = (props: Props) => {
    if (
      this.themeDict !== undefined &&
      props.theme === this.prevTheme &&
      props.language === this.prevLanguage
    ) {
      return this.themeDict;
    }

    this.prevTheme = props.theme;
    this.prevLanguage = props.language;

    this.themeDict = props.theme
      ? themeToDict(props.theme, props.language)
      : undefined;

    return this.themeDict;
  };

  getLineProps = ({
    key,
    className,
    style,
    line: _,
    ...rest
  }: LineInputProps): LineOutputProps => {
    const output: LineOutputProps = {
      ...rest,
      className: 'token-line',
      style: undefined,
      key: undefined,
    };

    const themeDict = this.getThemeDict(this.props);
    if (themeDict !== undefined) {
      output.style = themeDict.plain;
    }

    if (style !== undefined) {
      output.style =
        output.style !== undefined ? { ...output.style, ...style } : style;
    }

    if (key !== undefined) output.key = key;
    if (className) output.className += ` ${className}`;

    return output;
  };

  getStyleForToken = ({ types, empty }: Token) => {
    const typesSize = types.length;
    const themeDict = this.getThemeDict(this.props);

    if (themeDict === undefined) {
      return undefined;
    }
    if (typesSize === 1 && types[0] === 'plain') {
      return empty ? { display: 'inline-block' } : undefined;
    }
    if (typesSize === 1 && !empty) {
      return themeDict[types[0]];
    }

    const baseStyle = empty ? { display: 'inline-block' } : {};

    const typeStyles = types.map(type => themeDict[type]);
    return Object.assign(baseStyle, ...typeStyles);
  };

  getTokenProps = ({
    key,
    className,
    style,
    token,
    ...rest
  }: TokenInputProps): TokenOutputProps => {
    const output: TokenOutputProps = {
      ...rest,
      className: `token ${token.types.join(' ')}`,
      children: token.content,
      style: this.getStyleForToken(token),
      key: undefined,
    };

    if (style !== undefined) {
      output.style =
        output.style !== undefined ? { ...output.style, ...style } : style;
    }

    if (key !== undefined) output.key = key;
    if (className) output.className += ` ${className}`;

    return output;
  };

  render() {
    const { Prism, language, code, children } = this.props;

    const themeDict = this.getThemeDict(this.props);

    const grammar = Prism.languages[language];
    const mixedTokens =
      grammar !== undefined
        ? Prism.tokenizeWithHooks(code, grammar, language)
        : [code];
    const tokens = normalizeTokens(mixedTokens);

    return children({
      tokens,
      className: `prism-code language-${language}`,
      style: themeDict !== undefined ? themeDict.root : {},
      getLineProps: this.getLineProps,
      getTokenProps: this.getTokenProps,
    });
  }
}

export default Highlight;
