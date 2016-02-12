var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require("path");

var dist = __dirname + "/dist";
var src = __dirname + "/src";

module.exports = {
  entry: {
      'dashgrid': path.resolve(__dirname, src + "/dashgrid.js"),
      'dashgrid.min': path.resolve(__dirname, src + "/dashgrid.js")
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "dist",
    filename: "[name].js",
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
        include: /\.min\.js$/,
        minimize: true,
        compress: {warnings: true},
        output: {comments: true}
    }),
    new ExtractTextPlugin("dashgrid.css"),
  ]
};
