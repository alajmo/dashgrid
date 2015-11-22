var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

var dist = __dirname + "/dist";
var src = __dirname + "/src";

module.exports = {
  entry: [
    path.resolve(__dirname, src + "/dashgrid.js")
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
    filename: "dashgrid.js",
    libraryTarget: "commonjs",
    library: "dashGridGlobal"
  },
  module: {
      loaders: [
          {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
          {test: /\.js$/, loader: "babel-loader" }
      ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false},
        output: {comments: false}
    }),
    new ExtractTextPlugin("dashgrid.css"),
  ]
};
