const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const BaseConfig = require('./webpack.config')

const bundleAnalyzerPlugin = new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    reportFilename: 'stats.html',
    statsFilename: 'build.json',
    generateStatsFile: true,
    statsOptions: {
        env: true,
        errors: true,
        errorDetails: true,
        hash: true,
        performance: true,
        publicPath: true,
        timings: true,
        version: true,
        warnings: true,
        assets: false,
        cached: false,
        cachedAssets: false,
        children: false,
        chunks: false,
        chunkGroups: false,
        chunkModules: false,
        chunkOrigins: false,
        colors: false,
        depth: false,
        entrypoints: false,
        modules: true,
        moduleTrace: false,
        providedExports: true,
        reasons: false,
        source: false,
        usedExports: true,
    },
    openAnalyzer: false
})

module.exports = Object.assign(BaseConfig, {
    entry: {
        'date-time-range-picker.production.min': path.join(__dirname, '/src/index.ts'),
    },
    devtool: 'source-map',
    mode: 'production',
    target: 'web',
    externals: [ 'react' ],
    // plugins: [
    //     ...BaseConfig.plugins,
    //     bundleAnalyzerPlugin
    // ],
    output: {
        libraryTarget: 'commonjs2'
    }
})
