import React from 'react';
import { cleanup, render } from 'react-testing-library';

import { Prism } from '../src';
import theme from '../../prism-themes/src/duotoneDark';
import Highlight from '../src/Highlight';

const exampleCode = `
(function someDemo() {
  var test = "Hello World!";
  console.log(test);
})();

return () => <App />;
`.trim();

describe('<Highlight />', () => {
  afterEach(cleanup);

  describe('snapshots', () => {
    it('renders correctly', () => {
      const { container } = render(
        <Highlight
          Prism={Prism}
          theme={theme}
          code={exampleCode}
          language="jsx"
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>,
      );

      expect(container).toMatchSnapshot();
    });

    it('renders unsupported languages correctly', () => {
      const { container } = render(
        <Highlight
          Prism={Prism}
          theme={theme}
          code={exampleCode}
          language={'abcdefghijklmnop' as any}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>,
      );

      expect(container).toMatchSnapshot();
    });

    it('renders without style props when no theme is passed', () => {
      const { container } = render(
        <Highlight Prism={Prism} code={exampleCode} language="jsx">
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} style={style}>
              {tokens.map((line, i) => (
                <div {...getLineProps({ line, key: i })}>
                  {line.map((token, key) => (
                    <span {...getTokenProps({ token, key })} />
                  ))}
                </div>
              ))}
            </pre>
          )}
        </Highlight>,
      );

      expect(container.innerHTML.includes('style')).toBeFalsy();
    });
  });

  describe('getLineProps', () => {
    it('transforms lineProps inputs correctly', () => {
      const input = {
        key: 'line-1',
        style: { cssProp: 'test' },
        className: 'line-class',
        line: [{ types: ['punctuation'], content: '!' }],
        restPropsTest: true,
      };

      render(
        <Highlight
          Prism={Prism}
          theme={theme}
          code={exampleCode}
          language="jsx"
        >
          {({ getLineProps }) => {
            const output = getLineProps(input);

            expect(output).toEqual({
              key: 'line-1',
              style: {
                cssProp: 'test',
                backgroundColor: null,
                color: expect.any(String),
              },
              className: 'token-line line-class',
              restPropsTest: true,
            });

            return null;
          }}
        </Highlight>,
      );
    });
  });

  describe('getTokenProps', () => {
    it('transforms tokenProps inputs correctly', () => {
      const input = {
        key: 'token-1',
        style: { cssProp: 'test' },
        className: 'token-class',
        token: { types: ['punctuation'], content: '!' },
        restPropsTest: true,
      };

      render(
        <Highlight
          Prism={Prism}
          theme={theme}
          code={exampleCode}
          language="jsx"
        >
          {({ getTokenProps }) => {
            const output = getTokenProps(input);

            expect(output).toEqual({
              key: 'token-1',
              style: { cssProp: 'test', color: expect.any(String) },
              className: 'token punctuation token-class',
              restPropsTest: true,
              children: '!',
            });

            return null;
          }}
        </Highlight>,
      );
    });

    it('transforms constructor token style correctly', () => {
      // From https://github.com/FormidableLabs/prism-react-renderer/issues/11
      render(
        <Highlight
          Prism={Prism}
          theme={theme}
          code="open Common;"
          language="reason"
        >
          {({ tokens, getTokenProps }) => {
            const line = tokens[0];
            const token = line[2];
            const output = getTokenProps({ token, key: 2 });

            expect(typeof output.style).not.toBe('function');

            return null;
          }}
        </Highlight>,
      );
    });
  });
});
