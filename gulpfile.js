var gulp = require('gulp'),
    clean = require('gulp-clean'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    config = require('./config'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    flatten = require('gulp-flatten');

/* Clean task*/
gulp.task('clean', function() {
  return gulp.src('public/', { read: false })
    .pipe(clean());
});

/* Minify CSS */
gulp.task('css', function() {
  return gulp.src('app/app.styl')
    .pipe(stylus({
      compress: true,
      use: [nib()]
    }))
    .pipe(minifyCss())
    .pipe(rename({
      basename: 'app.min',
      extname: '.css'
    }))
    .pipe(gulp.dest('public/assets/css'))
    .pipe(browserSync.reload({ stream: true }));
});

/* Minify JS*/
gulp.task('appScripts', function() {
  return gulp.src('app/**/*.js')
    .pipe(concat('app.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('public/js/'))
    .pipe(browserSync.reload({ stream: true }));
});

/* Minify libs JS*/
gulp.task('scriptsLibs', function() {
  return gulp.src(config.libs)
    .pipe(concat('libs.min.js'))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('public/js/'))
});

/* Minify libs CSS */
gulp.task('libsStyle', function() {
  return gulp.src(config.styles)
    .pipe(concat('libs.min.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/assets/css/'))
});

/* Build fonts */
gulp.task('fonts', function() {
  return gulp.src(config.fonts)
    .pipe(gulp.dest('public/assets/fonts'))
});


/* Start webserver*/
gulp.task('server', ['nodemon'], function() {
  browserSync.init(null, {
    proxy: "http://localhost:3000",
    port: 5000,
  });
});

/* Nodemon file watch */
gulp.task('nodemon', function(cb) {

  var started = false;

  return nodemon({
    script: './app.js',
    ignore: 'public/'
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    if (!started) {
      cb();
      started = true;
    }
  });
});


/* Watch files */
gulp.task('watch', function() {
  // watch html files
  // gulp.watch(['./app/index.html', './app/components/**/**/*.html', './app/shared/**/*.html'], ['views']);
  // watch stylus files
  gulp.watch(['./app/assets/**/*.styl', './app/**/**/*.styl'], ['css']);
  // watch js files
  gulp.watch(['./app/**/**/*.js', './app/*.js'], ['appScripts']);
});

/* Build task */
gulp.task('build', ['appScripts', 'scriptsLibs', 'config', 'css', 'libsStyle', 'fonts']);

/* Defaul task - run app */
gulp.task('default', ['clean'], function() {
  gulp.start(['appScripts', 'scriptsLibs', 'css', 'libsStyle', 'fonts', 'server', 'watch']);
});
