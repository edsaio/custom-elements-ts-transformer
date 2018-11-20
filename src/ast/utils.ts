
import * as ts from 'typescript';

function hasImportDeclation(node: ts.ImportDeclaration, textModuleSpecifier: string) {
  return node.getFullText().includes(textModuleSpecifier);
} 

export const utils = {
  getClassDecorator(node: ts.Node, textClassDecorator: string) {
    return node.decorators.find((decorator) => {
      const decoratorExpr = decorator.expression;
      return ts.isCallExpression(decoratorExpr) && decoratorExpr.expression.getText() === textClassDecorator;
    });
  },
  getClassDecoratorProperty(argument: ts.ObjectLiteralExpression, name: string) {
    return argument.properties.find((property: ts.PropertyAssignment) => {
      return (property.name as ts.Identifier).text === name;
    });
  },
  createHeritageClauses(node: ts.ClassDeclaration, baseClass: string) {
    return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword,
      [ ts.createExpressionWithTypeArguments([], ts.createIdentifier(baseClass)) ]
    )
  },
  createConstructorBlock(hasSuper: boolean) {
    const constructorBlockStatements = [];
    if (hasSuper) {
      constructorBlockStatements.push(ts.createStatement(ts.createCall(ts.createSuper(), [], [])))
    }
    return ts.createBlock(constructorBlockStatements);
  },
  createConstructor(node: ts.ClassDeclaration, hasSuper?: boolean) {
    const member = node.members.find(mem => mem.kind === ts.SyntaxKind.Constructor);
    return [ 
     ...((member) ? []: [ ts.createConstructor([], [], [], this.constructorBlock(hasSuper)) ])
    ]
  },
  createGetAccessor(arg: ts.ObjectLiteralElementLike) {
    const property = arg as ts.PropertyAssignment;
    const name = property.name as ts.Identifier;
    return ts.createGetAccessor(
      undefined,
      [],
      name,
      [],
      undefined,
      ts.createBlock([ this.createReturnStatement(property.initializer) ])
    )
  },
  createReturnStatement(initializer: ts.Expression) {
    const text = (initializer as ts.NoSubstitutionTemplateLiteral).text;
    return ts.createReturn(ts.createNoSubstitutionTemplateLiteral(text));
  },
  updateClassDeclaration(node: ts.ClassDeclaration, elements: ts.ClassElement[]) {
    return ts.updateClassDeclaration(node, 
      node.decorators, 
      node.modifiers,
      node.name,
      undefined,
      node.heritageClauses,
      [ ...node.members, ...elements ])
  },
  createImport(node: ts.ImportDeclaration, { textSpecifier, textModuleSpecifier  }) {
    let result;
  
    const importDeclaration = node as ts.ImportDeclaration;
    const moduleSpecifier = importDeclaration.moduleSpecifier as ts.Expression;
  
    const specifier = ts.createImportSpecifier(void 0, ts.createIdentifier(textSpecifier));


    if (hasImportDeclation(node, textSpecifier) && moduleSpecifier.getFullText() === textModuleSpecifier) {
      const { namedBindings } = importDeclaration.importClause;
      const { elements } = namedBindings as ts.NamedImports
      const specifiers: Array<ts.ImportSpecifier> = [ ...elements ];
  
      const hasCustomHTMLElementImport = elements.some(n => n.getText().indexOf(textSpecifier) > -1)

      if (!hasCustomHTMLElementImport) {
        specifiers.push(specifier)
      }  
  
      result = ts.createImportDeclaration(
        [],
        node.modifiers,
        ts.createImportClause(void 0, ts.createNamedImports(specifiers)),
        node.moduleSpecifier
      )
    }
  
    if (!hasImportDeclation(node, textModuleSpecifier)) {
      result = ts.updateImportDeclaration(node,
        [],
        node.modifiers,
        ts.createImportClause(void 0, ts.createNamedImports([ specifier ])),
        ts.createStringLiteral(textModuleSpecifier)
      )
    }
  

    return result;
  } 
}
