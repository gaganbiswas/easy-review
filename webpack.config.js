const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/public/main.js", // Entry point for your JavaScript
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bundle.js", // Output file for JavaScript
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Match all CSS files
        use: [
          MiniCssExtractPlugin.loader, // Extract CSS into separate files
          "css-loader", // Resolves CSS imports
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css", // Name of the output CSS file
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/index.html", // Source HTML
      inject: "body", // Inject scripts at the end of the body
    }),
    new HtmlWebpackPlugin({
      template: "./src/public/404.html",
      filename: "404.html",
      inject: false,
    }),
  ],
  mode: "production", // Use "development" for debugging, "production" for optimized builds
};
