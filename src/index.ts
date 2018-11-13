

import * as ts from 'typescript';
import * as prettier from 'prettier';

import { promises as fsAsync, mkdirSync } from 'fs';
import { join } from 'path';

import { createDefineStatement } from './create-define-statement';
import { updateClass } from './update-class';

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

          return [
            updateClass(node, argument), 
            createDefineStatement(node, argument)
          ]; 
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
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 },
    transformers: { 
      before: [ simpleTransformer() ]
    }
  });
  
  const FILE_PATH = 'dist/output.js';
  
  mkdirSync('dist', { recursive: true });
  fsAsync.writeFile(FILE_PATH, 
    prettier.format(result.outputText, { tabWidth: 2, parser: 'babylon' })
  );  
})();



