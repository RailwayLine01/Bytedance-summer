'use strict';

const webpack = require('webpack');

let config = require('./lib/config');

const dllConfig = require('./lib/webpack.config.dll');

const async = require('async');

const ph = require('path');

const cache = foxtrel.cache;

const flConfig = foxtrel.config;

/**
 * @description 第三方模块是否为最新
 * @returns {boolean}
 */
function hasNewstVendor(config, options) {
    let path = config.output.path,
        filename = config.output.filename.replace(/\[name\]/, 'vendor'),
        filePath = ph.join(path, filename);
    //是否存在
    if (foxtrel.util.exists(filePath)) {
        let pathInfo = foxtrel.util.pathInfo(filePath);
        let version = pathInfo.filename.match(/@\d+\.?\d+$/);
        //是否为最新
        if (Array.isArray(version) && version[0] == options.vendorVersion) {
            return false;
        }
    }
    return true;
}

/**
 * @description 编译前,生成配置数据
 * @param config
 */

function compilerConfig(config) {
    foxtrel.util.merge(config, foxtrel.config.get('webpack'));
    foxtrel.config.set('webpack', config);
}


module.exports = function (callback) {

    const options = {
        env: flConfig.get('env'),
        root: foxtrel.project.getProjectRoot(),
        output: cache.getCachePath(),
        outputStatic: cache.getCachePath('static'),
        outputPage: cache.getCachePath('page'),
        vendorVersion: flConfig.get('vendorVersion') || '@1.0',
        vendor: flConfig.get('vendor') || [],
        context: foxtrel.project.getProjectRoot('app/views'),
        publicPath: '/assets/'
    }

    //第三方配置
    let outputPath = foxtrel.config.get('webpack.output.path');
    const _dllConfig = dllConfig(options);
    if (outputPath) {
        _dllConfig.output.path = outputPath;
    }

    //配置信息
    let webpackConfig = config(options);
    compilerConfig(webpackConfig);


    let handler = [];
    //第三方模块编译
    if (hasNewstVendor(_dllConfig, options)) {
        handler.push(function (cb) {
            webpack(_dllConfig).run(function (error, stats) {
                if (error || stats.hasErrors()) {
                    foxtrel.log.error('compilation fails');
                }
                cb();
            })
        })
    }

    async.waterfall(handler, function () {
        callback(webpack(foxtrel.config.get('webpack')));
    })

}



