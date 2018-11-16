import * as ts from 'typescript';

import { updateClass } from './update-class';
import { createDefineStatement } from './transformers/define-statement';
import { createClass } from './transformers/create-class';

export function transformer(): Array<ts.TransformerFactory<ts.SourceFile>> {
  const tsSourceTransformers: Array<ts.TransformerFactory<ts.SourceFile>> = [
    (context: ts.TransformationContext) => (file: ts.SourceFile) => createClass(context, file),
    (context: ts.TransformationContext) => (file: ts.SourceFile) => createDefineStatement(context, file)
  ]
  return tsSourceTransformers;
}