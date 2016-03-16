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
    // .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task("less", function() {
  var paths=path_node.join(__dirname, 'styles')
  return gulp.src(paths+'/index.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: [paths]
    }).on('error', gutil.log))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/build/css'));
});

gulp.task("webpack-dev-server", function(callback) {
  // modify some webpack config options
  var myConfig = Object.create(webpackConfig);
  myConfig.devtool = "eval";
  myConfig.debug = true;

  // myConfig.entry.unshift("webpack-dev-server/client?http://localhost:4000/");

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
  gulp.watch(path.ALL, ['webpack', 'less']);
});


gulp.task('default', ['webpack', 'less', 'webpack-dev-server', 'watch']);
