/*
    Webpack has significant advantages over other build systems:

      - faster build/compile times

      - faster watch times

      - built-in JavaScript module loading

      - Hot Module Reloading, which injects SCSS and JS 
        updates into the browser, making development
        much faster as browser refreshes are not needed
        as often

      - handles building SCSS and managing assets,
        allowing us to drop an extra tool + step (Gulp)

      - built in methods for caching, minification, optimization

      - is a future-oriented solution. Already heavily 
        used + recommened by JS community, Angular and Kendo
  
    /////////////////////////////////////////////////////////

    Build system implementation was a 2 step process, with
    several iterations. For more detail, see:

      1) Set up node, npm to build SCSS with Gulp
          https://trello.com/c/a4K0MS75/124-set-up-node-npm-scss-gulp

      2) Set up module loading, after evaluating several options: 
            Browserify
            Gulp + Webpack
            Webpack
            RequireJS
            Parcel

         https://trello.com/c/FqXCfLEO/135-module-loading-with-webpack
*/

const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');

// provide these in every JS file without having to import
const providePluginList = {
  $: 'jquery',
  jQuery: 'jquery',
  'window.jQuery': 'jquery',
}

module.exports = (env, argv) => ({

    entry: {

        // Use path.join (vs path.resolve) to normalize paths
        // bc diff OS's use diff dir name formats
        // bundle: path.join(__dirname, 'Web', 'src', 'js', 'app', 'index.js'),
        bundle: path.join(__dirname, 'src', 'main.js'),
    },

    output: {
        // filename: 'bundle.js',
        filename: '[name].js',

        // Destination for built/compiled files
        // path: path.join(__dirname),
        path: path.join(__dirname, 'dist'),

        /*
            webpack-dev-server doesn't write files 
            to disk when running for development.
            It's in memory, but makes paths to CSS
            + JS available to this URL path
            so content can be referenced in HTML.

            This is a URL path so no need for cross 
            compatibility (Win, Mac, Linux) via path.join
        */
        publicPath: '/dist/'
    },

    performance: {
        hints: false
    },

    stats: 'verbose',

    /*
    stats: {
        assets: true,
        colors: true,
        cached: true,
        cachedAssets: true,
        chunkOrigins: true,
        // context: "../src/",
        depth: true,
        env: true,
        entrypoints: false,
        errors: true,
        errorDetails: true,
        modules: true,
        // moduleTrace: true,
        // usedExports: false,
        // reasons: true,
        // providedExports: true,
        warnings: true
    },

    */


    /*
        Separate our application JS from vendor JS in node_modules 
        folder. App js goes into output.filename specified in this 
        json, usually bundle.js.

        Vendor JS will be written to vendors.bundle.js

        This is a significant sdevelopment peed boost.
        Build times and thus page refreshes go
        from 10+ seconds to a few hundred ms.

        Bc vendor JS code doesnt change, only our app.js does 
    */
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors.bundle",
                    chunks: "all"
                }
            }
        }
    },

    module: {
        rules: [
            // SCSS
            {
              test: /\.scss$/,
              use: 
                argv.mode === 'production' ? 
                    ExtractTextPlugin.extract({
                        publicPath: '',
                        fallback: 'style-loader?sourceMap',

                        // Note that loaders run last to first
                        // ie, sass -> postcss -> css
                        use: [
                          {
                            loader: 'css-loader',
                            options: {
                              minimize: true || {
                                discardComments: {
                                  removeAll: false
                                }
                              }
                            }
                          }, 

                          {
                            loader: 'postcss-loader',
                            options: {
                              ident: 'postcss',
                              plugins: (loader) => [
                                require('autoprefixer')(),
                                require('postcss-flexbugs-fixes')()
                              ]
                            }
                          },

                          {
                            loader: 'sass-loader'
                          }
                        ]
                    }) 

                    : 

                    [
                        {
                            loader: 'style-loader',
                            options: {
                                sourceMap: true
                            }
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
                                sourceMap: true,
                                ident: 'postcss',
                                plugins: (loader) => [
                                    require('autoprefixer')(),
                                    require('postcss-flexbugs-fixes')()
                              ]
                            }
                        },

                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
            }, 


            // JS
            {
              test: /\.js$/,
              exclude: /.*node_modules\/((?!bootstrap\/js\/src).)*$/,
              use: 
                argv.mode === 'production' ?
                      [
                        'babel-loader?presets=env'
                        // 'eslint-loader'
                      ] 
                      
                      : 

                      [
                        'babel-loader?presets=env',
                        'webpack-module-hot-accept'
                        // 'eslint-loader'
                      ]
            }

            /*
                @todo: enable once webpack-dev-server is wired to IIS

            // Images
            {
              test: /\.(png|svg|jpe?g|gif)$/,
              use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'images/',
                        publicPath: 'Web/dist/images/'
                    }
                  }
                ]
            },

            // Fonts
            {
              test: /\.(woff|woff2|eot|ttf|otf)$/,
              use: ['file-loader?name=fonts/[name].[ext]']
            }
            */
        ]


    },

    devServer: {

        // where the index.html file is, for the dev server to load
        contentBase: path.join(__dirname, 'src'),
        hot: true,
        overlay: {
          warnings: true,
          errors: true
        },
        port: 2222,
        inline: true,
        progress: true
    },

    devtool: 
        // more info: https://blog.scottlogic.com/2017/11/01/webpack-source-map-options-quick-guide.html
        argv.mode === 'production' ? 
            // @todo : disable for production. 
            'eval' 

            : 

            'eval',


    plugins: 
        argv.mode === 'production' ? 
            [
                new CleanWebpackPlugin(path.join(__dirname, 'dist')),
                
                new webpack.ProvidePlugin(providePluginList),

                new ExtractTextPlugin({

                    // full dir path causes stuck at 95% emitted error
                    // https://github.com/webpack/webpack/issues/2908
                    // filename: path.join(__dirname, 'Web', 'dist', 'app.dist.css')
                    filename: 'app.dist.css'
                    
                    }),

                new UglifyJSPlugin({
                    exclude: 'vendors',
                    uglifyOptions: {
                        parallel: true,
                        safari10: true
                    }
                })  ,

                new webpack.ProgressPlugin({ profile: false }),


            ] 

            : 

            // dev
            [
                // Leave commented so .NET backend server has files to reference
                // while using webpack-dev-server.
                // new CleanWebpackPlugin(path.join(__dirname, 'Web', 'dist')),
                new webpack.ProvidePlugin(providePluginList),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NamedModulesPlugin(),
                new webpack.ProgressPlugin({ profile: false }),



                // @todo: remove when webpack-dev-server is wired to IIS
                // 
                new WriteFileWebpackPlugin()
            ]
});
