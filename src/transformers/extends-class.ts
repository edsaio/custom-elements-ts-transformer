import * as ts from 'typescript';
import * as ast from '../ast';

import { TransformerFactory } from './transformer-factory';

const BASE_CLASS = 'CustomHTMLElement';

function callback(node: ts.ClassDeclaration): ts.ClassDeclaration {
  node.heritageClauses = ts.createNodeArray([ ast.heritageClauses(node, BASE_CLASS) ]);
  return ast.updateClassDeclaration(node, [ ...ast.addOrUpdateConstructor(node, true) ])
}

export default class ExtendClassTransformer extends TransformerFactory<ts.SourceFile> {
  transform(context: ts.TransformationContext, source: ts.SourceFile): ts.SourceFile {
    return ts.visitNode(source, ast.visitor.classDeclation(context, callback));
  }
}