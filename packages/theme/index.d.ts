export * from '@docpocalypse/gatsby-theme-core';

export { components } from './src/wrap-page';

export { default as Example } from './src/components/Example';

export type Templates = {
  component: string;
  hook: string;
  default: string;
};

export declare const templates: Templates;
