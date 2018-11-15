
import * as ts from 'typescript';

const BASE_CLASS = 'CustomHTMLElement';
const MODULE_PATH = "./custom-html-element";




export function addImports(context: ts.TransformationContext, sf: ts.SourceFile) {
  const visitor: ts.Visitor = (node) => {
    if (ts.isImportDeclaration(node)) {
      const importDeclaration = node as ts.ImportDeclaration;
      const moduleSpecifier = importDeclaration.moduleSpecifier as ts.Expression;
      
      const specifier = ts.createImportSpecifier(void 0, ts.createIdentifier(BASE_CLASS));
    
  
      // if (importDeclaration.importClause) {
      //   const { namedBindings } = importDeclaration.importClause;
      //   const { elements } = namedBindings as ts.NamedImports
      //   const specifiers: Array<ts.ImportSpecifier> = [ ...elements ];
  
      //   console.log(elements.map(element => element.getText()));

      //   const hasCustomHTMLElementImport = 
      //     elements.map(element => element.getText())
      //        .find(element => element === BASE_CLASS)

      //   specifiers.push(specifier);

      //   return ts.updateImportDeclaration(importDeclaration, 
      //     node.decorators, 
      //     node.modifiers, 
      //     ts.createImportClause(ts.createIdentifier(BASE_CLASS), ts.createNamedImports(specifiers)), 
      //     moduleSpecifier);
      // } 
  
      return ts.createImportDeclaration(
        [],
        node.modifiers,
        ts.createImportClause(undefined, ts.createNamedImports([ specifier ])),
        ts.createStringLiteral(MODULE_PATH)
      )
    }
    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return ts.visitNode(sf, visitor);
}

