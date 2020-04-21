import { JSONOutput } from 'gatsby-plugin-typedoc/lib/types';
import { ReflectionFlags } from 'typedoc';

export enum Kind {
  Global = 0,
  ExternalModule = 1,
  Module = 2,
  Enum = 4,
  EnumMember = 16,
  Variable = 32,
  Function = 64,
  Class = 128,
  Interface = 256,
  Constructor = 512,
  Property = 1024,
  Method = 2048,
  CallSignature = 4096,
  IndexSignature = 8192,
  ConstructorSignature = 16384,
  Parameter = 32768,
  TypeLiteral = 65536,
  TypeParameter = 131072,
  Accessor = 262144,
  GetSignature = 524288,
  SetSignature = 1048576,
  ObjectLiteral = 2097152,
  TypeAlias = 4194304,
  Event = 8388608,
  Reference = 16777216,
  ClassOrInterface = 384,
  VariableOrProperty = 1056,
  FunctionOrMethod = 2112,
  ClassMember = 8654336,
  SomeSignature = 1601536,
  SomeModule = 3,
  SomeType = 4391168,
  SomeValue = 2097248,
}

export type TypedocTag = {
  tag: string;
  text: string;
};

export type TypeDocCommentText = {
  mdx?: {
    body: string;
  };
};

export type ArrayType = {
  type: 'array';
  elementType?: TypedocType;
};

export type ConditionalType = {
  type: 'conditional';
  checkType: TypedocType;
  extendsType: TypedocType;
  trueType: TypedocType;
  falseType: TypedocType;
};

export type IndexedAccessType = {
  type: 'indexedAccess';
  indexType: TypedocType;
  objectType: TypedocType;
};

export type InferredType = {
  type: 'inferred';
  name: string;
};

export type IntrinsicType = {
  type: 'intrinsic';
  name: string;
};

export type IntersectionType = {
  type: 'intersection';
  types: TypedocType[];
};

export type QueryType = {
  type: 'query';
  queryType: TypedocType;
};

export type PredicateType = {
  type: 'predicate';
  name: string;
  targetType: TypedocType;
  asserts: TypedocType[];
};

export type ReferenceType = {
  type: 'reference';
  name?: string;
  typeArguments?: TypedocType[];
  reference: TypedocNode;
};

export type ReflectionType = {
  type: 'reflection';
  declaration: TypedocNode;
};

export type StringLiteralType = {
  type: 'stringLiteral';
  value: string;
};

export type TupleType = {
  type: 'tuple';
  elements: TypedocType[];
};

export type TypeParameterType = {
  type: 'typeParameter';
  name: string;
  constraint?: TypedocType;
};

export type TypeOperatorType = {
  type: 'typeOperator';
  operator: 'keyof';
  target: TypedocType;
};
export type UnionType = {
  type: 'union';
  types: TypedocType[];
};

export type UnknownType = {
  type: 'unknown';
  name: string;
};

export type TypedocType =
  | ArrayType
  | ConditionalType
  | IndexedAccessType
  | InferredType
  | IntrinsicType
  | IntersectionType
  | QueryType
  | PredicateType
  | StringLiteralType
  | TupleType
  | TypeParameterType
  | TypeOperatorType
  | UnionType
  | UnknownType
  | ReferenceType
  | ReflectionType;

export type TypedocNode = {
  id: string;
  rootDir?: string;
  tsconfig?: string;

  kind: Kind;
  kindstring: string;
  name: string;
  originalName: string;
  defaultValue: string;
  flags: ReflectionFlags;

  tags?: TypedocTag[];
  description?: TypeDocCommentText;
  returnsDescription?: TypeDocCommentText;

  signatures?: TypedocNode[];
  typedocs?: TypedocNode[];

  indexSignature?: TypedocNode[];
  typeParameter?: TypedocNode[];
  parameters?: TypedocNode[];

  type?: TypedocType;
  overwrites: TypedocType;
  inheritedFrom: TypedocType;

  extendedTypes: TypedocType[];
  extendedBy: TypedocType[];

  implementationOf: TypedocType;
  implementedBy: TypedocType[];
  implementedTypes: TypedocType[];
};
