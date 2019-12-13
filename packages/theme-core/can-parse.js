const TYPESCRIPT = ['ts', 'tsx', 'typescript'];
const LANGUAGES = ['js', 'jsx', 'javascript', ...TYPESCRIPT];

function isTypescript(lang) {
  return TYPESCRIPT.indexOf(lang.toLowerCase()) !== -1;
}

function canParse(lang) {
  return LANGUAGES.indexOf(lang.toLowerCase()) !== -1;
}

module.exports = { isTypescript, canParse };
