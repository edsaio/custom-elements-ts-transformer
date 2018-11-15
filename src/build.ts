import { resolve, join } from 'path';

import { rollup } from 'rollup';
import { transformer } from './transformer';

const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');

const rollupConfig = {
  inputOptions: {
    treeshake: true,
    input: 'src/demo/hello-world.element.ts',
    plugins: [
      typescript({
        tsconfig: 'src/tsconfig.json',
        transformers: [service => ({
          before: [ ...transformer() ],
          after: []
        })],
        check: false,
        cacheRoot: join(resolve(), 'node_modules/.tmp/.rts2_cache'), 
        useTsconfigDeclarationDir: true       
      }),
      nodeResolve()
    ],
    onwarn (warning) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      console.log("Rollup warning: ", warning.message);
    }
  },
  outputOptions: {
    sourcemap: true,
    exports: 'named',
    file: 'dist/bundle.js',
    name: 'my-class', 
    format: 'es'
  }
}

async function rollupBuild({ inputOptions, outputOptions }): Promise<any> {
  return rollup(inputOptions).then(bundle => bundle.write(outputOptions));
}

rollupBuild(rollupConfig);