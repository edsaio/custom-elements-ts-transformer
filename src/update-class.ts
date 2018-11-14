import { ClassDeclaration, ObjectLiteralExpression, updateClassDeclaration, createConstructor, ConstructorDeclaration, ClassElement } from 'typescript';
import { createStaticProperty } from './create-static-property';

export function updateClass(node: ClassDeclaration, argument: ObjectLiteralExpression) {
  return updateClassDeclaration(node, 
    node.decorators, 
    node.modifiers,
    node.name,
    undefined,
    node.heritageClauses,
    [ ...node.members, createStaticProperty(argument, 'style'), createStaticProperty(argument, 'template') ])    
}