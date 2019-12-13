import { transform } from './transform';
import jsx from './transform/jsx';
import modules, { Import } from './transform/modules';
import wrapLastExpression from './transform/wrapLastExpression';

const truthy = <T>(
  value: T
): value is T extends false | '' | 0 | null | undefined ? never : T => !!value;

export function removeImports(input: string) {
  const imports: Import[] = [];

  try {
    const { code } = transform(input, {
      plugins: [modules({ remove: true, imports })]
    });

    return { code, imports };
  } catch (err) {
    return { code: input, imports };
  }
}

export default (input: string, inline = false) => {
  const imports: Import[] = [];

  const { code } = transform(input, {
    plugins: [jsx(), modules(), inline && wrapLastExpression()].filter(truthy)
  });

  return { code, imports };
};
