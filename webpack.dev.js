const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    // Set the mode to development or production
    mode: 'development',

    // Control how source maps are generated
    devtool: 'inline-source-map',

    module: {
        rules: [
            // ... other rules
            {
                test: /\.[js]sx?$/,
                exclude: /node_modules/,
                use: [
                    // ... other loaders
                    {
                        loader: require.resolve('babel-loader'),
                    },
                ],
            },
        ],
    }
})