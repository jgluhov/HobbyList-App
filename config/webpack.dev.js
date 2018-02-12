const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.common');

module.exports = webpackMerge(webpackCommon, {
    devtool: 'inline-source-map',

    output: {
        path: path.resolve(__dirname, '..', 'docs'),
        filename: 'js/bundle.js',
    },

    devServer: {
        contentBase: path.resolve(__dirname, '..', 'docs'),
        port: 3000,
        historyApiFallback: true,
        stats: 'minimal',
    },
});
