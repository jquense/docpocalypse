import { css } from '../src';
import hash from '../src/hash';

describe('toCss', () => {
  afterEach(() => {
    Array.from(
      document.querySelectorAll('[data-synthetic-grass]')
    ).forEach(el => el.parentNode.removeChild(el));
  });

  it('works', () => {
    const result = css`
      .bar {
        color: blue;
      }

      .foo {
        composes: p-1 from global;
        composes: bar;

        color: red;
      }
    `;

    expect(result).toEqual({
      bar: `sg-${hash('bar')}`,
      foo: `sg-${hash('foo')} p-1 sg-${hash('bar')}`
    });

    const sheet = document.styleSheets[0] as CSSStyleSheet;

    expect(sheet.cssRules).toEqual([
      expect.objectContaining({ selectorText: `.sg-${hash('bar')}` }),
      expect.objectContaining({ selectorText: `.sg-${hash('foo')}` })
    ]);
  });

  it('composes', () => {
    const styles = css`
      .bar {
        color: blue;
      }
    `;

    const result = css`
      .foo {
        composes: ${styles.bar};

        color: red;
      }
    `;

    expect(result).toEqual({
      foo: `sg-${hash('foo')} ${styles.bar}`
    });

    const sheet1 = document.styleSheets[0] as CSSStyleSheet;
    const sheet2 = document.styleSheets[1] as CSSStyleSheet;

    expect(sheet1.cssRules).toEqual([
      expect.objectContaining({ selectorText: `.sg-${hash('bar')}` })
    ]);
    expect(sheet2.cssRules).toEqual([
      expect.objectContaining({ selectorText: `.sg-${hash('foo')}` })
    ]);
  });
});
