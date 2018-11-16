import * as ts from 'typescript';
import { createGetAccessor } from '../utils';
import { getClassDecoratorProperty } from '../get-class-decorator-property';

export function getStyleProperty(argument: ts.ObjectLiteralExpression) {
  const arg = getClassDecoratorProperty(argument, 'style');
  return (arg) ? createGetAccessor(arg): undefined;
}

export function getTemplateProperty(argument: ts.ObjectLiteralExpression) {
  const arg = getClassDecoratorProperty(argument, 'template');
  return (arg) ? createGetAccessor(arg): undefined;
}