import * as ts from 'typescript';
import { ExpressionStatement } from 'estree';
import { createClassDeclaration } from './ast/update-class';

function hasImportDeclation(node: ts.ImportDeclaration, textModuleSpecifier: string) {
  return node.getFullText().includes(textModuleSpecifier);
} 

function getClassDecorator(node: ts.Node, textClassDecorator: string) {
  return node.decorators.find((decorator) => {
    const decoratorExpr = decorator.expression;
    return ts.isCallExpression(decoratorExpr) && decoratorExpr.expression.getText() === textClassDecorator;
  });
}

function createReturnStatement(initializer: ts.Expression) {
  const text = (initializer as ts.NoSubstitutionTemplateLiteral).text;
  return ts.createReturn(ts.createNoSubstitutionTemplateLiteral(text));
}

export interface NamedImport {
  textModuleSpecifier: string;
  textSpecifier: string;
}

export interface ClassDeclarationCallback {
  (node: ts.ClassDeclaration, decorator: ts.Decorator): any
}

export function createVisitorImport(context: ts.TransformationContext, nameImport: NamedImport) {
  const visitor: ts.Visitor = (node) => {
    if (ts.isImportDeclaration(node)) {
      const importDeclaration = createImport(node, nameImport);
      if (importDeclaration) {
        return importDeclaration;
      }
    }
    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return visitor;
}

export function createVisitorClass(context: ts.TransformationContext) {
  const visitor: ts.Visitor = (node) => {
    if (ts.isClassDeclaration(node)) {
      return createClassDeclaration(node);
    }
    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return visitor;
}

export function createVistorClassDecorator(context: ts.TransformationContext, 
  textClassDecorator: string, 
  callbacks: ClassDeclarationCallback[]
) {
  const visitor: ts.Visitor = (node) => {
    if (ts.isClassDeclaration(node) && node.decorators && node.name) {
      const decorator = getClassDecorator(node, textClassDecorator);
      if (decorator) {      
        const filteredDecorators = node.decorators.filter((d) => d !== decorator);
        node.decorators = (filteredDecorators.length > 0) 
          ? ts.createNodeArray(filteredDecorators)
          : undefined;
        return callbacks.map(callback => callback(node, decorator));
      }
      return node;
    }
    return ts.visitEachChild(node, (child) => visitor(child), context);
  }
  return visitor;
}

export function createGetAccessor(arg: ts.ObjectLiteralElementLike) {
  const property = arg as ts.PropertyAssignment;
  const name = property.name as ts.Identifier;
  return ts.createGetAccessor(
    undefined,
    [],
    name,
    [],
    undefined,
    ts.createBlock([ createReturnStatement(property.initializer) ])
  )
}

export function createImport(node: ts.ImportDeclaration, { textSpecifier, textModuleSpecifier  }: NamedImport) {
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
    result = ts.createImportDeclaration(
      [],
      node.modifiers,
      ts.createImportClause(void 0, ts.createNamedImports([ specifier ])),
      ts.createStringLiteral(textModuleSpecifier)
    )
  }
  
  return result;
}
