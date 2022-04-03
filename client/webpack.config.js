const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

let mode = 'development';
let target = 'web';

if (process.env.NODE_ENV === 'production') {
  mode = 'production';
  target = 'browserslist';
}

const plugins = [
    new HtmlWebpackPlugin({
        template: './src/index.html',
    }),
]

// if (process.env.SERVE) {
//     plugins.push(new ReactRefreshWebpackPlugin());
// }

module.exports = {
    mode,
    plugins,
    entry: './src/index.js',

    devtool: 'source-map',

    devServer: {
        historyApiFallback: true,
        allowedHosts: 'all',
        host: '0.0.0.0',
        hot: true,
        port: 80,
    },
  
    output: {
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]',
        clean: true,
    },

    module: {
        rules: [
        { test: /\.(html)$/, use: ['html-loader'] },
        {
            test: /\.css$/,
            use: [
                'style-loader',
                'css-loader',
            ],
        },
        {
            test: /\.(png|jpe?g|gif|svg|webp|ico)$/i,
            type: mode === 'production' ? 'asset' : 'asset/resource',
        },
        {
            test: /\.(woff2?|eot|ttf|otf)$/i,
            type: 'asset/resource',
        },
        {
            test: /\.jsx?$/, // обновляем регулярное выражение для поддержки jsx
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                cacheDirectory: true,
                },
            },
        },
      ],
    }
}