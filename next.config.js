const path = require('path');
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const withTM = require("next-transpile-modules")([
  // `monaco-editor` isn't published to npm correctly: it includes both CSS
  // imports and non-Node friendly syntax, so it needs to be compiled.
  "monaco-editor"
]);

const withCSS = require("@zeit/next-css");


const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');
// Monaco Editor uses CSS imports internally,
// so we need a separate css-loader for app and monaco-editor packages

module.exports = withTM({
  // withCSS({
    webpack: config => {
      const rule = config.module.rules
        .find(rule => rule.oneOf)
        .oneOf.find(
          r =>
            // Find the global CSS loader
            r.issuer && r.issuer.include && r.issuer.include.includes("_app")
        );
      if (rule) {
        rule.issuer.include = [
          rule.issuer.include,
          // Allow `monaco-editor` to import global CSS:
          /[\\/]node_modules[\\/]monaco-editor[\\/]/
        ];
      }

      // Add a dedicated loader for CSS files in `monaco-editor` package:
      config.module.rules.push({
        test: /\.css$/,
        include: MONACO_DIR,
        use: ["style-loader", "css-loader"]
      // }, {
      //   test: /\.(js|ts|tsx|jsx)$/,
      //   exclude: /node_modules/,
      //   use: ['babel-loader'],
      },);
  
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: [
            "json",
            "markdown",
            "css",
            "typescript",
            "javascript",
            "html",
            "graphql",
            "python",
            "scss",
            "yaml"
          ],
          filename: "static/[name].worker.js"
        })
      );
      
        if (config.module.generator?.asset?.filename) {
          if (!config.module.generator['asset/resource']) {
            config.module.generator['asset/resource'] = config.module.generator.asset
          }
          delete config.module.generator.asset
        }        
      return config;
    }
  })
// );