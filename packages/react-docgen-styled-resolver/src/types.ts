import { ASTNode, NodePath } from 'ast-types';

export type PropTypeDescriptor = {
  name:
    | 'arrayOf'
    | 'custom'
    | 'enum'
    | 'array'
    | 'bool'
    | 'func'
    | 'number'
    | 'object'
    | 'string'
    | 'any'
    | 'element'
    | 'node'
    | 'symbol'
    | 'objectOf'
    | 'shape'
    | 'exact'
    | 'union'
    | 'elementType';
  value?: any;
  raw?: string;
  computed?: boolean;
  // These are only needed for shape/exact types.
  // Consider consolidating PropTypeDescriptor and PropDescriptor
  description?: string;
  required?: boolean;
};

export type FlowBaseType = {
  required?: boolean;
  nullable?: boolean;
  alias?: string;
};

export type FlowSimpleType = FlowBaseType & {
  name: string;
  raw?: string;
};

export type FlowLiteralType = FlowBaseType & {
  name: 'literal';
  value: string;
};

export type FlowElementsType = FlowBaseType & {
  name: string;
  raw: string;
  elements: Array<FlowTypeDescriptor>;
};

export type FlowFunctionArgumentType = {
  name: string;
  type?: FlowTypeDescriptor;
  rest?: boolean;
};

export type FlowFunctionSignatureType = FlowBaseType & {
  name: 'signature';
  type: 'function';
  raw: string;
  signature: {
    arguments: Array<FlowFunctionArgumentType>;
    return: FlowTypeDescriptor;
  };
};

export type TSFunctionSignatureType = FlowBaseType & {
  name: 'signature';
  type: 'function';
  raw: string;
  signature: {
    arguments: Array<FlowFunctionArgumentType>;
    return: FlowTypeDescriptor;
    this?: FlowTypeDescriptor;
  };
};

export type FlowObjectSignatureType = FlowBaseType & {
  name: 'signature';
  type: 'object';
  raw: string;
  signature: {
    properties: Array<{
      key: string | FlowTypeDescriptor;
      value: FlowTypeDescriptor;
    }>;
    constructor?: FlowTypeDescriptor;
  };
};

export type FlowTypeDescriptor =
  | FlowSimpleType
  | FlowLiteralType
  | FlowElementsType
  | FlowFunctionSignatureType
  | FlowObjectSignatureType;

export type PropDescriptor = {
  type?: PropTypeDescriptor;
  flowType?: FlowTypeDescriptor;
  tsType?: FlowTypeDescriptor;
  required?: boolean;
  defaultValue?: any;
  description?: string;
};

export type Handler = (
  documentation: Documentation,
  path: NodePath,
  parser: any
) => void;

export type Resolver = (
  node: ASTNode,
  parser: any
) => NodePath | Array<NodePath> | null;

export type DocumentationObject = {
  props?: Record<string, PropDescriptor>;
  context?: Record<string, PropDescriptor>;
  childContext?: Record<string, PropDescriptor>;
  composes?: Array<string>;
};

export declare class Documentation {
  _props: Map<string, PropDescriptor>;

  _context: Map<string, PropDescriptor>;

  _childContext: Map<string, PropDescriptor>;

  _composes: Set<string>;

  _data: Map<string, any>;

  addComposes(moduleName: string): void;

  set(key: string, value: any): void;

  get(key: string): any;

  getPropDescriptor(propName: string): PropDescriptor;

  getContextDescriptor(propName: string): PropDescriptor;

  getChildContextDescriptor(propName: string): PropDescriptor;

  toObject(): DocumentationObject;
}
