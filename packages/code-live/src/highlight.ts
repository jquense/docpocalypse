import {
  UseHighlightOptions,
  useHighlight as useHighlightBase,
} from '@docpocalypse/prism-react-renderer';
import Prism from '@docpocalypse/prism-react-renderer/prism';

export function useHighlight(options: Omit<UseHighlightOptions, 'Prism'>) {
  return useHighlightBase({ ...options, Prism });
}

export default (code: string, language?: string) => {
  const grammar = language && Prism.languages[language];

  return grammar ? Prism.highlight(code, grammar, language as any) : code;
};
