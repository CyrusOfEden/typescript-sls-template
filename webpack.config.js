/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path")
const fs = require("fs")
const slsw = require("serverless-webpack")
const nodeExternals = require("webpack-node-externals")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

const isLocal = slsw.lib.webpack.isLocal

const babelConfig = path.resolve(__dirname, ".babelrc.json")
const babelOptions = JSON.parse(fs.readFileSync(babelConfig).toString())

module.exports = {
  context: __dirname,
  devtool: isLocal ? "cheap-module-eval-source-map" : "source-map",
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
  mode: isLocal ? "development" : "production",
  module: {
    rules: [
      {
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".serverless"),
            path.resolve(__dirname, ".webpack"),
            path.resolve(__dirname, ".build"),
          ],
        ],
        test: /\.(ts|js)x?$/,
        use: [
          {
            loader: "cache-loader",
            options: {
              cacheDirectory: path.resolve(__dirname, ".webpack-cache"),
            },
          },
          "thread-loader",
          { loader: "babel-loader", options: babelOptions },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, ".webpack"),
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: true,
      eslintOptions: { cache: true },
      memoryLimit: 1024,
      measureCompilationTime: true,
      tsconfig: path.resolve(__dirname, "tsconfig.json"),
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src/"),
    },
    cacheWithContext: false,
    extensions: [".js", ".json", ".ts"],
    symlinks: false,
  },
  target: "node",
}
