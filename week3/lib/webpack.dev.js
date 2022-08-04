'use strict';

const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const merge = require('webpack-merge');

const common = require('./webpack.common.js');


/**
 * @description          开发环境配置
 * @returns {{cache: boolean, devtool: string, plugins: *[]}}        出参配置
 */


module.exports = function (options) {
    let commonconfig = common(options)
    return merge(commonconfig, {
        // source maps
        devtool: 'inline-source-map',

        // 打包css, 热更新
        plugins: [
            new ExtractTextPlugin("[name].css"),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ],
        output: {filename: '[name].js'},
        //todo 暂时没用
        devServer: {
            contentBase: commonconfig.output.path,
            hot: true // HMR
        }
    })
}
