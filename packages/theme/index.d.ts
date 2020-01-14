import { PluginOptions as BasePluginOptions } from '@docpocalypse/gatsby-theme-core';

export * from '@docpocalypse/gatsby-theme-core';

export { default as ComponentImport } from './src/components/ComponentImport';
export { default as Example } from './src/components/Example';
export { default as PropsTable } from './src/components/PropsTable';
export { default as LiveCode } from './src/components/LiveCode';
export { default as CodeBlock } from './src/components/CodeBlock';
export { default as DocBlock } from './src/components/DocBlock';
export { default as Pre } from './src/components/Pre';

export { default as PageLayout } from './src/components/PageLayout';
export { default as ComponentPage } from './src/components/ComponentPage';
export { default as HookPage } from './src/components/HookPage';

export { default as DocumentOutline } from './src/components/DocumentOutline';
export { default as SideNavigation } from './src/components/SideNavigation';
export { default as SideNavigationHeader } from './src/components/SideNavigationHeader';
export { default as SideNavigationLink } from './src/components/SideNavigationLink';

export { default as Navbar } from './src/components/Navbar';
export { default as SidePanel } from './src/components/SidePanel';

export { default as Heading } from './src/components/Heading';
export { default as OutlineHeading } from './src/components/OutlineHeading';
export { default as LinkedHeading } from './src/components/LinkedHeading';

export { MDXProvider } from '@mdx-js/react';
export { MDXRenderer } from 'gatsby-plugin-mdx';
export { default as Box } from './src/components/Box';

export { components } from './src/wrap-page';

export { default as syntaxTheme } from './src/syntax-theme';

export type Templates = {
  component: string;
  hook: string;
  default: string;
};

export interface PluginOptions extends BasePluginOptions {
  theme?: 'full' | 'minimal';
  tailwindConfig?: string | Record<string, any>;
}

export declare const templates: Templates;
