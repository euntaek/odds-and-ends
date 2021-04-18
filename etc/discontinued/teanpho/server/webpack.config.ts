/* eslint-disable  */
import * as webpack from 'webpack';
import * as path from 'path';
import nodeExternals from 'webpack-node-externals';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const mode = (process.env.NODE_ENV as 'production') || 'development';

const config: webpack.Configuration = {
  mode,
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: { node: 'current' }, modules: false }],
              '@babel/preset-typescript',
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        mode: 'write-references',
      },
      eslint: { files: './src/**/*.ts' },
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js', '.json'],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  externals: [nodeExternals()],
  devtool: 'source-map',
};

export default config;
