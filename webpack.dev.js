const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { spawn } = require('child_process')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'renderer'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                postcssPresetEnv({ stage: 0 }),
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
    new webpack.NamedModulesPlugin(),
    new MiniCssExtractPlugin({
      filename: path.join('assets', 'css', 'main.min.css'),
    }),
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: path.join('src', 'renderer', 'index.html')
    }),
    new CopyWebpackPlugin([
      // { from: 'src/renderer/font/', to: 'assets/font/'},
      // { from: 'src/renderer/images/', to: 'assets/images/'},
      {
        from: path.join('src', 'main', 'backgrounds'),
        to: path.join('assets', 'backgrounds')
      }
    ])
  ],
  watchOptions: {
    ignored: path.join('src', 'main', 'temp')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3000,
    hot: true,
    before() {
      spawn('electron', ['babelRegister.js'], {
        cwd: path.join('src', 'main'),
        shell: true,
        env: process.env,
        stdio: 'inherit'
      })
      .on('close', () => process.exit(0))
      .on('error', spawnError => console.error(spawnError))
    }
  }
}