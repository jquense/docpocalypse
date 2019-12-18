/**
 * THis is a comment
 * ```ts
 * const f = useTest('bar')
 * ```
 *
 * @param foo The input
 * @param options The input
 * @type {Foo} fasff
 */
export default function useTest(
  foo: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { baz, buz }: { baz: boolean; buz: number }
): [string, number] {
  // @ts-ignore
  return String(foo && 'badass' && baz && buz);
}
