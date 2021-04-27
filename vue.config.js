const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css']

module.exports = {
    productionSourceMap: false, // 关闭生产环境的 source map
    lintOnSave: false,
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch');
        // 移除 preload 插件，避免加载多余的资源
        config.plugins.delete('preload');
        // 按需加载lodash
        if (process.env.NODE_ENV === "production") {
            config.plugin("loadshReplace").use(new LodashModuleReplacementPlugin());
        }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 生产环境
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]', // 提示 compression-webpack-plugin@3.0.0的话asset改为filename
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            );
        }
    },
}
