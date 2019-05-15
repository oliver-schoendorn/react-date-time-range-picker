module.exports = (context) => ({
    syntax: false,
    parser: false,
    map: true,
    plugins: context.env === 'development' ? {} : {
        'postcss-preset-env': {
            "browsers": [
                "> 1%",
                "ie 10"
            ]
        },
        'postcss-flexbugs-fixes': {},
        'cssnano': context.options.cssnano || {}
    }
})
