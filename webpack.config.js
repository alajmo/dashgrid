"use strict";

var webpack = require("webpack")
var path = require("path");

module.exports = {
    devtool: "eval-source-map",
    contentBase: "demo",

    entry: [
        "webpack-hot-middleware/client?reload=true",
        path.join(__dirname, "demo/js/main.js")
    ],
    output: {
        path: path.join(__dirname, "/demo"),
        filename: "main.js",
        publicPath: "/"
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        })
    ],

    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel"
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },

    node: {
        fs: "empty"
    }
};
