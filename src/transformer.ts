import * as ts from 'typescript';

import UpdateClassTransformer from './transformers/update-class';
import ExtendsClassTransformer from './transformers/extends-class';
import ImportCustomHtmlElement from './transformers/import-custom-html-element';

export function transformer(): Array<ts.TransformerFactory<ts.SourceFile>> {
  const tsSourceTransformers: Array<ts.TransformerFactory<ts.SourceFile>> = [
    new UpdateClassTransformer().factory(),
    new ImportCustomHtmlElement().factory(),
    new ExtendsClassTransformer().factory()
  ]
  return tsSourceTransformers;
}