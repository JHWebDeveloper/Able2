const path = require('path')
const nodeExternals = require('webpack-node-externals')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const mainPath = path.join(__dirname, 'src', 'main')
const rendererPath = path.join(__dirname, 'src', 'renderer')

const mainConfig = {
  entry: {
    main: mainPath,
    preload: path.join(mainPath, 'preload', 'preload.js'),
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  target: 'electron-main',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(mainPath, 'backgrounds'),
        to: path.join('assets', 'backgrounds')
      },
      {
        from: path.join(mainPath, 'icons'),
        to: path.join('assets', 'icons')
      }
    ])
  ],
  node: {
    __dirname: false
  }
}

const rendererConfig = {
  mode: 'production',
  entry: {
    index: rendererPath,
    preferences: path.join(rendererPath, 'preferences.js'),
    help: path.join(rendererPath, 'help.js'),
    global: path.join(rendererPath, 'css', 'global.css')
  },
  output: {
    path: path.join(__dirname, 'build', 'renderer'),
    filename: '[name].bundle.js',
    publicPath: '/'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                postcssPresetEnv({ stage: 0 }),
                cssnano()
              ]
            }
          }
        ]
      },
      {
        test: /\.(svg|woff2)$/,
        use: ['url-loader']
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: path.join('assets', 'css', '[name].min.css')
    }),
    new HTMLWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: path.join(rendererPath, 'index.html')
    }),
    new HTMLWebpackPlugin({
      inject: false,
      filename: 'preferences.html',
      template: path.join(rendererPath, 'preferences.html')
    }),
    new HTMLWebpackPlugin({
      inject: false,
      filename: 'help.html',
      template: path.join(rendererPath, 'help.html')
    })
  ],
  node: {
    __dirname: false
  }
}

module.exports = [
  mainConfig,
  rendererConfig
]
