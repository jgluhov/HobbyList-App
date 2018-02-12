const path = require('path');
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpackCommon = require('./webpack.common');

module.exports = webpackMerge(webpackCommon, {
    devtool: 'inline-source-map'
});