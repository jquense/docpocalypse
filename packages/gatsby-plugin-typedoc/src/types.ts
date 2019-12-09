/* eslint-disable @typescript-eslint/no-empty-interface */
import * as M from 'typedoc/dist/lib/models';
import { ReflectionCategory as MReflectionCategory } from 'typedoc/dist/lib/models/ReflectionCategory';
import { ReflectionGroup as MReflectionGroup } from 'typedoc/dist/lib/models/ReflectionGroup';
import { ReflectionFlags as MReflectionFlags } from 'typedoc/dist/lib/models/reflections/abstract';
import {
  DecoratorWrapper,
  SourceReferenceWrapper
} from 'typedoc/dist/lib/serialization/serializers';

/**
 * Describes the mapping from Model types to the corresponding JSON output type.
 */
export type ModelToObject<T> = T extends Array<infer U>
  ? _ModelToObject<U>[]
  : _ModelToObject<T>;

// Order matters here. Some types are subtypes of other types.
type _ModelToObject<T> =
  // Reflections
  T extends MReflectionGroup
    ? ReflectionGroup
    : T extends MReflectionCategory
    ? ReflectionCategory
    : T extends M.SignatureReflection
    ? SignatureReflection
    : T extends M.ParameterReflection
    ? ParameterReflection
    : T extends M.DeclarationReflection
    ? DeclarationReflection | ReflectionPointer
    : T extends M.TypeParameterReflection
    ? TypeParameterReflection
    : T extends M.ProjectReflection
    ? ProjectReflection
    : T extends M.ContainerReflection
    ? ContainerReflection
    : T extends M.Reflection
    ? Reflection // Types
    : T extends M.ArrayType
    ? ArrayType
    : T extends M.IntersectionType
    ? IntersectionType
    : T extends M.IntrinsicType
    ? IntrinsicType
    : T extends M.ReferenceType
    ? ReferenceType
    : T extends M.ReflectionType
    ? ReflectionType
    : T extends M.StringLiteralType
    ? StringLiteralType
    : T extends M.TupleType
    ? TupleType
    : T extends M.UnknownType
    ? UnknownType
    : T extends M.Type
    ? SomeType // Technically AbstractType, but the union is more useful // Miscellaneous
    : T extends M.Comment
    ? Comment
    : T extends M.CommentTag
    ? CommentTag
    : T extends DecoratorWrapper
    ? Decorator
    : T extends SourceReferenceWrapper
    ? SourceReference
    : never;

type Primitive = string | number | undefined | null | boolean;

/**
 * Helper to describe a set of serialized properties. Primitive types are returned
 * directly, while other models are first passed through ModelToObject.
 * This helper removes the readonly modifier from properties since the result of serialization
 * is a plain object that consumers may modify as they choose, TypeDoc doesn't care.
 */
type S<T, K extends keyof T> = {
  -readonly [K2 in K]: T[K2] extends Primitive ? T[K2] : ModelToObject<T[K2]>;
};

// Reflections

export interface ReflectionGroup
  extends S<MReflectionGroup, 'title' | 'kind' | 'categories'> {
  children?: MReflectionGroup['children'][number]['id'][];
}

export interface ReflectionCategory extends S<MReflectionCategory, 'title'> {
  children?: MReflectionCategory['children'][number]['id'][];
}

export interface SignatureReflection
  extends Reflection,
    S<
      M.SignatureReflection,
      'type' | 'overwrites' | 'inheritedFrom' | 'implementationOf'
    > {}

export interface ParameterReflection
  extends Reflection,
    S<M.ParameterReflection, 'type' | 'defaultValue'> {}

export interface DeclarationReflection
  extends ContainerReflection,
    S<
      M.DeclarationReflection,
      | 'type'
      | 'defaultValue'
      | 'overwrites'
      | 'inheritedFrom'
      | 'extendedTypes'
      | 'extendedBy'
      | 'implementedTypes'
      | 'implementedBy'
      | 'implementationOf'
    > {}

// (f as SignatureReflection).
export interface TypeParameterReflection
  extends Reflection,
    S<M.TypeParameterReflection, 'type'> {}

// Nothing extra yet.
export interface ProjectReflection extends ContainerReflection {}

export interface ContainerReflection
  extends Reflection,
    S<M.ContainerReflection, 'groups' | 'categories'> {
  sources?: ModelToObject<SourceReferenceWrapper[]>;
}

/**
 * If a 3rd party serializer creates a loop when serializing, a pointer will be created
 * instead of re-serializing the [[DeclarationReflection]]
 */
export interface ReflectionPointer extends S<M.Reflection, 'id'> {}

export interface Reflection
  extends S<
    M.Reflection,
    'id' | 'name' | 'kind' | 'kindString' | 'comment' | 'decorates'
  > {
  originalName?: M.Reflection['originalName'];
  flags: ReflectionFlags;
  decorators?: ModelToObject<DecoratorWrapper[]>;
  children?: [Reflection];
}

// Types

export type SomeType =
  | ArrayType
  | IntersectionType
  | UnionType
  | IntrinsicType
  | ReferenceType
  | ReflectionType
  | StringLiteralType
  | TupleType
  | TypeOperatorType
  | TypeParameterType
  | UnionType
  | UnknownType;

export interface ArrayType
  extends Type,
    S<M.ArrayType, 'type' | 'elementType'> {}

export interface IntersectionType
  extends Type,
    S<M.IntersectionType, 'type' | 'types'> {}

export interface UnionType extends Type, S<M.UnionType, 'type' | 'types'> {}

export interface IntrinsicType
  extends Type,
    S<M.IntrinsicType, 'type' | 'name'> {}

export interface ReferenceType
  extends Type,
    S<M.ReferenceType, 'type' | 'name' | 'typeArguments'> {
  id?: number;
}

export interface ReflectionType extends Type, S<M.ReflectionType, 'type'> {
  declaration?: ModelToObject<M.ReflectionType['declaration']>;
}

export interface StringLiteralType
  extends Type,
    S<M.StringLiteralType, 'type' | 'value'> {}

export interface TupleType extends Type, S<M.TupleType, 'type'> {
  elements?: ModelToObject<M.TupleType['elements']>;
}

export interface TypeOperatorType
  extends Type,
    S<M.TypeOperatorType, 'type' | 'operator' | 'target'> {}

export interface TypeParameterType
  extends Type,
    S<M.TypeParameterType, 'type' | 'name' | 'constraint'> {}

export interface UnknownType extends Type, S<M.UnknownType, 'type' | 'name'> {}

/**
 * Technically not correct, the `type` property will be set by the abstract serializer.
 * But to allow tagged literals, the `type` property is instead defined by each child type.
 */
export interface Type {}

// Miscellaneous

export interface ReflectionFlags
  extends Partial<
    S<
      MReflectionFlags,
      | 'isPrivate'
      | 'isProtected'
      | 'isPublic'
      | 'isStatic'
      | 'isExported'
      | 'isExternal'
      | 'isOptional'
      | 'isRest'
      | 'hasExportAssignment'
      | 'isConstructorProperty'
      | 'isAbstract'
      | 'isConst'
      | 'isLet'
    >
  > {}

export interface Comment
  extends Partial<S<M.Comment, 'shortText' | 'text' | 'returns' | 'tags'>> {}

export interface CommentTag extends S<M.CommentTag, 'text'> {
  tag: M.CommentTag['tagName'];
  param?: M.CommentTag['paramName'];
}

export interface SourceReference {
  fileName: string;
  line: number;
  character: number;
}

export interface Decorator
  extends S<M.Decorator, 'name' | 'type' | 'arguments'> {}
