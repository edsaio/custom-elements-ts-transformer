import { join, resolve } from 'path';

import { rollup } from 'rollup';

const typescript = require('rollup-plugin-typescript2');
const nodeResolve = require('rollup-plugin-node-resolve');

const NAME = 'my-class';

const rollupConfig = {
  inputOptions: {
    treeshake: true,
    input: `${NAME}.ts`,
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        check: false,
        cacheRoot: join(resolve(), 'node_modules/.tmp/.rts2_cache'), 
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
    file: `dist/${NAME}.js`,
    name: NAME, 
    format: 'es'
  }
}

async function rollupBuild({ inputOptions, outputOptions }) {
  return rollup(inputOptions).then(bundle => bundle.write(outputOptions));
}

rollupBuild(rollupConfig);
