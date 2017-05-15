// Include gulp
const gulp = require('gulp');

// Include gulp plugins
const eslint = require('gulp-eslint');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const gutil = require('gulp-util');
const nodemon = require('gulp-nodemon');
const imagemin = require('gulp-imagemin');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const bower = require('gulp-bower');
const mocha = require('gulp-mocha');
const istanbul = require('gulp-istanbul');
const browserSync = require('browser-sync');
const dotenv = require('dotenv');


if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  dotenv.config();
}
// Lint task
gulp.task('lint', () => gulp.src(['public/js/**/*.js', 'test/**/*.js', 'app/**/*.js', '!node_modules/**'])
  .pipe(eslint())
  .pipe(eslint.format())
);

gulp.task('images', () => {
  gulp.src('app/images/**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('static-files', () => {
  return gulp.src([
      '!app/**/*.+(less|css|js|jade)',
      '!app/images/**/*',
      'app/**/*.*'
    ])
    .pipe(gulp.dest('public/'));
});


gulp.task('browserify', () => {
  return browserify('./app/js/app.js').bundle()
    .on('success', gutil.log.bind(gutil, 'Browserify Rebundled'))
    .on('error', gutil.log.bind(gutil, 'Browserify ' +
      'Error: in browserify gulp task'))
    // vinyl-source-stream makes the bundle compatible with gulp
    .pipe(source('application.js')) // Desired filename
    // Output the file
    .pipe(gulp.dest('./public/js/'));
});

// Sass task - convert scss to css
gulp.task('sass', () => gulp.src('app/styles/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('public/css')));


gulp.task('pug', () => {
  gulp.src(['app/views/**/*.pug'])
    .pipe(pug({
      verbose: true
    }))
    .pipe(gulp.dest('./public/'));
});

// Nodemon task
gulp.task('startnodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: {
      NODE_ENV: 'development'
    }
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
gulp.task('test', ['pre-test'], () => gulp.src(['./test/backend/**/*.js'], {
    read: false
  })
  .pipe(mocha({
    reporter: 'spec'
  }))
  .pipe(istanbul.writeReports())
  .pipe(istanbul.enforceThresholds({
    thresholds: {
      global: 90
    }
  }))
);

// Watch Task and reload browser
gulp.task('watch', () => {
  gulp.watch(['app/**/*.js', 'public/js/**/*.js'], ['lint'])
    .on('change', browserSync.reload);
  gulp.watch(['app/views/**/*.pug', 'public/css/*.css'], ['pug'])
    .on('change', browserSync.reload);
  gulp.watch('public/views/*.html')
    .on('change', browserSync.reload);
});

// Server Task
gulp.task('server', ['startnodemon'], () => {
  browserSync.create({
    server: 'server.js',
    port: 3001,
    reloadOnRestart: true
  });
});

// Default task(s).
gulp.task('default', ['bower', 'sass', 'pug', 'images', 'static-files', 'browserify', 'watch', 'lint', 'startnodemon']);
