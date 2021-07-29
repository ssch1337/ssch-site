const path = require('path');

module.exports = {
    entry: './main.ts',
    target: "node",
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: [/node_modules/, /src/],
        }, ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'server-bundle.js',
        path: path.resolve(__dirname, '.'),
    },
    // externals: {
    //     fs: 'commonjs fs',
    //     https: 'commonjs https',
    //     path: 'commonjs path',
    //     express: 'commonjs express',
    //     helmet: 'commonjs helmet',
    //     morgan: 'commonjs morgan',
    // },
};