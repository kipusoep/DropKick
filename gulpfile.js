var gulp = require('gulp-npm-run')(require('gulp'), {
      exclude: ['test'],
      require: ['doc']
    }),
    del = require('del'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    minimist = require('minimist'),
    deploy = require('gulp-gh-pages'),
    merge = require('merge-stream');

// Passing a version number
var knownOptions = {
  string: 'ver'
};
var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('default', ['sass', 'test', 'docs']);
gulp.task('docs', ['doc', 'docs-rename']);

// Lint Task
gulp.task('lint', function() {
  return gulp.src('./lib/dropkick.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('./lib/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('rename-release', function() {
  return gulp.src('/lib/dropkick.js')
    .pipe(rename('dropkick.' + options.ver + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('gh-pages', function () {
  return gulp.src('/dist')
    .pipe(deploy());
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('./lib/dropkick.js', ['scripts']);
  gulp.watch('./lib/css/*.scss', ['sass']);
});

gulp.task("docs-rename", function() {
  setTimeout(function() { //ugh
    return del(['./docs/index.html'], function (err, deletedFiles) {
      return gulp.src('./docs/classes/Dropkick.html')
          .pipe(rename('index.html'))
          .pipe(replace("../", ''))
          .pipe(gulp.dest('./docs/'));
    });
  }, 4000);
});

gulp.task('test', function() {
  //TODO: fix
  // return gulp.src(['./tests/src/runner.html', './tests/src/iframe.html'])
  return gulp.src(['./tests/src/runner.html'])
    .pipe(qunit());
});
