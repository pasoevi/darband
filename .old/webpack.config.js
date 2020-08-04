/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HTMLPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"],
            },
            /*  {
                test: /\.(png|jpe?g|gif|jp2|webp)$/,
                loader: "file-loader",
                options: {
                    name: "images/[name].[ext]",
                },
            }, */
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [new HTMLPlugin()],
    externals: {
        // don't bundle the 'react' npm package with our bundle.js
        // but get it from a global 'React' variable
        // 'rot-js': 'Rot'
    },
};
