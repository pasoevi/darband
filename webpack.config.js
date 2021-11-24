/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, '/src/index.ts'),
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
        alias: {
            assets: path.resolve(__dirname, 'assets'),
            '@assets': 'assets',
            src: path.resolve(__dirname, 'src'),
            lib: path.resolve(__dirname, 'lib'),
            ui: path.resolve(__dirname, 'ui'),
        }

    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Darband',
        }),
    ],
};
