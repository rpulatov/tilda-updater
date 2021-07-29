const gulp = require('gulp')
const eslint = require('gulp-eslint')
const clean = require('gulp-rimraf')

gulp.task('clean', function () {
  return gulp.src('./build/*', { read: false }).pipe(clean())
})

gulp.task('build', function () {
  // lint
  gulp.src('./src').pipe(eslint()).pipe(eslint.failAfterError())

  // code
  gulp.src('./src/**/*').pipe(gulp.dest('./build/src'))
  return gulp.src(['./package.json', 'ecosystem.config.js']).pipe(gulp.dest('./build'))
})

gulp.task('default', gulp.series(['clean', 'build']))
