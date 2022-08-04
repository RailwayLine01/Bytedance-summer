'use strict';

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const LocalNodeMoudles = path.join(require.resolve('foxtrel'), '../', 'node_modules');

/**
 * @description 入口文件读取
 * @param path
 * @param options
 * @returns {{}}
 */
module.exports.getEntryFile = function (path, options) {
    let files = glob.sync(path, options),
        entries = {};
    files.forEach(function (file) {
        let ext = foxtrel.util.pathInfo(file).ext,
            pathName = file.replace("." + ext, ''),
            filePath = "";
        if (options.cwd) {
            filePath = file;
        }
        entries[pathName] = filePath;
    })
    return entries;
}


module.exports.HtmlWebpackPlugin = function (ph, options) {
    if (!options.cwd) return;
    let hwplugins = [], files = glob.sync(ph, options);
    files.forEach(function (file) {
        hwplugins.push(
            new HtmlWebpackPlugin({
                filename: path.join(options.outputPage, file),
                template: path.join(options.cwd, file),
                inject: 'head',
                chunks: [file.replace(/index\.html/, 'app')]
            })
        )
    });

    return hwplugins;
}


module.exports.babelParse = function (config) {
    //自动添加前缀

    function map(options, prefix) {
        return options.map(function (item) {
            if (typeof item == 'string') {
                return path.join(LocalNodeMoudles, `${prefix}-${item}`);
            } else if (foxtrel.util.isArray(item)) {
                return map(item, prefix)
            } else {
                return item;
            }
        })
    }

    let babelOptions = config.use.options;

    if (babelOptions) {
        babelOptions.presets = map(babelOptions.presets, 'babel-preset');
        babelOptions.plugins = map(babelOptions.plugins, 'babel-plugin');
    }

    return config;
}

/**
 * @description 添加公共静态资源
 * @param option
 */
module.exports.insertCommonStaticPlugin = function (options) {
    this.publicPath = options.publicPath;
    this.vendorVersion = options.vendorVersion;
};

module.exports.insertCommonStaticPlugin.prototype.apply = function (compiler) {
    let self = this;
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginData, callback) {
            let Html = htmlPluginData.html;
            htmlPluginData.html = Html.replace(/(\<head\>)/, '$1<script src="' + self.publicPath + 'common/vendor' + self.vendorVersion + '.js"></script>');
            callback();
        })
    })
}
