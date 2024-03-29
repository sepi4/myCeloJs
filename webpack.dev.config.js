const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')

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
                            sourceMap: true,
                            modules: {
                                localIdentName:
                                    '[path][name]__[local]--[hash:base64:5]',
                            },
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
                    },
                },
            },
        ],
    },
    target: 'electron-renderer',
    plugins: [
        new HtmlWebpackPlugin({ title: 'React Electron App' }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
    ],
    // devtool: 'cheap-source-map',
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        stats: {
            colors: true,
            chunks: false,
            children: false,
        },
        before() {
            spawn('electron', ['.'], {
                shell: true,
                env: process.env,
                stdio: 'inherit',
            })
                .on('close', () => process.exit(0))
                .on('error', (spawnError) => console.error(spawnError))
        },
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
}
