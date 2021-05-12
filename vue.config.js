const CompressionWebpackPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {HashedModuleIdsPlugin} = require('webpack');

// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css', 'html']

// 设置应用模式
process.env.NODE_ENV = 'development'; // 开发模式
// process.env.NODE_ENV = 'production'; // 生产模式

module.exports = {
    productionSourceMap: false, // 关闭生产环境的 source map
    lintOnSave: false,
    publicPath: process.env.VUE_APP_PUBLIC_PATH,
    transpileDependencies: ['luch-request'],

    chainWebpack: config => {
        // 移除 prefetch 插件
        config.plugins.delete('prefetch');
        // 移除 preload 插件，避免加载多余的资源
        config.plugins.delete('preload');
        // 配置 打包分析
        config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
    },

    configureWebpack: config => {
        // 生产环境
        if (process.env.NODE_ENV === 'production') {
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
        }

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

        // 只打包改变的文件
        config.plugins.push(
            new HashedModuleIdsPlugin()
        );

        // 公共代码抽离
        config.optimization = {
            splitChunks: { // 分割代码块
                cacheGroups: {
                    swiper: { // swiper
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]swiper[\\/]/,
                        name: 'swiper',
                        minChunks: 1,//在分割之前，这个代码块最小应该被引用的次数
                        maxInitialRequests: 10,
                        minSize: 0,//大于0个字节
                        priority: 110//权重
                    },
                    video: { // video.js
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]video.js[\\/]/,
                        name: 'video',
                        minChunks: 1,//在分割之前，这个代码块最小应该被引用的次数
                        maxInitialRequests: 10,
                        minSize: 0,//大于0个字节
                        priority: 100//权重
                    },
                    vendor: { // 其他第三方库抽离
                        chunks: 'all',
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        minChunks: 1,//在分割之前，这个代码块最小应该被引用的次数
                        maxInitialRequests: 10,
                        minSize: 0,//大于0个字节
                        priority: 90//权重
                    },
                    common: {  // 公用模块抽离
                        chunks: 'all',
                        test: /[\\/]src[\\/](.*)[\\.]js/,
                        name: 'common',
                        minChunks: 1, // 在分割之前，这个代码块最小应该被引用的次数
                        maxInitialRequests: 10,
                        minSize: 0,//大于0个字节
                        priority: 80
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
            maxEntrypointSize: 1024 * 1024,
            //生成文件的最大体积
            maxAssetSize: 1024 * 1024,
            //只给出 js 文件的性能提示
            assetFilter: function (assetFilename) {
                return assetFilename.endsWith('.js');
            }
        };

    },

    devServer: {
        host: 'localhost',
        port: 8099,
        proxy: {
            '/api': {
                target: process.env.NODE_ENV === 'production' ? 'http://interest.ezhigame.com' : 'https://interest.test.ezhigame.com', // 代理的目标地址
                changeOrigin: true, // 是否设置同源
                ws: true,
                pathRewrite: {
                    '^/api': '/api',
                }
            },
        }
    },
}
