var path = require('path');
var app = __dirname + '/app';

module.exports = {
  context: app,
  entry: [
    'webpack/hot/dev-server',
    './main.js'
  ],
  output: {
    path: app,
    filename: 'gridster.js'
  },
  module: {
      loaders: [
          { test: /\.css$/, loader: "style!css" },
          { test: /\.js$/, loader: 'babel-loader' }
      ]
  }
};
