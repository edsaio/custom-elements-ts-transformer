import * as ts from 'typescript';

export function addOrUpdateConstructor(node: ts.ClassDeclaration, hasSuper?: boolean) {
  const member = node.members.find(mem => mem.kind === ts.SyntaxKind.Constructor);

  function constructorBlock() {
    const constructorBlockStatements = [];
    if (hasSuper) {
      constructorBlockStatements.push(ts.createStatement(ts.createCall(ts.createSuper(), [], [])))
    }
    return ts.createBlock(constructorBlockStatements);
  }

  return [ 
   ...((member) ? []: [ ts.createConstructor([], [], [], constructorBlock()) ])
  ]
}

export function heritageClauses(node: ts.ClassDeclaration, baseClass: string) {
  return ts.createHeritageClause(ts.SyntaxKind.ExtendsKeyword,
    [ ts.createExpressionWithTypeArguments([], ts.createIdentifier(baseClass)) ]
  )
}

export function createClassDeclaration(node: ts.ClassDeclaration) {
  return ts.updateClassDeclaration(node,
    node.decorators,
    node.modifiers,
    node.name,
    undefined,
    [ heritageClauses(node, 'CustomHTMLElement') ],
    [ ...node.members, ...addOrUpdateConstructor(node, true) ]
  )
}

export function updateClassDeclaration(node: ts.ClassDeclaration, elements: ts.ClassElement[]) {
  return ts.updateClassDeclaration(node, 
    node.decorators, 
    node.modifiers,
    node.name,
    undefined,
    node.heritageClauses,
    [ ...node.members, ...elements ])
} 