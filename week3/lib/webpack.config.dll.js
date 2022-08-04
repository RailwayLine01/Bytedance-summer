const path = require('path')
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');


module.exports = function (options) {
    const outputPath = `${options.outputStatic}/common/manifest${options.vendorVersion}.json`;
    return {
        entry: {
            vendor: options.vendor,
        }
        ,
        output: {
            filename: `common/[name]${options.vendorVersion}.js`,
            path: options.outputStatic,
            library: `[name]`,
        }
        ,
        plugins: [
            new webpack.DllPlugin({
                context: '.',
                path: outputPath,
                name: `[name]`,
            }),
            new CleanWebpackPlugin([path.join(options.outputStatic, 'common')], {
                    root: options.root,                        //根目录
                    verbose: true,        　　　　　　　         //开启在控制台输出信息
                    dry: false,        　　　　　　　　　　        //启用删除文件
                }
            )
        ],
    }
}
