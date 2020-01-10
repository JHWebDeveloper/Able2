const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { spawn } = require('child_process')

const rendererPath = path.join(__dirname, 'src', 'renderer')

module.exports = {
  mode: 'development',
  entry: {
    index: rendererPath,
    preferences: path.join(rendererPath, 'preferences.js'),
    help: path.join(rendererPath, 'help.js'),
    global: path.join(rendererPath, 'css', 'global.css')
  },
  output: {
    path: path.join(__dirname, 'build'),
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                postcssPresetEnv({ stage: 0 })
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
  watchOptions: {
    ignored: path.join('src', 'main', 'temp')
  },
  devServer: {
    port: 3000,
    hot: true,
    before() {
      spawn('electron', ['babelRegister.js'], {
        cwd: path.join('src', 'main'),
        shell: true,
        env: process.env,
        stdio: 'inherit'
      }).on('close', () => process.exit(0))
        .on('error', spawnError => console.error(spawnError))
    }
  }
}
