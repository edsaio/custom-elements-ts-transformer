import * as ts from 'typescript';
import * as ast from '../ast';
import { TransformerFactory } from './transformer-factory';

export default class ToggleDecorators extends TransformerFactory<ts.SourceFile> {
  
  createGetAccessors(elements: ts.ClassElement[]) {
    return elements.map(element => {
      const name = (element.name as ts.Identifier).text;
      const returnStatement = ts.createReturn(
        ts.createCall(ts.createIdentifier('toggleGet'), undefined, [ ts.createStringLiteral(name) ] )
      );
      return ts.createGetAccessor(undefined, [], name, [], undefined, ts.createBlock([ returnStatement ])) 
    })
  }

  transform(context: ts.TransformationContext, source: ts.SourceFile): ts.SourceFile {
    const propertyCallback = (node: ts.ClassDeclaration) => {
      const members = node.members.filter(member => ts.isPropertyDeclaration(member));
      if (members && members.length > 0) {
        const decorators = members.map(member => member.decorators);
        if (decorators && decorators.length > 0) {
          node.members = ts.createNodeArray(node.members.filter(member => member.decorators === undefined))
          return ast.updateClassDeclaration(node, [ ...this.createGetAccessors(members) ])
        }
      }
      return node;
    }
    return ts.visitNode(source, ast.visitor.classDeclation(context, propertyCallback));
  }

}