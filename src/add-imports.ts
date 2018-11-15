
import * as ts from 'typescript';

const BASE_CLASS = 'CustomHTMLElement';
const MODULE_PATH = "./custom-html-element";

function isElementImport(node: ts.ImportDeclaration, sourceFile: ts.SourceFile): boolean {
  const text = sourceFile.text.substring(node.getStart(sourceFile), node.getEnd())
  return text.includes(MODULE_PATH);
}

export function addImports(context: ts.TransformationContext, sf: ts.SourceFile) {
  const visitor: ts.Visitor = (node) => {
    if (ts.isImportDeclaration(node)) {
      const importDeclaration = node as ts.ImportDeclaration;
      const moduleSpecifier = importDeclaration.moduleSpecifier as ts.Expression;
      
      const specifier = ts.createImportSpecifier(void 0, ts.createIdentifier(BASE_CLASS));

      if (isElementImport(node, sf) && moduleSpecifier.getText(sf) === MODULE_PATH) {
        const { namedBindings } = importDeclaration.importClause;
        const { elements } = namedBindings as ts.NamedImports
        const specifiers: Array<ts.ImportSpecifier> = [ ...elements ];
  
        const hasCustomHTMLElementImport = elements.some(n => n.getText().indexOf(BASE_CLASS) > -1)
    
        if (!hasCustomHTMLElementImport) {
          specifiers.push(specifier)
        }  
  
        return ts.createImportDeclaration(
          [],
          node.modifiers,
          ts.createImportClause(void 0, ts.createNamedImports(specifiers)),
          node.moduleSpecifier
        )
      }

      if (!isElementImport(node, sf)) {
        return ts.createImportDeclaration(
          [],
          node.modifiers,
          ts.createImportClause(void 0, ts.createNamedImports([ specifier ])),
          ts.createStringLiteral(MODULE_PATH)
        )
      }

    }
    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return ts.visitNode(sf, visitor);
}

