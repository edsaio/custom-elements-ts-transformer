import { 
  ClassDeclaration, 
  ObjectLiteralExpression, 
  updateClassDeclaration, 
  createHeritageClause, 
  SyntaxKind, 
  createExpressionWithTypeArguments,
  createIdentifier,
  createConstructor,
  createBlock,
  createStatement,
  createCall,
  createSuper,
} from 'typescript';

import { createStaticProperty } from './create-static-property';

/**
 * This will add extends to the existing Custom Elements
 * @param node 
 */
function heritageClauses(node: ClassDeclaration) {
  return (node.heritageClauses || [ createHeritageClause(
    SyntaxKind.ExtendsKeyword,
    [ createExpressionWithTypeArguments([], createIdentifier('CustomHTMLElement')) ]
  )])
}

/**
 * This will add constructor if not existing elements else
 * get from the Child class
 * @param node 
 */
function nodeMembers(node: ClassDeclaration) {
  const member = node.members.find(mem => mem.kind === SyntaxKind.Constructor);

  function constructorBlock() {
    return createBlock([ createStatement(createCall(createSuper(), [], [])) ])
  }

  return [ 
   ...node.members,
   ...((member) ? []: [ createConstructor([], [], [], constructorBlock()) ])
  ]
}

/**
 * update Class 
 * update the members also add constructor function
 * add get style and get template
 * @param node 
 * @param argument 
 */
export function updateClass(node: ClassDeclaration, argument: ObjectLiteralExpression) {
  return updateClassDeclaration(node, 
    node.decorators, 
    node.modifiers,
    node.name,
    undefined,
    heritageClauses(node),
    [ ...nodeMembers(node), createStaticProperty(argument, 'style'), createStaticProperty(argument, 'template') ])    
}