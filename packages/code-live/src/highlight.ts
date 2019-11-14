import Prism from 'prism-react-renderer/prism';

export default (code: string, language?: string) => {
  const grammar = language && Prism.languages[language];

  return grammar ? Prism.highlight(code, grammar, language as any) : code;
};
