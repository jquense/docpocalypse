import { useMemo } from 'react';

import normalizeTokens from './normalizeTokens';
import themeToDict from './themeToDict';
import {
  Language,
  LineInputProps,
  LineOutputProps,
  PrismLib,
  PrismTheme,
  Token,
  TokenInputProps,
  TokenOutputProps,
} from './types';

export type UseHighlightOptions = {
  Prism: PrismLib;
  theme?: PrismTheme;
  language: Language;
  code: string;
};

function useThemeDict(theme: PrismTheme | undefined, language: Language) {
  return useMemo(() => theme && themeToDict(theme, language), [
    language,
    theme,
  ]);
}

export default function useHighlight({
  theme,
  language,
  code,
  Prism,
}: UseHighlightOptions) {
  const themeDict = useThemeDict(theme, language);

  const getStyleForToken = ({ types, empty }: Token) => {
    const typesSize = types.length;

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

  const getLineProps = ({
    key,
    className,
    style,
    line: _,
    ...rest
  }: LineInputProps): LineOutputProps => {
    const output: LineOutputProps = {
      ...rest,
      className: 'token-line',
    };

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

  const getTokenProps = ({
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
      style: getStyleForToken(token),
    };

    if (style !== undefined) {
      output.style =
        output.style !== undefined ? { ...output.style, ...style } : style;
    }

    if (key !== undefined) output.key = key;
    if (className) output.className += ` ${className}`;

    return output;
  };

  const tokens = useMemo(() => {
    const grammar = Prism.languages[language];
    const mixedTokens =
      grammar !== undefined
        ? Prism.tokenizeWithHooks(code, grammar, language)
        : [code];
    return normalizeTokens(mixedTokens);
  }, [Prism, code, language]);

  return {
    tokens,
    getLineProps,
    getTokenProps,
    props: {
      className: `prism-code language-${language}`,
      style: themeDict !== undefined ? themeDict.plan : {},
    },
  };
}
