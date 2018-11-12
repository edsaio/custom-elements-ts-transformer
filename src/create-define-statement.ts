import { 
  ClassDeclaration, 
  ObjectLiteralExpression, 
  PropertyAssignment, 
  createPropertyAccess, 
  createIdentifier, 
  createCall, 
  createStatement 
} from 'typescript';

import { getClassDecoratorProperty } from './get-class-decorator-property';

export function createDefineStatement(node: ClassDeclaration, argument: ObjectLiteralExpression) {
  const tag = getClassDecoratorProperty(argument, 'tag');
  const name = (tag as PropertyAssignment).initializer;
  const propertyAccess = createPropertyAccess(createIdentifier('customElements'), createIdentifier('define'));
  return (tag) 
    ? createStatement(createCall(propertyAccess, undefined, [name, node.name]))
    : undefined;
}