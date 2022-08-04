'use strict';

const util = require('./util');
const webpack = require('webpack');

const merge = require('webpack-merge');


module.exports = function (options) {

    const config = options.env == 'prod' ?
        require('./webpack.prod.js')(options) :
        require('./webpack.dev.js')(options);

    //entry Object
    const entryFile = util.getEntryFile('**/app.js', {cwd: options.context});

    return merge(config, {
        entry: entryFile,
        plugins: [
            ...util.HtmlWebpackPlugin("**/**.html", {cwd: options.context, outputPage: options.outputPage}),
            new webpack.DllReferencePlugin({
                context: '.',
                manifest: `${options.outputStatic}/common/manifest${options.vendorVersion}.json`,
            })
        ]
    })
};
