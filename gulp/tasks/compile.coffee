gulp = require 'gulp'

gulp.task 'build', [
  'compile'
  'test'
  'watch'
]

gulp.task 'compile', [
  'cson'
  'compile-src'
]

gulp.task 'compile-src', [
  'browserify-dev'
  'inject-dev'
]

gulp.task 'compile-all', [
  'vendor'
  'cson'
  'browserify'
  'inject-all'
]

gulp.task 'default', ['build']