import React, { ReactNode } from 'react';
import { LiveProvider } from 'react-live';

const prettierComment = /(\{\s*\/\*\s+prettier-ignore\s+\*\/\s*\})|(\/\/\s+prettier-ignore)/gim;

export default function Provider<TScope extends {} = {}>(props: {
  code: String;
  scope?: TScope;
  children?: ReactNode;
}) {
  const { code: codeText, scope, children } = props;
  // Remove the prettier comments and the trailing semicolons in JSX in displayed code.
  const code = codeText
    .replace(prettierComment, '')
    .trim()
    .replace(/>;$/, '>');

  return (
    <LiveProvider
      scope={scope}
      code={code}
      noInline={codeText.includes('render(')}
    >
      {children}
    </LiveProvider>
  );
}
