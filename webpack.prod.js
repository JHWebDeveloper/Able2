const path = require('path')
const nodeExternals = require('webpack-node-externals')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const mainConfig = {
  entry: {
    main: path.join(__dirname, 'src', 'main'),
    preload: path.join(__dirname, 'src', 'main', 'preload', 'preload.js')
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
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
        from: path.join('src', 'main', 'backgrounds'),
        to: path.join('assets', 'backgrounds')
      },
      {
        from: path.join('src', 'main', 'icons'),
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
    index: path.join(__dirname, 'src', 'renderer'),
    preferences: path.join(__dirname, 'src', 'renderer', 'preferences.js'),
    help: path.join(__dirname, 'src', 'renderer', 'help.js')
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
      filename: path.join('assets', 'css', '[name].min.css'),
    }),
    new HTMLWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: path.join('src', 'renderer', 'index.html')
    }),
    new HTMLWebpackPlugin({
      inject: false,
      filename: 'preferences.html',
      template: path.join('src', 'renderer', 'preferences.html')
    }),
    new HTMLWebpackPlugin({
      inject: false,
      filename: 'help.html',
      template: path.join('src', 'renderer', 'help.html')
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