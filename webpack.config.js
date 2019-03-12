module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/main.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },
    module: {
        rules: [
            //...
            /* No longer needed as rotjs is now installed as a dependency
            {
                test: /rot\.min\.js$/,
                loader: "exports?ROT"
            },
            */
            {
                test: /\.([jt]s|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "awesome-typescript-loader"
                }
            },
            { enforce: "pre", test: /\.[jt]s$/, loader: "source-map-loader" }
        ]
    },
    externals: {
        "rot-js": "Rot"
    }
};
