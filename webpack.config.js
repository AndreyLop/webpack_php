// Bundle used for PHP + WebPack
// To use for static HTML Delete whole BrowserSyncPlugin plugin and whole devServer option

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const autoprefixer = require('autoprefixer');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const apacheServerAddress = 'http://127.0.0.7:80';

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: "./src/js/app.js",
    output: {
        publicPath: apacheServerAddress,
        path: __dirname + "/dist",
        filename: "js/app.js"
    },
    optimization: {
        minimizer: [
          new UglifyJsPlugin({
            cache: true,
            parallel: true,
            sourceMap: true // set to true if you want JS source maps
          }),
          new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
              map: {
                inline: false
              }
            }
          })
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename:"css/styles.css"
        }),
        new BrowserSyncPlugin({
            proxy: 'http://localhost:8080',
            files: [
                {
                    match: [
                        '**/*.php'
                    ],
                    fn: function(event, file) {
                        if (event === "change") {
                            const bs = require('browser-sync').get('bs-webpack-plugin');
                            bs.reload();
                        }
                    }
                }
            ]
        }, {
            reload: false
        })
    ],
    devServer: {
        proxy: {
            '/': {
                target: apacheServerAddress,
                changeOrigin: true,
                secure: false
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules|bower_components)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    {
                        loader: 'css-loader', 
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers:['ie >= 8', 'last 4 version']
                                })
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                  
                ],
            }
        ]
    }
}