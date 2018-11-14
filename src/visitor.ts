import * as ts from 'typescript';
import { updateClass } from './update-class';
import { createDefineStatement } from './create-define-statement';

export const customElementDecorator = (node: ts.Node) => {
  return node.decorators.find((decorator) => {
    const decoratorExpr = decorator.expression;
    return ts.isCallExpression(decoratorExpr) && decoratorExpr.expression.getText() === 'customElement';
  });
}

export const classDeclaration = (node: ts.Node) => {
  if (ts.isClassDeclaration(node) && node.decorators && node.name) { 
    const decorator = customElementDecorator(node);
    
    if (decorator) {
      const filteredDecorators = node.decorators.filter((d) => d !== decorator);
      node.decorators = (filteredDecorators.length > 0) 
        ? ts.createNodeArray(filteredDecorators)
        : undefined;

      const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;
      return [
        updateClass(node, argument), 
        createDefineStatement(node, argument)
      ]
    }
    return node;
  }
  return undefined;
}

