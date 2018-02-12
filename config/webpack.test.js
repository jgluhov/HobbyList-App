const webpackMerge = require('webpack-merge');
const webpackCommon = require('./webpack.common');

module.exports = webpackMerge(webpackCommon, {
    devtool: 'inline-source-map',
});
