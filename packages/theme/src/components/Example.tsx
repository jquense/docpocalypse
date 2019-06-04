import React from 'react';
import PropTypes from 'prop-types';
import {
  Editor,
  Preview,
  Provider,
  InfoMessage,
  Error,
} from '@docpocalypse/editable-example';
import styled from '../styled';

const StyledError = styled(Error)`
  border-radius: 0;
  border-width: 0.2rem;
  margin-bottom: 0;
`;

const StyledLiveProviderChild = styled.div`
  background-color: ${p => p.theme.body.bg};
  margin-bottom: 3rem;
`;

const StyledEditor = styled(Editor)`
  font-family: ${p => p.theme.fontFamily.monospace};
  border-radius: ${p => `0 0 ${p.theme.borderRadius} ${p.theme.borderRadius}`};
`;

const StyledInfoMessage = styled(InfoMessage)`
  font-size: 70%;
`;

const StyledPreview = styled(Preview)`
  position: relative;
  color: ${p => p.theme.body.color};
  padding: 1rem;
  border-style: solid;
  border-color: rgb(236, 236, 236);
  margin-right: 0;
  margin-left: 0;
  border-width: ${p => (p.showCode ? '0.2rem 0.2rem 0 0.2rem' : '0.2rem')};
  border-radius: ${p => (p.showCode ? '8px 8px 0 0' : '8px')};

  .react-live-preview::after {
    display: block;
    clear: both;
    content: '';
  }
`;

export default class Playground extends React.Component<any> {
  static propTypes = {
    code: PropTypes.string.isRequired,
  };

  render() {
    const { code, scope, exampleClassName, showCode = true } = this.props;

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
}
