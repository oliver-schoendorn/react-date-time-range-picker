const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false
                    }
                }],
            },
            {
                test: /\.map$/,
                use: [ 'source-map-loader' ],
                enforce: 'pre'
            },
            {
                test: /\.(scss|sass|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { importLoaders: 3, sourceMap: true }
                    },
                    'postcss-loader',
                    {
                        loader: 'resolve-url-loader',
                        options: { sourceMap: true }
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true }
                    }
                ]
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'date-time-range-picker.min.css' })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }
}
