// @ts-ignore
import codegen from 'codegen.macro'; // eslint-disable-line import/no-extraneous-dependencies

import Prism from './vendor/prism/prism-core';
import { Language } from './types';

// Babel Codegen Macro:
// Get a list of all prismjs languages and inline them here.
// They should only depend on "Prism" being present in the current scope.

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
codegen`
  const { readFileSync } = require('fs')
  const { dirname, join } = require('path')
  const { languages } = require('prismjs/components')
  const prismPath = dirname(require.resolve('prismjs'))

  let output = '/* This content is auto-generated to include some prismjs language components: */\\n'

  const toDependencies = arr => {
    if (typeof arr === 'string') {
      return [arr]
    }

    return arr;
  };

  const addLanguageToOutput = language => {
    const pathToLanguage = 'components/prism-' + language
    const fullPath = join(prismPath, pathToLanguage + '.js')
    const contents = readFileSync(fullPath, 'utf8')
    const header = '\\n\\n/* "prismjs/' + pathToLanguage + '" */\\n'
    output += header + contents
  }

  const visitedLanguages = {}

  const visitLanguage = (language, langEntry) => {
    // Mark language as visited or return if it was
    if (visitedLanguages[language]) {
      return
    } else {
      visitedLanguages[language] = true
    }

    // Required dependencies come before the actual language
    const required = toDependencies(langEntry.require)

    if (Array.isArray(required)) {
      required.forEach(x => {
        if (languages[x]) {
          visitLanguage(x, languages[x])
        } else {
          console.warn('[prismjs/components]: Language', x, 'does not exist!')
        }
      })
    }

    // Add current language to output
    addLanguageToOutput(language)

    // Peer dependencies come after the actual language
    const peerDependencies = toDependencies(langEntry.peerDependencies)

    if (Array.isArray(peerDependencies)) {
      peerDependencies.forEach(x => {
        if (languages[x]) {
          visitLanguage(x, languages[x])
        } else {
          console.warn('[prismjs/components]: Language', x, 'does not exist!')
        }
      })
    }
  };

  // This json defines which languages to include
  const includedLangs = require('./vendor/prism/includeLangs')

  Object.keys(includedLangs).forEach(language => {
    visitLanguage(language, languages[language])
  })

  module.exports = output
`;

// YO DAWG I HEARD YOU LIKE MARKDOWN CODE FENCES
//
// borrowed from the same hook in the markdown language, but adds inner
// tokens in order to add highlighting to code fences
Prism.hooks.add('after-tokenize', (env: any) => {
  if (env.language !== 'markdown' && env.language !== 'md') {
    return;
  }

  function walkTokens(tokens: any[]) {
    if (!tokens || typeof tokens === 'string') {
      return;
    }

    for (const token of tokens) {
      if (typeof token === 'string') continue;
      if (token.type !== 'code') {
        walkTokens(token.content);
        continue;
      }

      const codeLang = token.content[1];
      const codeBlock = token.content[3];

      if (
        codeBlock?.type === 'code-block' &&
        typeof codeLang?.content === 'string'
      ) {
        // do some replacements to support C++, C#, and F#
        let lang: any = codeLang.content
          .replace(/\b#/g, 'sharp')
          .replace(/\b\+\+/g, 'pp');
        // only use the first word
        lang = (/[a-z][\w-]*/i.exec(lang) || [''])[0].toLowerCase();
        const grammar = Prism.languages[lang as Language];
        if (grammar) {
          codeBlock.content = Prism.tokenizeWithHooks(
            codeBlock.content,
            grammar,
            lang,
          );
        }
      }
    }
  }

  walkTokens(env.tokens);
});

Prism.tokenizeWithHooks = (text, grammar, language) => {
  const env = {
    code: text,
    grammar,
    language,
    tokens: [] as any[],
  };
  Prism.hooks.run('before-tokenize', env);
  env.tokens = Prism.tokenize(env.code, env.grammar);
  Prism.hooks.run('after-tokenize', env);
  return env.tokens;
};

export default Prism;
