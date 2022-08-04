'use strict';
const merge = require('webpack-merge');

const webpack = require('webpack');

const common = require('./webpack.common.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (options) {
    return merge(common(options), {
        devtool: 'source-map',
        plugins: [
            new ExtractTextPlugin("[name].[chunkhash].css"),

            //压缩
            new webpack.optimize.UglifyJsPlugin({
                compress: {warnings: false},
                sourceMap: true
            }),

            //全局变量
            new webpack.DefinePlugin({'process.env': {NODE_ENV: '"production"'}})
        ],
        output: {
            filename: '[name].[chunkhash].js'
        }
    })
}
