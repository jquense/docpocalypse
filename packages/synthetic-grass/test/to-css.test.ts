import hash from '../src/hash';
import toCss from '../src/to-css';

describe('toCss', () => {
  it('works', () => {
    const result = toCss(
      '',
      `
        .bar {
          color: blue
        }

        .foo {
          composes: p-1 from global;
          composes: bar;
          color: red
        }
      `
    );

    expect(result.exports).toEqual({
      bar: `sg-${hash('bar')}`,
      foo: `sg-${hash('foo')} p-1 sg-${hash('bar')}`
    });

    expect(result.rules).toEqual([
      `.sg-bNKBaN{color:blue;}`,
      `.sg-gslTvH{color:red;}`
    ]);
  });
});
