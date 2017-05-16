
// Include gulp
const gulp = require('gulp');

// Include gulp plugins
const eslint = require('gulp-eslint');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const browserSync = require('browser-sync');
const dotenv = require('dotenv');
const html2pug = require('gulp-html2pug');


if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  dotenv.config();
}
// Lint task
gulp.task('lint', () => gulp.src(['public/js/**/*.js', 'test/**/*.js', 'app/**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
);

// Sass task - convert scss to css
gulp.task('sass', () => gulp.src('public/css/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('public/css')));
gulp.task('sass:watch', () => {
  gulp.watch('public/css/*.scss', ['sass']);
});

// Html2pug task
gulp.task('pug', function () {
  return gulp.src('app.html')
  .pipe(html2pug())
  .pipe(gulp.dest('pug'));
});

// Nodemon task
gulp.task('startnodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { NODE_ENV: 'development' }
  });
});

// Run install command for bower
gulp.task('bower', () => bower());

gulp.task('pre-test', () => {
  return gulp.src(['app/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

// Mocha test task
gulp.task('test', ['pre-test'], () => gulp.src(['./test/backend/**/*.js'], { read: false })
  .pipe(mocha({ reporter: 'spec' }))
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }))
);

// Watch Task and reload browser
gulp.task('watch', () => {
  gulp.watch(['app/**/*.js', 'public/js/**/*.js'], ['lint'])
    .on('change', browserSync.reload);
  gulp.watch(['app/views/**/*.pug', 'public/css/*.css'])
    .on('change', browserSync.reload);
  gulp.watch('public/views/*.html')
    .on('change', browserSync.reload);
});

// Server Task
gulp.task('server', ['startnodemon'], () => {
  browserSync.create({
    server: 'server.js',
    port: 3000,
    reloadOnRestart: true
  });
});

// Default task(s).
gulp.task('default', ['startnodemon', 'bower', 'sass', 'watch', 'lint']);



