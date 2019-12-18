import dstyled from 'astroturf';
import React from 'react';
import {
  Editor,
  Error,
  ImportResolver,
  InfoMessage,
  Preview,
  PrismTheme,
  Provider
} from '@docpocalypse/code-live';

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
`;

export interface Props<TScope extends {} = {}> {
  code: string;

  /**
   * A `prism-react-renderer` style theme. Generally the best way to set is
   * via shadowing `@docpocalypse/gatsby-theme/src/syntax-theme`
   *
   * see: [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) for theme formats
   * @defaultValue OceanicNext
   */
  theme?: PrismTheme;

  /**
   * The scope is an object whose values are made available to the code. Provide
   * a scope to make helpers, functions, and components globally accessible to example code.
   *
   * **Can also be configured as part of the theme options: `exampleCodeScope`**
   *
   * @type TScope = {}
   */
  scope: TScope;

  /** A CSS class */
  className?: string;

  /** A CSS class passed to the code Preview component */
  exampleClassName?: string;

  /**
   * Provides the values for any imports used in code examples. `resolveImports` is
   * a function returning a Promise mapping import requests to the module content.
   *
   * **Docpocalypse provides this mapping automatically in the context of an example file**
   */
  resolveImports?: ImportResolver;

  /* The syntax language for the Code example, passed to Prism for tokenizing the code text */
  language?: string;

  /** Default value for whether example code is visible or only the rendered preview */
  showCode?: boolean;
  /**
   * Determines whether imports are shown in the editor.
   * Imports can't be changed in the browser, so showing them is for
   * illustrative purposes only */
  showImports?: boolean;
}

/** @public */
export default function LiveCode({
  code,
  scope,
  className,
  exampleClassName,
  resolveImports,
  language,
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
