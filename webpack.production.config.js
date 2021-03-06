const path = require('path')
const BaseConfig = require('./webpack.bundle.config')


module.exports = Object.assign(BaseConfig, {
    entry: {
        'date-time-range-picker.min': path.join(__dirname, '/dist/esm/index.js'),
    },
    devtool: 'source-map',
    mode: 'production',
    target: 'web',
    externals: [ 'react' ],
    output: {
        path: path.join(__dirname, '/dist/cjs'),
        libraryTarget: 'commonjs2'
    }
})
