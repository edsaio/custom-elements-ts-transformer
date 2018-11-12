import { 
  ObjectLiteralExpression, 
  PropertyAssignment, 
  Identifier, 
  createGetAccessor, 
  createModifier, 
  createBlock, 
  SyntaxKind
} from 'typescript';

import { getClassDecoratorProperty } from './get-class-decorator-property';
import { createReturnStatement } from './create-return-statement';

export function createStaticProperty(argument: ObjectLiteralExpression, meta: string) {
  const style = getClassDecoratorProperty(argument, meta);
  return (style) 
    ? (function() {
        const property = style as PropertyAssignment;
        const name = property.name as Identifier;
        return createGetAccessor(
          undefined,
          [ createModifier(SyntaxKind.StaticKeyword) ],
          name,
          [],
          undefined,
          createBlock([ createReturnStatement(property.initializer) ])
        )
      })()
    : undefined;
}
