module.exports = {
    presets: [
        ['@vue/app', {
            'targets': {
                'browsers': [
                    'ie >= 9',
                    'safari >= 7',
                    "last 2 version",
                    "> 5%",
                    "not dead"]
            },
            useBuiltIns: 'entry',
            polyfills: [
                'es6.promise',
                'es6.symbol'
            ]
        }]
    ],
    plugins: [
        ['import', {
            libraryName: 'vant',
            libraryDirectory: 'es',
            style: true
        }, 'vant']
    ]
}
