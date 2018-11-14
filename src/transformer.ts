import * as ts from 'typescript';

import { updateClass } from './update-class';
import { createDefineStatement } from './create-define-statement';

export function transformer(): Array<ts.TransformerFactory<ts.SourceFile>> {
  const tsSourceTransformers: Array<ts.TransformerFactory<ts.SourceFile>> = [
    (context: ts.TransformationContext) => (file: ts.SourceFile) => transform(context, file)
  ]
  return tsSourceTransformers;
}

const customElementDecorator = (node: ts.Node) => {
  return node.decorators.find((decorator) => {
    const decoratorExpr = decorator.expression;
    return ts.isCallExpression(decoratorExpr) && decoratorExpr.expression.getText() === 'customElement';
  });
}

const transform = (context: ts.TransformationContext, sf: ts.SourceFile) => {
  const visitor: ts.Visitor = (node) => {
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

    if (ts.isDecorator(node)) {
      return undefined;
    }

    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return ts.visitNode(sf, visitor);
}