import { parse } from 'react-docgen';

import handler from '../src/handler';
import resolver from '../src/resolver';
// import * as Utils from './utils';

describe('resolver', () => {
  const run = src =>
    parse(src, resolver, [handler], {
      filename: 'foo.tsx',
    });

  describe('props', () => {
    it('should find styled', () => {
      const [doc] = run(`
        interface Props {
          /** foo */
          prop?: string
        }
        const Foo = styled('div')<Props>\`
          hey
        \`

        export default Foo
      `);

      expect(doc.props).toEqual({
        prop: {
          description: 'foo',
          required: false,
          tsType: {
            name: 'string',
          },
        },
      });
    });
  });

  describe('composes', () => {
    it('should find styled', () => {
      const [doc] = run(`
        import Text from './Text';

        const Foo = styled(Text)\`
          hey
        \`

        export default Foo
      `);

      expect(doc.composes).toEqual(['./Text']);
    });

    it('should ignore host nodes', () => {
      const [doc] = run(`
        import Text from './Text';

        const Foo = styled.div\`
          hey
        \`

        export default Foo
      `);

      expect(!doc.composes).toBe(true);
    });

    it('should finds attrs component', () => {
      const [doc] = run(`
        import Text from './Text';

        const Foo = styled(Text).attrs({})\`
          hey
        \`

        export default Foo
      `);

      expect(doc.composes).toEqual(['./Text']);
    });
  });
});
