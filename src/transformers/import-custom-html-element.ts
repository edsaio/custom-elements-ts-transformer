
import * as ts from 'typescript';
import * as ast from '../ast';

import { TransformerFactory } from './transformer-factory';

const textSpecifier = 'CustomHTMLElement';
const textModuleSpecifier = './custom-html-element';

export default class ImportCustomHtmlElement extends TransformerFactory<ts.SourceFile> {
  transform(context: ts.TransformationContext, source: ts.SourceFile): ts.SourceFile {
    return ts.visitNode(source, ast.visitor.importDeclaration(context, { textSpecifier, textModuleSpecifier }))
  }
}