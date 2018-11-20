

import * as ts from 'typescript';
import * as prettier from 'prettier';

import { promises as fsAsync, mkdirSync } from 'fs';
import { join } from 'path';

import { transformer } from './transformer';

(async function() {
  const SOURCE_FILE = join(__dirname, 'demo', 'hello-world.element.ts');
  const source = await fsAsync.readFile(SOURCE_FILE, 'utf8');

  let result = ts.transpileModule(source, {
    compilerOptions: {module: ts.ModuleKind.ES2015, target: ts.ScriptTarget.ES2018 },
    transformers: { 
      before: [ ...transformer() ]
    }
  });
  
  const FILE_PATH = 'dist/output.js';
  
  mkdirSync('dist', { recursive: true });
  fsAsync.writeFile(FILE_PATH, 
    prettier.format(result.outputText, { tabWidth: 2, parser: 'babylon' })
  );  
})();



