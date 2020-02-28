import { Language, PrismTheme, StyleObj } from './types';

export type ThemeDict = {
  root: StyleObj;
  plain: StyleObj;

  [type: string]: StyleObj;
};

const themeToDict = (theme: PrismTheme, language: Language): ThemeDict => {
  const { plain } = theme;

  // @ts-ignore
  const base: ThemeDict = Object.create(null);

  const themeDict = theme.styles.reduce((acc, themeEntry) => {
    const { languages, style } = themeEntry;
    if (languages && !languages.includes(language)) {
      return acc;
    }

    themeEntry.types.forEach(type => {
      // @ts-ignore
      const accStyle: StyleObj = { ...acc[type], ...style };

      acc[type] = accStyle;
    });

    return acc;
  }, base);

  // @ts-ignore
  themeDict.root = plain as StyleObj;
  // @ts-ignore
  themeDict.plain = { ...plain, backgroundColor: null };

  return themeDict;
};

export default themeToDict;
