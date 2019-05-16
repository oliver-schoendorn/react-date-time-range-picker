const path = require('path')
const BaseConfig = require('./webpack.config')

module.exports = Object.assign(BaseConfig, {
    entry: {
        'date-time-range-picker': path.join(__dirname, '/dist/esm/index.js'),
    },
    devtool: 'source-map',
    mode: 'development',
    target: 'web',
    externals: [ 'react' ],
    output: {
        path: path.join(__dirname, '/dist/cjs'),
        libraryTarget: 'commonjs2'
    }
})
