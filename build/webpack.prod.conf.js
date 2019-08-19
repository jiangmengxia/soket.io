const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const merge = require('webpack-merge')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(require('./webpack.base.conf'), {
    mode: 'production',
    entry: {
        app: path.join(__dirname, '../app/client/main.js'),
    },
    output: {
        filename: '[name].[chunkhash:8].js',
        publicPath: "./"
    },
    // module: {
    //     rules: [
    //         {
    //             test: /\.vue$/,
    //             loader: 'vue-loader',
    //             options: {
    //                 loaders: {
    //                     css: ExtractTextPlugin.extract({
    //                         use: 'css-loader',
    //                         fallback: 'vue-style-loader' // 这是vue-loader的依赖
    //                     })
    //                 }
    //             }
    //         }
    //     ]
    // },
    plugins: [
        new VueLoaderPlugin(),
        // new ExtractTextPlugin(),
        new htmlWebpackPlugin({
            filename: './index.html',
            template: './index.html',
            title: '首页',
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:8].css'
        }),
        new OptimizeCSSAssetsPlugin({
            // 默认是全部的CSS都压缩，该字段可以指定某些要处理的文件
            assetNameRegExp: /\.(sa|sc|c)ss$/g,
            // 指定一个优化css的处理器，默认cssnano
            // cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {removeAll: true}, //对注释的处理
                    normalizeUnicode: false // 建议false,否则在使用unicode-range的时候会产生乱码
                }]
            },
            canPrint: true  // 是否打印编译过程中的日志
        }),
        // new UglifyJsPlugin({
        //     cache: true, // Boolean/String,字符串即是缓存文件存放的路径
        //     parallel: true, // 启用多线程并行运行提高编译速度
        //     sourceMap: true,
        //     uglifyOptions: {
        //         output: {
        //             comments: false  // 删掉所有注释
        //         },
        //         compress: {
        //             // warning: false, // 插件在进行删除一些无用的代码时不提示警告
        //             drop_console: true // 过滤console,即使写了console,线上也不显示
        //         }
        //     }
        // }),
        // new PurifyCssPlugin({
        //     paths: glob.sync(path.join(__dirname, '../src/*.html')),
        // })
    ],
    optimization: {
        minimize: true,//默认的js压缩
        minimizer: [
            // new UglifyJsPlugin({}),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {//块分割
            // minSize: 30000,
            // minChunks: 1,
            cacheGroups: {
                commons: {//js
                    name: "vender",
                    chunks: "initial",
                    minChunks: 1,
                },
                // styles: {
                //     name: 'css/commoncss/',
                //     test: /\.css$/,
                //     chunks: 'all',
                //     enforce: true,
                //     minChunks: 1,
                // }
            }
        }
    }
})
