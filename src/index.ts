

import * as ts from 'typescript';
import * as prettier from 'prettier';

import { promises as fsAsync, mkdirSync } from 'fs';
import { join } from 'path';

import { classDeclaration } from './visitor';
import * as ast from './ast';

function simpleTransformer<T extends ts.Node>(): ts.TransformerFactory<T> {
  return (context) => {
    const visit: ts.Visitor = (node) => {
      const value = classDeclaration(node);
      if (value) {
        return value 
      }
      
      if (ts.isDecorator(node)) {
        return undefined;
      }
      return ts.visitEachChild(node, (child) => visit(child), context);
    }
    return (node) => ts.visitNode(node, visit);
  }
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



