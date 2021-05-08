const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {HashedModuleIdsPlugin} = require('webpack');

// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css', 'html']

module.exports = {
    productionSourceMap: false, // 关闭生产环境的 source map
    lintOnSave: false,
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
    transpileDependencies: ["vconsole"],
    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch');
        // 移除 preload 插件，避免加载多余的资源
        config.plugins.delete('preload');
        // 配置 打包分析
        config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {  // 生产环境

            // 对资源文件进行压缩
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]', // 提示 compression-webpack-plugin@3.0.0的话asset改为filename
                    algorithm: 'gzip',
                    test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                    threshold: 10240,
                    minRatio: 0.8
                })
            );

            // 去除console.log打印以及注释
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false, // 去掉注释
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log']//移除console
                        }
                    }
                })
            );
            // 只打包改变的文件
            config.plugins.push(
                new HashedModuleIdsPlugin()
            );

            // 公共代码抽离
            config.optimization = {
                splitChunks: { // 分割代码块
                    cacheGroups: {
                        vendor: {//第三方库抽离
                            chunks: 'all',
                            test: /node_modules/,
                            name: 'vendor',
                            minChunks: 1,//在分割之前，这个代码块最小应该被引用的次数
                            maxInitialRequests: 5,
                            minSize: 0,//大于0个字节
                            priority: 100//权重
                        },
                        common: {  //公用模块抽离
                            chunks: 'all',
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: 'common',
                            minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数
                            maxInitialRequests: 5,
                            minSize: 0,//大于0个字节
                            priority: 60
                        },
                        styles: { //样式抽离
                            name: 'styles',
                            test: /\.(sa|sc|c)ss$/,
                            chunks: 'all',
                            enforce: true
                        },
                        runtimeChunk: {
                            name: 'manifest'
                        }
                    }
                }
            };

            // 取消webpack警告的性能提示
            config.performance = {
                hints: 'warning',
                //入口起点的最大体积
                maxEntrypointSize: 1000 * 500,
                //生成文件的最大体积
                maxAssetSize: 1000 * 1000,
                //只给出 js 文件的性能提示
                assetFilter: function (assetFilename) {
                    return assetFilename.endsWith('.js');
                }
            };
        }

    },
    devServer: {
        host: 'localhost',
        port: 8081,
        proxy: {
            '/api': {
                target: process.env.NODE_ENV === 'production' ? 'http://interest.ezhigame.com' : 'http://interest.test.ezhigame.com', // 代理的目标地址
                changeOrigin: true, // 是否设置同源
                pathRewrite: {
                    '^/api': '',
                }
            },
            '/mall': {
                target: 'http://gamecenter.ezhigame.com', // 代理的目标地址
                changeOrigin: true, // 是否设置同源
                pathRewrite: {
                    '^/mall': '',
                }
            }
        }
    },
}
