'use strict';

const ph = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

const LocalNodeMoudles = ph.join(require.resolve('foxtrel'), '../', 'node_modules');

const util = require('./util');


/**
 * @description babel 插件 处理
 */
let bableConfig = util.babelParse({
    test: /\.(js|jsx)$/,
    use: {
        loader: 'babel-loader',
        options: {
            "presets": [
                [
                    "es2015",
                    {"modules": false}
                ],
                "stage-0",
                "react"
            ],
            "plugins": [
                [
                    "import",
                    {libraryName: "antd-mobile", style: "css"}  // `style: true` 会加载 less 文件
                ]
            ],
            "babelrc": false,
        }
    }
})


/**
 * @description common 配置
 * @type {{context: string, output: {path: *, publicPath: string}, module: {rules: *[]}, resolve: {modules: string[], extensions: string[], mainFiles: string[]}, resolveLoader: {modules: *[]}}}
 */

module.exports = function (options) {
    return {
        context: options.context,
        output: {
            path: options.outputStatic,
            chunkFilename: '[name].js',
            publicPath: options.publicPath
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    loader: 'eslint-loader',
                    options: {
                        configFile: foxtrel.project.getProjectRoot('.eslintrc')
                    },
                    include: [options.context],
                    enforce: 'pre'
                },
                {
                    test: /\.less/,
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader?importLoaders=1&modules&localIdentName=[name]__[local]___[chunkhash:base64:5]!postcss-loader!less-loader'
                    })
                },
                {
                    test: /\.(png|jpg|gif|woff|woff2)$/,
                    use: 'url-loader?limit=8192'
                },
                {
                    test: /\.(mp4|ogg|svg)$/,
                    use: 'file-loader'
                },
                bableConfig
            ]
        },
        plugins: [
            new CleanWebpackPlugin([options.output], {
                    root: options.root,    //根目录
                    verbose: true,        　　　　　　　         //开启在控制台输出信息
                    dry: false,        　　　　　　　　　　        //启用删除文件
                    exclude: ph.join(options.outputStatic, 'common')
                }
            ),
            new util.insertCommonStaticPlugin({publicPath: options.publicPath, vendorVersion: options.vendorVersion})
        ],
        resolve: {
            modules: [options.context, "node_modules"],
            extensions: ['.js', '.jsx', '.json'],
            //为更好使用webpack tree shaking功能,先读取package中module字段
            mainFiles: ['module', 'main', 'index']
        },

        // 优先加载全局foxtrel包下的 loader
        resolveLoader: {
            modules: [
                LocalNodeMoudles,
                ph.join(options.context, "../node_modules")
            ]
        }
    }

}
