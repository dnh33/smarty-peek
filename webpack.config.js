//@ts-check

"use strict";

const path = require("path");

/**@type {import('webpack').Configuration}*/
const config = {
  target: "node", // VS Code extensions kører i et Node.js-lignende miljø
  mode: "none", // 'production' eller 'development' styres via scripts i package.json

  entry: "./src/extension.ts", // Indgangspunktet for din extension
  output: {
    // Bundlen outputtes til 'dist' mappen
    path: path.resolve(__dirname, "dist"),
    filename: "extension.js",
    libraryTarget: "commonjs2",
    devtoolModuleFilenameTemplate: "../[resource-path]",
  },
  devtool: "source-map", // Generer source maps
  externals: {
    vscode: "commonjs vscode", // vscode modulet er provided af VS Code runtime og skal ikke bundles
  },
  resolve: {
    // Tillad import af .ts og .js filer uden filendelse
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader", // Brug ts-loader til at håndtere TypeScript filer
          },
        ],
      },
    ],
  },
};
module.exports = config;
