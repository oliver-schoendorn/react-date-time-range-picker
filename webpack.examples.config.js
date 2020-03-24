const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const BaseConfig = require('./webpack.config')

const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'server',
    analyzerHost: 'localhost',
    analyzerPort: 8091,
    reportFilename: 'stats.html',
    statsFilename: 'build.json',
    generateStatsFile: false,
    openAnalyzer: false
})


module.exports = Object.assign(BaseConfig, {
    devServer: {
        host: 'localhost',
        port: '8090',
        hot: true,
        historyApiFallback: true,
        contentBase: path.join(__dirname, '/examples'),
        stats: {
            warnings: false
        }
    },
    entry: [ 'react-hot-loader/patch', path.join(__dirname, '/examples/index.tsx') ],
    devtool: 'eval-source-map',
    mode: 'development',
    plugins: [
        ...BaseConfig.plugins,
        bundleAnalyzerPlugin
    ],
    output: { filename: 'index.js' }
})
