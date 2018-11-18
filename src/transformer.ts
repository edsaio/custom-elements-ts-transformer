import * as ts from 'typescript';

import { updateClassFromDecorator, extendBaseClass } from './transformers/create-class';

export function transformer(): Array<ts.TransformerFactory<ts.SourceFile>> {
  const tsSourceTransformers: Array<ts.TransformerFactory<ts.SourceFile>> = [
    (context: ts.TransformationContext) => (file: ts.SourceFile) => updateClassFromDecorator(context, file),
    (context: ts.TransformationContext) => (file: ts.SourceFile) => extendBaseClass(context, file)
  ]
  return tsSourceTransformers;
}