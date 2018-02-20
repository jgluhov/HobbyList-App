const path = require('path');
const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = webpackMerge(webpackCommon, {
    devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, '..', 'docs'),
        filename: 'js/bundle.[hash].js',
    },

    plugins: [
        new UglifyJsPlugin()
    ]
});
