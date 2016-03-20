var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var isDeveloping = process.env.NODE_ENV !== 'production';
var config = require('./webpack.config.js');
var port = isDeveloping ? 3000 : process.env.PORT;
var app = express();

app.use(express.static(__dirname + '/demo'));

if (isDeveloping) {
    var compiler = webpack(config);

    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: config.contentBase,
        filename: config.output.filename,

        hot: true,
        historyApiFallback: false,

        quiet: false,
        noInfo: false,

        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },

        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }));

    app.use(webpackHotMiddleware(compiler));
}

app.get('*', function response(req, res) {res.sendFile(path.join(__dirname, 'demo/index.html'));});
app.listen(port, 'localhost', function onStart(err) {console.info(port);});
