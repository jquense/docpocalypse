# react-docgen-styled-resolver

A react-docgen resolver and handler for documenting styled components build by CSS-in-JS libraries.

Supports (at least): astroturf, Emotion, Linaria, and Styled Components

## Usage

```sh
npm install react-docgen-styled-resolver -D
```

With then with react-docgen

```js
import { parse, defaultHandlers } from 'react-docgen';
import { resolver, handler } from 'react-docgen-styled-resolver';

parse(file, resolver, [...defaultHandlers, handler]);
```

By default the resolver find any usages of _exported_ `styled()` or `styled.element` style
Styled components. The provided `handler` is optional but enhances the documentation by doing two things:

1. For usages of `styled(Something)` where a custom component is styled, the "base"
   custom component is added to the `composes` array since the Styled component also accepts the base's props
2. TypeScript type parameters are inferred for more detailed props data:

```ts
const MyButton = styled(Button)<{ variant: 'primary' | 'secondary' }>``;
```

Will include `variant` in the props portion of the docs for `MyButton`

## Customizing

By default no imports are examined to determine if a `styled()` call is actually a
styled component, in order to support a wide range of CSS-in-JS libraries.
However you can customize this to The resolver exports a few variations that
are suited to different needs.

```js
import { createStyledResolvers } from 'react-docgen-styled-resolver';

const {
  findAllStyledComponents,
  findAllExportedStyledComponents,
  findExportedStyledComponent,
} = createStyledResolvers({ moduleName: 'linaria/react' });
```

Note that the above resolves ONLY find styled components you need to compose
them with one of the default react-docgen resolvers to find other component types as
well

```ts
import { resolver } from 'react-docgen';

export default (ast: ASTNode) => {
  const styled = findAllExportedStyledComponents(ast);

  const exportedComponents = resolver.findAllExportedComponentDefinitions(ast);

  return styled.concat(exportedComponents);
};
```
