import astTypes, { NodePath } from 'ast-types';
import { unwrapUtilityType } from '@monastic.panic/react-docgen/dist/utils/flowUtilityTypes';
import { applyToFlowTypeProperties } from '@monastic.panic/react-docgen/dist/utils/getFlowTypeFromReactComponent';
import getPropertyName from '@monastic.panic/react-docgen/dist/utils/getPropertyName';
import getTSType from '@monastic.panic/react-docgen/dist/utils/getTSType';
import resolveToModule from '@monastic.panic/react-docgen/dist/utils/resolveToModule';
import resolveToValue from '@monastic.panic/react-docgen/dist/utils/resolveToValue';
import setPropDescription from '@monastic.panic/react-docgen/dist/utils/setPropDescription';
import { Documentation } from './types';
import { isShorthandStyled, isSimpleStyled, isStyledComponent } from './utils';

const t = astTypes.namedTypes;

/** Copied almost verbatim from: https://github.com/reactjs/react-docgen/blob/master/src/handlers/flowTypeHandler.js */
function setPropDescriptor(
  documentation: Documentation,
  path: NodePath,
  typeParams
): void {
  if (t.ObjectTypeSpreadProperty.check(path.node)) {
    const argument = unwrapUtilityType(path.get('argument'));

    if (t.ObjectTypeAnnotation.check(argument.node)) {
      applyToFlowTypeProperties(
        documentation,
        argument,
        (propertyPath, innerTypeParams) => {
          setPropDescriptor(documentation, propertyPath, innerTypeParams);
        },
        typeParams
      );
      return;
    }

    const name = argument.get('id').get('name');
    const resolvedPath = resolveToValue(name);

    if (resolvedPath && t.TypeAlias.check(resolvedPath.node)) {
      const right = resolvedPath.get('right');
      applyToFlowTypeProperties(
        documentation,
        right,
        (propertyPath, innerTypeParams) => {
          setPropDescriptor(documentation, propertyPath, innerTypeParams);
        },
        typeParams
      );
    } else {
      documentation.addComposes(name.node.name);
    }
  } else if (t.TSPropertySignature.check(path.node)) {
    const type = getTSType(path.get('typeAnnotation'), typeParams);

    const propName = getPropertyName(path);
    if (!propName) return;

    const propDescriptor = documentation.getPropDescriptor(propName);
    propDescriptor.required = !path.node.optional;
    propDescriptor.tsType = type;

    // We are doing this here instead of in a different handler
    // to not need to duplicate the logic for checking for
    // imported types that are spread in to props.
    setPropDescription(documentation, path);
  }
}

export function createHandler({ moduleName }: any = {}) {
  function addComposes(tagPath: NodePath, doc: Documentation) {
    // just DOM nodes for this case
    if (isShorthandStyled(tagPath)) return;

    let composes: NodePath | null = null;
    if (isSimpleStyled(tagPath)) {
      composes = tagPath.get('arguments').get(0);
    } else {
      composes = tagPath
        .get('callee')
        .get('object')
        .get('arguments')
        .get(0);
    }

    if (!composes) return;

    if (t.Identifier.check(composes.node)) {
      const mod = resolveToModule(composes);
      if (mod) {
        doc.addComposes(mod);
      }
    }
  }

  return (documentation: Documentation, path: NodePath) => {
    if (!isStyledComponent(path, moduleName)) {
      return;
    }

    const tagPath = path.get('tag');

    addComposes(tagPath, documentation);

    const typePath = path
      .get('typeParameters')
      .get('params')
      .get(0);

    if (!typePath) return;

    applyToFlowTypeProperties(
      documentation,
      typePath,
      (propertyPath, typeParams) => {
        setPropDescriptor(documentation, propertyPath, typeParams);
      }
    );
  };
}

export default createHandler();
