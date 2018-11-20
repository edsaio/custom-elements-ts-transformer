import * as ts from 'typescript';
import * as ast from '../ast';
import { TransformerFactory } from './transformer-factory';

const TEXT_CLASS_DECORATOR = 'CustomElement';

function getStyleProperty(argument: ts.ObjectLiteralExpression) {
  const arg = ast.utils.getClassDecoratorProperty(argument, 'style');
  return (arg) ? ast.utils.createGetAccessor(arg): undefined;
}

function getTemplateProperty(argument: ts.ObjectLiteralExpression) {
  const arg = ast.utils.getClassDecoratorProperty(argument, 'template');
  return (arg) ? ast.utils.createGetAccessor(arg): undefined;
}

function createDefineCallStatement(node: ts.ClassDeclaration, argument: ts.ObjectLiteralExpression)  {
  const METHOD_NAME = 'customElements', DEFINE_NAME = 'define';

  const tag = ast.utils.getClassDecoratorProperty(argument, 'tag');
  const name = (tag as ts.PropertyAssignment).initializer;
  const propertyAccess = ts.createPropertyAccess(ts.createIdentifier(METHOD_NAME), ts.createIdentifier(DEFINE_NAME));
  return (tag) 
    ? ts.createStatement(ts.createCall(propertyAccess, undefined, [name, node.name]))
    : undefined;
}

function updateClassCallback(node: ts.ClassDeclaration, decorator: ts.Decorator) {
  const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;
  const elements = [ getStyleProperty(argument), getTemplateProperty(argument) ];
  return ast.utils.updateClassDeclaration(node, elements);
}

function defineCallStatement(node: ts.ClassDeclaration, decorator: ts.Decorator) {
  const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;
  return createDefineCallStatement(node, argument);
}

export default class UpdateClassTransformer extends TransformerFactory<ts.SourceFile> {
  transform(context: ts.TransformationContext, source: ts.SourceFile): ts.SourceFile {
    const options: ast.ClassDecoratorOptions = {
      context: context,
      textClassDecorator: TEXT_CLASS_DECORATOR,
      callbacks: [ updateClassCallback, defineCallStatement ]
    }
    return ts.visitNode(source, ast.visitor.classDecorator(options));
  }
}