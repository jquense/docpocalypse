export enum DocType {
  component,
  hook
}

export interface PluginOptions {
  /** An array directories or file globs to component source files */
  sources: string[];

  /** The relative path to the examples directory */
  examplesPath: string;

  /** A map of template files to use for each documentation type */
  templates: Record<DocType, string>;

  /** filters down the list of discovered components to only the ones you wish to document */
  ignoreComponent?: (name: string, docNode: any) => boolean;

  /** An options object passed directly to react docgen for configuring metadata parsing */
  reactDocgenConfig: any;
}
