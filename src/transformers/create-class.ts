import * as ts from 'typescript';
import { createVistorClassDecorator, createVisitorClassDeclation } from '../utils';
import { defineCallStatement } from './define-statement';
import { getStyleProperty, getTemplateProperty } from './get-property';

import * as ast from '../ast';

const TEXT_CLASS_DECORATOR = 'CustomElement';

function updateClass(node: ts.ClassDeclaration, decorator: ts.Decorator) {
  const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;
  const elements = [ getStyleProperty(argument), getTemplateProperty(argument) ];
  return ast.updateClassDeclaration(node, elements);
}

export function extendBaseClass(context: ts.TransformationContext, sf: ts.SourceFile) {
  function callback(node: ts.ClassDeclaration): ts.ClassDeclaration {
    node.heritageClauses = ts.createNodeArray([ ast.heritageClauses(node, 'CustomHTMLElement') ]);
    return ast.updateClassDeclaration(node, [ ...ast.addOrUpdateConstructor(node, true) ])
  }
  return ts.visitNode(sf, createVisitorClassDeclation(context, callback));
}

export function updateClassFromDecorator(context: ts.TransformationContext, sf: ts.SourceFile) {
  const callbacks = [ updateClass, defineCallStatement ];
  return ts.visitNode(sf, createVistorClassDecorator(context, TEXT_CLASS_DECORATOR, callbacks));
}