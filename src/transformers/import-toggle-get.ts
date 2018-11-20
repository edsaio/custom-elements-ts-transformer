
import * as ts from 'typescript';
import * as ast from '../ast';

import { TransformerFactory } from './transformer-factory';

const textSpecifier = 'toggleGet';
const textModuleSpecifier = './toggle';

export default class ImportToggleGetTransformer extends TransformerFactory<ts.SourceFile> {
  
  transform(context: ts.TransformationContext, source: ts.SourceFile): ts.SourceFile {
    return ts.visitNode(source, ast.visitor.importDeclaration(context, { textSpecifier, textModuleSpecifier }))
  }

}