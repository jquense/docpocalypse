import React from 'react';
import {
  Editor,
  Preview,
  Provider,
  InfoMessage,
  Error,
} from '@docpocalypse/editable-example';
import styled from 'astroturf';

const StyledError = styled(Error)`
  border-radius: 0;
  border-width: 0.2rem;
  margin-bottom: 0;
`;

const StyledLiveProviderChild = styled.div`
  background-color: var(--theme-body-bg);
  margin-bottom: 3rem;
`;

const StyledEditor = styled(Editor)`
  font-family: var(--theme-font-family);
  border-radius: 0 0 var(--theme-border-radius) var(--theme-border-radius);
`;

const StyledInfoMessage = styled(InfoMessage)`
  font-size: 70%;
`;

const StyledPreview = styled(Preview)`
  position: relative;
  color: var(--theme-body-bg);
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

export default function Playground({
  code,
  scope,
  exampleClassName,
  showCode = true,
}) {
  return (
    <Provider scope={scope} code={code}>
      <StyledLiveProviderChild>
        <StyledPreview
          showCode={showCode}
          className={exampleClassName}
          infoComponent={StyledInfoMessage}
        />
        <StyledError />
        {showCode && <StyledEditor />}
      </StyledLiveProviderChild>
    </Provider>
  );
}
