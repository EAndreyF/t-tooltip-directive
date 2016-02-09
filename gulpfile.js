var gulp = require('gulp');
var bower = require('bower');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var inject = require('gulp-inject');
var bowerLib = require('bower-files')();
var angularFilesort = require('gulp-angular-filesort');
var slim = require('gulp-slim');
var del = require('del');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var path = require('path');
var es = require('event-stream');

path._joinArrayToArray = function (arr, arr2) {
  var res = [];
  if (!arr.length) {
    return arr2;
  }
  if (!arr2.length) {
    return arr;
  }
  arr.forEach(function (el) {
    arr2.forEach(function (el2) {
      res.push(path.join(el, el2));
    });
  });
  return res;
};

path.joinArray = function () {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function (last, cur) {
    cur = Array.isArray(cur) ? cur : [cur];
    last = path._joinArrayToArray(last, cur);
    return last;
  }, []);
};

var src = './frontend';
var dest = './.dist';

var paths = {
  css: ['./app.styl'],
  js: ['./**/*.js'],
  templates: ['./**/*.slim'], // need to installed slim
  vendors: ['./vendors/*'],
  img: ['./**/*.{png,jpg,gif,svg}'],
  fonts: ['./fonts/*']
};

var swallowError = function (error) {
  console.log('error', error);
  this.emit('end');
};

gulp.task('default', ['serve', 'watch']);

// Clean dest folder
gulp.task('clean', function () {
  return del([path.join(dest, '**/*')]);
});

// Compile all template files
gulp.task('slim template compile', function () {
  return gulp.src(path.joinArray(src, paths.templates))
    .pipe(slim({
      pretty: true,
      options: "attr_list_delims={'(' => ')', '[' => ']'}"
    }))
    .on('error', swallowError)
    .pipe(gulp.dest(path.join(dest, 'html')));
});

gulp.task('create template cache', ['slim template compile'], function () {
  return gulp.src(path.join(dest, 'html/**/*.html'))
    .pipe(templateCache('templates.js', {standalone: true}))
    .pipe(gulp.dest(path.join(dest, 'js')));
});

// Compile all css files
gulp.task('css compile', function () {
  return gulp.src(path.joinArray(src, paths.css))
    .pipe(stylus())
    .pipe(gulp.dest(path.join(dest, 'css')))
    .on('error', swallowError);
});

// Insert all css files
gulp.task('inject files', ['css compile', 'create template cache'], function () {
  var s1 = gulp.src(path.joinArray(dest, 'js', paths.js)) // gulp-angular-filesort depends on file contents, so don't use {read: false} here
    .pipe(angularFilesort())
    .on('error', swallowError);

  var s2 = gulp.src(bowerLib.ext(['js', 'css', 'eot', 'woff', 'ttf', 'svg']).files)
    .pipe(gulp.dest(path.join(dest, 'bower')));

  var s3 = gulp.src(path.joinArray(src, paths.vendors))
    .pipe(gulp.dest(path.join(dest, 'vendors')));

  // change this rule, for production version include min.css
  return gulp.src(path.join(dest, 'html/index.html'))
    //.pipe(gulp.dest(dest))
    .pipe(inject(
      gulp.src([path.join(dest, 'css', '**/*.css')], {read: false}),
      {
        relative: true,
        name: 'css'
      }))
    .pipe(inject(
      es.merge(s1),
      {
        relative: true,
        name: 'angular'
      }))
    .pipe(inject(
      es.merge(s2),
      {
        relative: true,
        name: 'bower'
      }))
    .pipe(inject(
      es.merge(s3),
      {
        relative: true,
        name: 'vendors'
      }))
    .pipe(gulp.dest(dest));
});

// copy img files
gulp.task('copy img', function () {
  return gulp.src(path.joinArray(src, paths.img))
    .pipe(gulp.dest(dest));
});

// copy fonts files
gulp.task('copy fonts', function () {
  return gulp.src(path.joinArray(src, paths.fonts))
    .pipe(gulp.dest(path.join(dest, 'fonts')))
});

// copy js files
gulp.task('copy js', function () {
  return gulp.src(path.joinArray(src, paths.js))
    .pipe(gulp.dest(path.join(dest, 'js')))
});

gulp.task('build', ['copy img', 'copy fonts', 'copy js', 'inject files']);

// local server
gulp.task('serve', ['build', 'watch'], function () {
  connect.server({
    root: '.dist',
    port: 8003,
    livereload: false
  });

  console.log('Server listening on http://localhost:8003');
});

gulp.task('watch', ['build'], function () {
  var w = path.joinArray(src, '**/*');
  w.push('./bower.json');
  watch(w, ['build']);
});
