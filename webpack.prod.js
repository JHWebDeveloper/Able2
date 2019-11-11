const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: './src/renderer/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: './'
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
      },
      {
        test: /\.(json|png|mov|ico|icns)$/,
        use: [{
          loader: 'file-loader',
          options: {
            emitFile: false
          }
        }]
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: 'src/renderer/index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/main.min.css',
    }),
    new CopyWebpackPlugin([
      { from: 'src/renderer/images', to: 'assets/images' },
      { from: 'src/renderer/font', to: 'assets/font' },
      { from: 'src/main/backgrounds', to: 'assets/backgrounds'},
      { from: 'src/main/icons', to: 'assets/icons'}
    ])
  ],
  node: {
    __dirname: false
  }
}