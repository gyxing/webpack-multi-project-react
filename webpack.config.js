const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

const templateConfig = require('./public/template/config');

// 是否是开发模式
const isDev = process.env.NODE_ENV === 'development';
// 打包文件夹名
const product_name = 'dist';

module.exports = function (env) {
    const project_root_name = 'project';    // 子项目根目录名
    const project_name = env.project;   // 子项目名

    console.log('-----------------');
    console.log('node_env：', process.env.NODE_ENV);
    console.log('project_name', project_name);
    console.log('-----------------');

    if (project_name && project_name !== true) {
        // 初始化项目
        // 根目录
        const project_root_dir = path.resolve(__dirname, `./${project_root_name}`);
        if (!fs.existsSync(project_root_dir)) {
            // 不存在就创建
            fs.mkdirSync(project_root_dir)
        }
        // 子项目目录
        const project_dir = `${project_root_dir}/${project_name}`;
        if (!fs.existsSync(project_dir)) {
            //不存在就创建
            fs.mkdirSync(project_dir);
            // 创建src目录
            fs.mkdirSync(`${project_dir}/src`);
            // 子项目的配置文件
            fs.appendFileSync(`${project_dir}/config.js`, templateConfig.addConfigJS(product_name, project_name));
            // 入口文件
            fs.appendFileSync(`${project_dir}/src/main.js`, templateConfig.addMainJS());
        }

        // 子项目配置项
        const getConfig = require(`./${project_root_name}/${project_name}/config.js`);
        const project_config = getConfig();

        // 开发环境配置
        const devOptions = isDev ? {
            devServer: {
                publicPath: '/',
                host: 'localhost',
                port: 7001,
                compress: true,
                open: true,
                hot: true,
                proxy: project_config.proxy ? project_config.proxy : {}
            },
            watch: true,    // 自动编译
            watchOptions: {
                aggregateTimeout: 300,
                ignored: /node_modules/
            }
        } : {};

        const plugins = [];
        if (!isDev) {
            // 删除旧文件
            plugins.push(
                new CleanWebpackPlugin([project_name], {
                    root: path.resolve(__dirname, `./${product_name}`),
                    verbose: true,
                    dry: false
                })
            )
        } else {
            // webpack热加载
            plugins.push(new webpack.HotModuleReplacementPlugin())
        }

        return {
            entry: project_config.entry,
            output: {
                path: project_config.product_dir,
                filename: `js/[name].[${isDev?'hash':'chunkhash'}].js`,
                publicPath: project_config.product_public_path || ''
            },
            ...devOptions,
            plugins: [
                // js压缩
                new UglifyJsWebpackPlugin(),
                // html模版
                new HtmlWebpackPlugin({
                    minify: {
                        removeAttributeQuotes: true
                    },
                    hash: true,
                    template: project_config.template || path.resolve(__dirname, './public/template/index.html'),
                    title: project_config.index_title || '',
                    filename: project_config.product_html_dir + '/' + (project_config.html_name || 'index.html')
                }),
                // 将运行代码直接插入html文件中
                new InlineManifestWebpackPlugin('runtime'),
                // css打包, webpack4使用mini-css-extract-plugin替代extract-text-webpack-plugin
                new MiniCssExtractPlugin({
                    filename: 'css/[name].[contenthash:8].css',
                    publicPath: project_config.product_dir
                }),
                // css分离打包压缩
                new OptimizeCss({
                    assetNameRegExp: /\.style\.css$/g,
                    cssProcessor: require('cssnano'),
                    cssProcessorOptions: {discardComments: {removeAll: true}},
                    canPrint: true
                }),
                ...plugins
            ],
            resolve: {
                extensions: ['.js', '.jsx', '.less'],
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@PUBLIC': path.resolve(__dirname, './public')
                }
            },
            optimization: {
                // OptimizeCss处理css分离打包压缩
                minimizer: [new OptimizeCss({})],
                // 优化持久化缓存
                runtimeChunk: 'single',
                // 自动把公共代码和第三方依赖代码拆分打包
                splitChunks: {
                    cacheGroups: {
                        vendors: {
                            test: /[\\/]node_modules[\\/]/,
                            name: 'vendors',
                            minSize: 30000,
                            minChunks: 1,
                            chunks: 'initial',
                            priority: 1 // 该配置项是设置处理的优先级，数值越大越优先处理
                        },
                        commons: {
                            test: /[\\/]src[\\/]common[\\/]/,
                            name: 'commons',
                            minSize: 30000,
                            minChunks: 3,
                            chunks: 'initial',
                            priority: -1,
                            reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                        }
                    }
                }
            },
            module: {
                rules: [
                    {
                        test: /\.css/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'postcss-loader'
                        ]
                    }, {
                        test: /\.less/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            'postcss-loader',
                            'less-loader'
                        ]
                    }, {
                        test: /\.(png|jpg|gif|jpeg|bmp|eot|ttf|woff|svg)/,
                        use: [
                            {
                                loader: 'url-loader',
                                options: {
                                    limit: 10000,
                                    publicPath: '../',
                                    name: `img/[name].[hash:8].[ext]`
                                }
                            }
                        ]
                    }, {
                        test: /\.(htm|html)$/i,
                        use: ['html-withimg-loader']
                    }, {
                        test: /\.js|jsx$/,
                        exclude: /(node_modules)/,
                        use: [{loader: "babel-loader"}]
                    }
                ]
            }
        }
    }
};
