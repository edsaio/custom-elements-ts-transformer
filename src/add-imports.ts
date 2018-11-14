
import * as ts from 'typescript';

const BASE_CLASS = 'CustomHTMLElement';

/**
 * add BASE_CLASS import
 * TODO: check the source if theres source value;
 *  if no add it else add only the export class
 * @param node 
 */
export function addImports(node: ts.ImportDeclaration) {
  const { namedBindings } = node.importClause;
  const { elements } = namedBindings as ts.NamedImports

  const specifiers: Array<ts.ImportSpecifier> = [...elements];

  const hasCustomHTMLElementImport = elements.some(n => n.getText().indexOf(BASE_CLASS) > -1)

  if (!hasCustomHTMLElementImport) {
    specifiers.push(ts.createImportSpecifier(void 0, ts.createIdentifier(BASE_CLASS)))
  }

  return ts.createImportDeclaration(
    [],
    node.modifiers,
    ts.createImportClause(void 0, ts.createNamedImports(specifiers)),
    node.moduleSpecifier
  )
}