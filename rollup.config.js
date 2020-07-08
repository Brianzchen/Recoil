import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';

const modes = ['development', 'production'];

const config = modes.map(mode => ({
  input: 'src/Recoil_index.js',
  output: [
    {
      file: `esm/recoil.${mode}.js`,
      format: 'es',
      exports: 'named',
    },
    {
      file: `dist/recoil.${mode}.js`,
      format: 'cjs',
      exports: 'named',
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    babel({
      presets: [
        '@babel/preset-react',
        '@babel/preset-flow',
        [
          '@babel/preset-env',
          {
            targets: {browsers: ['last 2 versions', 'safari >= 7']},
          },
        ],
      ],
      plugins: [
        'babel-preset-fbjs/plugins/dev-expression',
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/transform-flow-strip-types',
      ],
      babelHelpers: 'bundled',
    }),
    {
      resolveId: source => {
        if (source === 'React') {
          return {id: 'react', external: true};
        }
        if (source === 'ReactDOM') {
          return {id: 'react-dom', external: true};
        }
        return null;
      },
    },
    nodeResolve(),
    commonjs(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(mode),
    }),
    mode === 'development' ? undefined : terser({mangle: false}),
  ],
}));

export default config;
