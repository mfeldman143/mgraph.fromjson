import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
  // ES Module build
  {
    input: 'index.js',
    output: {
      file: 'dist/mgraph.fromjson.esm.js',
      format: 'es'
    },
    plugins: [nodeResolve()],
    external: ['mgraph.graph']
  },
  // UMD build
  {
    input: 'index.js',
    output: [
      {
        file: 'dist/mgraph.fromjson.umd.js',
        format: 'umd',
        name: 'mgraphFromJSON',
        exports: 'default'
      },
      {
        file: 'dist/mgraph.fromjson.umd.min.js',
        format: 'umd',
        name: 'mgraphFromJSON',
        exports: 'default',
        plugins: [terser()]
      }
    ],
    plugins: [nodeResolve()]
  }
];