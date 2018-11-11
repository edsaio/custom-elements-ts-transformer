// @ts-ignore

import * as ts from 'typescript';

import { promises as fsAsync, mkdirSync } from 'fs';
import { join } from 'path';
import * as prettier from 'prettier';

function simpleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {

    const visit: ts.Visitor = (node) => {
      if (ts.isClassDeclaration(node) && node.decorators && node.name) {
        const decorator = node.decorators.find((decorator) => {
          const decoratorExpr = decorator.expression;
          return ts.isCallExpression(decoratorExpr) && decoratorExpr.expression.getText() === 'customElement';
        });

        if (decorator) {
          const filteredDecorators = node.decorators.filter((d) => d !== decorator);

          if (filteredDecorators.length > 0) {
            node.decorators = ts.createNodeArray(filteredDecorators);
          } else {
            node.decorators = undefined;
          }

          const argument = (<ts.CallExpression>decorator.expression).arguments[0] as ts.ObjectLiteralExpression;

          const tag = argument.properties.find((property: ts.PropertyAssignment) => {
            return (property.name as ts.Identifier).text === 'tag';
          });

          let defineCall;
          if (tag) {
            const name = (tag as ts.PropertyAssignment).initializer;
            defineCall = ts.createStatement(ts.createCall(
              ts.createPropertyAccess(
                ts.createIdentifier('customElements'),
                ts.createIdentifier('define')
              ), undefined, [name, node.name]));
          }

          const style = argument.properties.find((property: ts.PropertyAssignment) => {
            return (property.name as ts.Identifier).text === 'style';
          });

          let styleTransform;
          if (style) {
            const property = style as ts.PropertyAssignment;
            const name = property.name as ts.Identifier;

            const left = ts.createPropertyAccess(node.name, name);

            const text = (property.initializer as ts.NoSubstitutionTemplateLiteral).text;
            const returnStatement = ts.createReturn(ts.createNoSubstitutionTemplateLiteral(text));

            const right = ts.createFunctionExpression(
              undefined, undefined, undefined, undefined,
              [], undefined, ts.createBlock([ returnStatement ])
            );

            const binaryExpr = ts.createBinary(left, ts.SyntaxKind.EqualsToken, right);
            styleTransform = ts.createExpressionStatement(binaryExpr);
          }

          const template = argument.properties.find((property: ts.PropertyAssignment) => {
            return (property.name as ts.Identifier).text === 'template';
          });

          let templateTransform;
          if (template) {
            const property = template as ts.PropertyAssignment;
            const name = property.name as ts.Identifier;

            const left = ts.createPropertyAccess(node.name, name);

            const text = (property.initializer as ts.NoSubstitutionTemplateLiteral).text;
            const returnStatement = ts.createReturn(ts.createNoSubstitutionTemplateLiteral(text));

            const right = ts.createFunctionExpression(
              undefined, undefined, undefined, undefined,
              [], undefined, ts.createBlock([ returnStatement ])
            );

            const binaryExpr = ts.createBinary(left, ts.SyntaxKind.EqualsToken, right);
            templateTransform = ts.createExpressionStatement(binaryExpr);            
          }

          return [node, styleTransform, templateTransform, defineCall]; 

        }
        return node;      
      }

      if (ts.isDecorator(node)) {
        return undefined;
      }
      return ts.visitEachChild(node, (child) => visit(child), context);
    };

    return (node) => ts.visitNode(node, visit);
  };
}

(async function() {
  const SOURCE_FILE = join(__dirname, 'my-class.ts');
  const source = await fsAsync.readFile(SOURCE_FILE, 'utf8');

  let result = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2016 },
    transformers: { 
      before: [
        simpleTransformer()
      ]
    }
  });
  
  const FILE_PATH = 'dist/output.js';
  
  mkdirSync('dist', { recursive: true });
  fsAsync.writeFile(FILE_PATH, prettier.format(result.outputText, { tabWidth: 2 }));  
})();



