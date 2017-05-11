var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// @todo: manifest json
module.exports = {
    entry: {
        main: './src/main.js',
        vendor: ['vue', 'vue-router', 'vuex']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader'
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                use: ExtractTextPlugin.extract({
                    use: 'css-loader'
                })
            }
        ]
    },
    resolve: {
        // 设置vue直接使用整体文件，省去了打包vue的过程
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devtool: '#eval-source-map',
    devServer: {
        // inline和hot这两个参数，只写在这里会报错 [HMR] Hot Module Replacement is disabled.
        // 是因为没有加 new webpack.HotModuleReplacementPlugin()这个plugin
        // 写在了package.json的scripts里 "dev": "webpack-dev-server --inline --hot"
        // inline: true,
        // hot: true,
        // 所有请求都用Index.html响应
        historyApiFallback: true,
        // 不显示编译信息，只显示错误
        noInfo: true
    },
    plugins: [
        // 抽离css到单独的文件
        new ExtractTextPlugin('style.css'),

        // 抽离公共代码，名称可以指定到一个入口文件的名称，也可以单独指定
        new webpack.optimize.CommonsChunkPlugin({
            names: 'vendor',
            minChunks: function (module) {
                // 只提取处于node_modules中的依赖
                return module.context && module.context.indexOf('node_modules') !== -1;
            }
        }),

        // 再次抽取公共代码，from vendor and main bundles，即webpack的runtime code
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        })
    ]
};

if(process.env.NODE_ENV === 'production') {
    module.exports.output.filename = '[name].[chunkhash:8].js';
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        // 用于定义的插件，为会经过打包的文件中引用到process.env.NODE_ENV 的地方，替换成"production"
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),

        // 压缩JS
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        // 不知道干啥的
        new webpack.optimize.OccurrenceOrderPlugin()
    ]);
}