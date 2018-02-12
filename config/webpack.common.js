const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/main',

    resolve: {
        extensions: ['.ts', '.js', '.png', '.scss', '.html'],
        alias: {
            '@Utils': path.resolve(__dirname, '..', 'src', 'utils'),
            '@Models': path.resolve(__dirname, '..', 'src', 'models'),
            '@Components': path.resolve(__dirname, '..', 'src', 'components'),
            '@Styles': path.resolve(__dirname, '..', 'src', 'styles'),
            '@Assets': path.resolve(__dirname, '..', 'src', 'assets')
        },
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-stage-3',
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            'transform-custom-element-classes',
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
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],                    
                    fallback: 'style-loader'
                }),
                include: [
                    path.resolve(__dirname, '..', 'src/styles')
                ]
            },
            {
                test: /\.scss$/,
                use: [{
                    loader: 'css-loader'
                }, {
                    loader: 'sass-loader'
                }], 
                exclude: [
                    path.resolve(__dirname, '..', 'src/styles')
                ]
            },
            {
                test: /\.html$/,
                use: 'raw-loader'
            }
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
