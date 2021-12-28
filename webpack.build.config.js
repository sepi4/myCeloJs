const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabiliPlugin = require('babili-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                        },
                    },
                ],
            },
            {
                test: /\.jsx?$/,
                use: [{ loader: 'babel-loader', query: { compact: false } }],
            },
            {
                test: /\.(jpe?g|png|gif|mp3)$/,
                use: [
                    {
                        loader: 'file-loader?name=img/[name]__[hash:base64:5].[ext]',
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader?name=font/[name]__[hash:base64:5].[ext]',
                    },
                ],
            },
            {
                test: /\.(tsx?|jsx?)$/,
                exclude: /(node_modules|\.webpack)/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                        configFile: 'tsconfig.prod.json',
                    },
                },
            },
        ],
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({ title: 'React Electron App' }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'bundle.css',
            chunkFilename: '[id].css',
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new BabiliPlugin(),
    ],
    stats: {
        colors: true,
        children: false,
        chunks: false,
        modules: false,
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
}
