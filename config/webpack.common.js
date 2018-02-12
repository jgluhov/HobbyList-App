const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/main',

    resolve: {
        extensions: ['.js', '.png', '.scss', '.html'],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-stage-3',
                        ],
                        plugins: [
                            '@babel/transform-runtime',
                        ],
                    },
                },
            },
            {
                test: /\.png$/,
                exclude: /node_modules/,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/',
                    },
                  },
                ],
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader',
                    }, {
                        loader: 'sass-loader',
                    }],
                    fallback: 'style-loader',
                }),
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(['docs'], {
            root: path.resolve(__dirname, '..'),
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            favicon: path.resolve(
                __dirname, '..', 'src', 'assets', 'favicon.png'
            ),
            minify: {
                collapseWhitespace: true,
            },
        }),
        new ExtractTextPlugin('css/bundle.css'),
    ],
};
