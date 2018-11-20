

import * as ts from 'typescript';
import * as prettier from 'prettier';

import { promises as fsAsync, mkdirSync } from 'fs';
import { join } from 'path';

import UpdateClassTransformer from './transformers/update-class';
import ExtendsClassTransformer from './transformers/extends-class';

(async function() {
  const SOURCE_FILE = join(__dirname, 'demo', 'hello-world.element.ts');
  const source = await fsAsync.readFile(SOURCE_FILE, 'utf8');

  let result = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2018 },
    transformers: { 
      before: [ 
        new UpdateClassTransformer<ts.SourceFile>().factory(), 
        new ExtendsClassTransformer<ts.SourceFile>().factory() 
      ]
    }
  });
  
  const FILE_PATH = 'dist/output.js';
  
  mkdirSync('dist', { recursive: true });
  fsAsync.writeFile(FILE_PATH, 
    prettier.format(result.outputText, { tabWidth: 2, parser: 'babylon' })
  );  
})();



