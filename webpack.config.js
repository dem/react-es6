var path = require('path'),
  webpack = require("webpack");


const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'build')
};

function fromRootDir(matchPath) {
  return new RegExp(process.cwd() + matchPath);
}


module.exports = {
  cache: true,
  debug: true,
  devtool: 'eval-source-map',
  entry: [  'babel-polyfill','./src/app.jsx'],
  output: {
    path: PATHS.build,
    filename: 'build.min.js'
  },
  module: {
    loaders: [{
      // test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, "src"),
      ],
      test: /\.(js|jsx|es6)$/,
      exclude: /(node_modules|bower_components)/,
      // loader: 'babel-loader?cacheDirectory&optional=es7.decorators&stage=0',
      query: {
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0', 'react'],
      }
    }, , {
      test: /\.json?$/,
      loader: 'json-loader'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('"production"')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin()
  ]
};
