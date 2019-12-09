import resolver from '../src/resolver';
import * as Utils from './utils';

describe('resolver', () => {
  it('should find styled', () => {
    const components = resolver(
      Utils.parse(`
        const Foo = styled('div')\`
          hey
        \`

        export default Foo
      `)
    );

    expect(components).toHaveLength(1);
  });

  it('should find styled shorthand', () => {
    const components = resolver(
      Utils.parse(`
        const Foo = styled.div\`
          hey
        \`

        export default Foo
      `)
    );

    expect(components).toHaveLength(1);
  });

  it('should finds attrs component', () => {
    const components = resolver(
      Utils.parse(`
        const Foo = styled('div').attrs({})\`
          hey
        \`

        export default Foo
      `)
    );

    expect(components).toHaveLength(1);
  });
});
