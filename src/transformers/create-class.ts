import * as ts from 'typescript';
import { createVistorClassDecorator } from '../utils';
import { getTemplateProperty, getStyleProperty } from './get-property';
import { createDefineCallStatement } from './define-statement';

const TEXT_CLASS_DECORATOR = 'CustomElement';

function updateClass(node: ts.ClassDeclaration, decorator: ts.Decorator) {
  const filteredDecorators = node.decorators.filter((d) => d !== decorator);
  node.decorators = (filteredDecorators.length > 0) 
    ? ts.createNodeArray(filteredDecorators)
    : undefined;

  const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;

  console.log('Hey')

  return ts.updateClassDeclaration(node, 
      node.decorators, 
      node.modifiers,
      node.name,
      undefined,
      node.heritageClauses,
      [ getTemplateProperty(argument), getStyleProperty(argument) ])
}

export function createClass(context: ts.TransformationContext, sf: ts.SourceFile) {
  const visitor = createVistorClassDecorator(context, TEXT_CLASS_DECORATOR, updateClass)
  return ts.visitNode(sf, visitor);
}