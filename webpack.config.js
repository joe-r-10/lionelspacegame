const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/game/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true
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
                            ['@babel/preset-env', {
                                targets: "defaults",
                                useBuiltIns: "usage",
                                corejs: 3
                            }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp3|wav)$/i,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            phaser: path.join(__dirname, 'node_modules/phaser/dist/phaser.min.js')
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            inject: 'body'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'assets', to: 'assets' }
            ]
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 3002,
        hot: true,
        open: true,
        historyApiFallback: true
    },
    devtool: 'source-map',
    optimization: {
        minimize: false
    }
}; 