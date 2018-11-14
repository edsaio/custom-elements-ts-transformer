import { 
  ObjectLiteralExpression, 
  PropertyAssignment, 
  Identifier, 
  createGetAccessor, 
  createModifier, 
  createBlock, 
  SyntaxKind,
  ObjectLiteralElementLike
} from 'typescript';

import { getClassDecoratorProperty } from './get-class-decorator-property';
import { createReturnStatement } from './create-return-statement';

function getAccessor(arg: ObjectLiteralElementLike) {
  const property = arg as PropertyAssignment;
  const name = property.name as Identifier;
  return createGetAccessor(
    undefined,
    [ createModifier(SyntaxKind.StaticKeyword) ],
    name,
    [],
    undefined,
    createBlock([ createReturnStatement(property.initializer) ])
  )
}

export function createStaticProperty(argument: ObjectLiteralExpression, meta: string) {
  const arg = getClassDecoratorProperty(argument, meta);
  return (arg) ? getAccessor(arg): undefined;
}
