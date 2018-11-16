
import { TransformationContext, SourceFile, visitNode } from 'typescript';
import { createVisitorImport } from '../utils';

const textSpecifier = 'CustomHTMLElement';
const textModuleSpecifier = './custom-html-element';

export function addImports(context: TransformationContext, sf: SourceFile) {
  return visitNode(sf, createVisitorImport(context, { textSpecifier, textModuleSpecifier }));
}