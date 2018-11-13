import * as ts from 'typescript';

import { classDeclaration } from './visitor'

export function transformer(): Array<ts.TransformerFactory<ts.SourceFile>> {
  const tsSourceTransformers: Array<ts.TransformerFactory<ts.SourceFile>> = [
    (context: ts.TransformationContext) => (file: ts.SourceFile) => transform(context, file)
  ]
  return tsSourceTransformers;
}

const transform = (context: ts.TransformationContext, sf: ts.SourceFile) => {
  const visitor: ts.Visitor = (node) => {
    const value = classDeclaration(node);
    if (value) {
      return value 
    }
    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return ts.visitNode(sf, visitor);
}