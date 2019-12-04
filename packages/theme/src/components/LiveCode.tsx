import dstyled from 'astroturf';
import React from 'react';
import {
  Editor,
  Error,
  ImportResolver,
  InfoMessage,
  Preview,
  Provider
} from '@docpocalypse/code-live';
import { getLanguage } from './CodeBlock';

const StyledError = dstyled(Error)`
  border-radius: 0;
  border-width: 0.2rem;
  margin-bottom: 0;
`;

const StyledLiveProviderChild = dstyled('div')`
  background-color: theme('body.bg-color');
  margin-bottom: 3rem;
`;

const StyledEditor = dstyled(Editor)`
  font-family: theme('fontFamily');
  border-radius: 0 0 theme('border-radius') theme('border-radius');
`;

const StyledInfoMessage = dstyled(InfoMessage)`
  font-size: 70%;
`;

const StyledPreview = dstyled(Preview)`
  position: relative;
  color: theme('body.bg-color');
  padding: 1rem;
  border-style: solid;
  border-color: rgb(236, 236, 236);
  margin-right: 0;
  margin-left: 0;
  border-width: 0.2rem;
  border-radius: 8px;

  &.showCode {
    border-width: 0.2rem 0.2rem 0 0.2rem;
    border-radius: 8px 8px 0 0;
  }

  .react-live-preview::after {
    display: block;
    clear: both;
    content: '';
  }
`;

export interface Props<TScope extends {} = {}> {
  code: string;
  scope: TScope;
  className?: string;
  exampleClassName?: string;
  resolveImports?: ImportResolver;
  language?: string;
  showCode?: boolean;
  showImports?: boolean;
}

export default function LiveCode({
  code,
  scope,
  className,
  exampleClassName,
  resolveImports,
  language = getLanguage(className),
  showCode = true,
  showImports = false
}: Props) {
  return (
    <Provider
      scope={scope}
      code={code}
      language={language}
      showImports={showImports}
      resolveImports={resolveImports}
    >
      <StyledLiveProviderChild>
        <StyledPreview
          showCode={showCode}
          className={exampleClassName}
          infoComponent={StyledInfoMessage}
        />
        <StyledError />
        {showCode && <StyledEditor className={className} />}
      </StyledLiveProviderChild>
    </Provider>
  );
}
