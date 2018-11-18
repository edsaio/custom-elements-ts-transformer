import * as ts from 'typescript';
import { createVistorClassDecorator } from '../utils';
import { getClassDecoratorProperty } from '../get-class-decorator-property';

const TEXT_CLASS_DECORATOR = 'CustomElement';
const METHOD_NAME = 'customElements';
const DEFINE_NAME = 'define';

export function defineCallStatement(node: ts.ClassDeclaration, decorator: ts.Decorator) {
  const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;
  return createDefineCallStatement(node, argument)
}

export function createDefineCallStatement(node: ts.ClassDeclaration, argument: ts.ObjectLiteralExpression)  {
  const tag = getClassDecoratorProperty(argument, 'tag');
  const name = (tag as ts.PropertyAssignment).initializer;
  const propertyAccess = ts.createPropertyAccess(ts.createIdentifier(METHOD_NAME), ts.createIdentifier(DEFINE_NAME));
  return (tag) 
    ? ts.createStatement(ts.createCall(propertyAccess, undefined, [name, node.name]))
    : undefined;
}