This post is a guide to setup a boiler plate project which will be capable of using React Js through ES6 and experimental ES7 syntax (which by the way makes ES5 look like watergun  vs AK47). React 0.14 supports the ES6 syntaxes which allows to use the class system in JS.

All this thanks to a little something library called Babel, and enter the cool, it will make your project capable of doing all sorts of ES6 badassery. Lets dig into the steps and start some serious coding.

We are going to use gulp and webpack to ease our package and task management and webpack-dev-server for local dev server.
<h3>Step 1:</h3>
Install the following packages:
<pre><code>#Babel loaders and preset
npm install babel-core --save-dev
npm install babel-loader --save-dev
npm install babel-plugin-transform-runtime --save-dev
npm install babel-preset-es2015 --save-dev
npm install babel-preset-react --save-dev
npm install babel-preset-stage-0 --save-dev
npm install json-loader --save-dev
npm install babel-polyfill --save-dev
npm install babel-runtime --save-dev
#gulp tasks and utils
npm install gulp --save-dev
npm install gulp-concat --save-dev
npm install gulp-less --save-dev
npm install gulp-sourcemaps --save-dev
npm install gulp-uglify --save-dev
npm install gulp-util --save-dev
#webpack
npm install webpack --save-dev
npm install webpack-dev-server --save-dev
npm install webpack-stream --save-dev
</code></pre>
<h3>Step 2:</h3>
Lets setup the webpack config to include the babel loaders and presets:
<pre><code>
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
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, "src"),
      ],
      test: /\.(js|jsx|es6)$/,
      exclude: /(node_modules|bower_components)/,
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
</code></pre>
<h3>Step 3:</h3>
Setup the Gulpfile to define webpack and gulp tasks
To understand the gulp/webpack configuration in detail read <a href="http://ninjatechtips.com/2015/10/28/setting-up-your-local-dev-environment-with-gulp-and-webpack/">this</a>:
<pre><code>
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require("gulp-util");
var webpack = require("webpack");
var less = require('gulp-less');
var path_node = require('path');
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var stream = require('webpack-stream');

var path = {
  HTML: 'src/index.html',
  ALL: ['src/**/*.jsx', 'src/**/*.js', 'styles/**/*/*.css', 'styles/**/*/*.less'],
  MINIFIED_OUT: 'build.min.js',
  CSS: ['./styles/**/*/*.css', './styles/**/*/*.less'],
  DEST_SRC: 'dist/src',
  DEST_BUILD: 'dist/build',
  DEST: 'dist'
};

gulp.task('webpack', [], function() {
  return gulp.src(path.ALL)
    .pipe(sourcemaps.init())
    .pipe(stream(webpackConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task("webpack-dev-server", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  // Start a webpack-dev-server
  var compiler = webpack(myConfig);
  new WebpackDevServer(webpack(myConfig), {
    publicPath: "/" + myConfig.output.publicPath,
    stats: {
      colors: true
    }
  }).listen(4000, "localhost", function(err) {
    if (err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:4000/webpack-dev-server/index.html");
  });
});
gulp.task('watch', function() {
  gulp.watch(path.ALL, ['webpack']);
});
gulp.task('default', ['webpack', 'webpack-dev-server', 'watch']);

</code></pre>
<h3>Step 4:</h3>
Adding some react code:

Create app.jsx
<pre><code>
import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header';

ReactDOM.render(&lt; Header &gt;, document.getElementById('root'));
</code></pre>
We are using the ES6 import statements here.

Now lets create a Header Component
<pre><code>
import React from 'react';

let {Component, PropTypes} = React;

export default class Header extends Component {
  static defaultProps = {
    items: []
  };
  static PropTypes = {
    items: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
        windowHeight: 0
    };
  }
  render() {
    return (
      &lt;span&gt;{'Hello'}&lt;/span&gt;
    );
  }
}

</code></pre>
We are using the ES6 class syntax to create a react component rather that creating through <code>React.createClass()</code>.
Also you can see the <code>getInitialProps</code> is now replaced by a static property <code> defaultProps </code> and so is <code> PropTypes </code>
And all the logic which typically went inside <code>componentDidMount()</code> can now reside in a neat <code>constructor</code>

<h3>Step 5:</h3>
To run the setup , in the command line fire

<code>gulp</code>

and then access http://localhost:4000
