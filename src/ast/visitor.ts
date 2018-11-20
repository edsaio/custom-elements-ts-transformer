import * as ts from 'typescript';

import { utils } from './utils';

export interface CallbackClassDeclaration {
  (node: ts.ClassDeclaration, decorators?: ts.Decorator): ts.ClassDeclaration | ts.ExpressionStatement;
}

export interface ClassDecoratorOptions {
  context: ts.TransformationContext;
  textClassDecorator: string; 
  callbacks: CallbackClassDeclaration[];
}

export const visitor = {
  importDeclaration(context: ts.TransformationContext, { textSpecifier, textModuleSpecifier }) {
    const visitor: ts.Visitor = (node) => {
      if (ts.isImportDeclaration(node)) {
        const specifier = ts.createImportSpecifier(void 0, ts.createIdentifier("CustomHTMLElement"));
        return ts.createImportDeclaration(
          [],
          node.modifiers,
          ts.createImportClause(undefined, ts.createNamedImports([ specifier ])),
          ts.createStringLiteral("./custom-html-element")
        );
      }
      return ts.visitEachChild(node, (child) => visitor(child), context);
    }
    return visitor;
  },
  classDeclation(context: ts.TransformationContext, callback: CallbackClassDeclaration) {
    const visitor: ts.Visitor = (node) => {
      if (ts.isClassDeclaration(node)) {
        return callback(node);
      }
      return ts.visitEachChild(node, (child) => visitor(child), context);
    }
    return visitor;
  },
  classDecorator({ context, textClassDecorator, callbacks }: ClassDecoratorOptions) {
    const visitor: ts.Visitor = (node) => {
      if (ts.isClassDeclaration(node) && node.decorators && node.name) {
        const decorator = utils.getClassDecorator(node, textClassDecorator);
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
}
