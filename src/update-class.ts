import { ClassDeclaration, ObjectLiteralExpression, updateClassDeclaration } from 'typescript';
import { createStaticProperty } from './create-static-property';

export function updateClass(node: ClassDeclaration, argument: ObjectLiteralExpression) {
  return updateClassDeclaration(node, 
    node.decorators, 
    node.modifiers,
    node.name,
    undefined, 
    undefined,
    [ createStaticProperty(argument, 'style'), createStaticProperty(argument, 'template') ])    
}