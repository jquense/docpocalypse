export interface ObjectPropType {
  name: 'object';
}
export interface CustomPropType {
  name: 'custom';
  raw: string;
}

export interface ArrayPropType {
  name: 'arrayOf';
  value: PropType;
}

export interface ShapePropType {
  name: 'shape';
  value: Record<string, PropType & { required: boolean }>;
}

export interface UnionPropType {
  name: 'union';
  value: PropType[];
}

export interface EnumPropType {
  name: 'enum';
  value: string | Array<{ value: string; computed: boolean }>;
}

export type PropType =
  | ObjectPropType
  | CustomPropType
  | ArrayPropType
  | EnumPropType
  | UnionPropType
  | ShapePropType;

export interface TSSimple {
  name: string;
}

export interface TSComplexType {
  name: string;
  raw?: string;
  elements: TSType[];
}

export interface TSArgument {
  name: string;
  type: TSType;
}

export interface TSFunctionSignature {
  name: 'signature';
  type: 'function';
  raw: string;
  signature: {
    arguments: TSArgument[];
    return: TSType;
  };
}

export interface TSProperty {
  key: string;
  value: TSType & { required: boolean };
}

export interface TSObjectSignature {
  name: 'signature';
  type: 'object';
  raw: string;
  signature: {
    properties: TSProperty[];
  };
}

export interface TSArray {
  name: 'Array';
  raw?: string;
  elements: TSType[];
}

export interface TSLiteral {
  name: 'literal';
  value: string;
}

export interface TSUnion {
  name: 'union';
  raw?: string;
  elements: TSType[];
}

export interface TSTuple {
  name: 'tuple';
  raw?: string;
  elements: TSType[];
}

export interface TSIntersect {
  name: 'intersect';
  raw: string;
  elements: TSType[];
}

export type TSConcreteType =
  | TSLiteral
  | TSArray
  | TSUnion
  | TSTuple
  | TSIntersect
  | TSFunctionSignature
  | TSObjectSignature;

export type TSType = TSSimple | TSComplexType | TSConcreteType;

export interface Prop {
  name: string;
  tags: Doclet[];
  docblock?: string;
  defaultValue?: {
    value: any;
    computed: boolean;
  };
  description?: {
    mdx?: { body: string };
    markdownRemark?: { html: string };
  };
  required: boolean;
  type: null | PropType;
  tsType: TSType | null;
}

export interface Doclet {
  name: string;
  value: string;
}
