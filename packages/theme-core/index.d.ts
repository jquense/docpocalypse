export function useScope(): () => Promise<Record<string, any>>;

export function useImportsForExample(
  name: string
): () => Promise<Record<string, any>> | undefined;

export enum DocType {
  component,
  hook
}

export interface DocumentationNode {
  type: DocType;
  name: string;
  fileName: string;
  rootDir: string;
  package: any;
  packageName: string;
  importName: string;
}

export interface PluginOptions {
  /** An array directories or file globs to component source files */
  sources: string[];

  /** The relative path to the examples directory */
  examplesPath: string;

  /** A map of template files to use for each documentation type */
  templates: Record<DocType, string>;

  /** Returns an import statement, for the documentation node, illustrating how to consume it in code. */
  getImportName?: (docNode: DocumentationNode, srcFileNode: any) => string;

  /** filters down the list of discovered documentation nodes to only the ones you wish to document */
  ignore?: (docNode: DocumentationNode) => boolean;

  /** An options object passed directly to react docgen for configuring metadata parsing */
  reactDocgenConfig: any;
}
