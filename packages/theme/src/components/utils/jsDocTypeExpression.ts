function typeExpression(type): string {
  if (!type) return '';

  if (type.type === `RecordType`) {
    return 'object';
  }
  if (type.type === `NameExpression`) {
    return type.name;
  }
  if (type.type === `VoidLiteral`) {
    return 'void';
  }
  if (type.type === `NullLiteral`) {
    return 'null';
  }
  if (type.type === `UndefinedLiteral`) {
    return 'undefined';
  }
  if (type.type === 'FunctionType') {
    return 'function';
  }
  if (type.type === `UnionType`) {
    return type.elements.map(typeExpression).join(' | ');
  }
  // tuples [number, string]
  if (type.type === `ArrayType`) {
    return `[${type.elements.map(typeExpression).join(', ')}]`;
  }

  if (type.type === `TypeApplication` && type.expression) {
    if (type.expression.name === `Array`) {
      return `${typeExpression(type.applications[0])}[]`;
    }
    return `${typeExpression(type.expression)}<${typeExpression(
      type.applications[0],
    )}>`;
  }

  return '';
}

export default typeExpression;
