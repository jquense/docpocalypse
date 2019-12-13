const TYPESCRIPT = ['ts', 'tsx', 'typescript'];
const LANGUAGES = ['js', 'jsx', 'javascript', ...TYPESCRIPT];

function isTypescript(lang) {
  return !!lang && TYPESCRIPT.indexOf(lang.toLowerCase()) !== -1;
}

function canParse(lang) {
  return !!lang && LANGUAGES.indexOf(lang.toLowerCase()) !== -1;
}

module.exports = { isTypescript, canParse };
