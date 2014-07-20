gulp = require 'gulp'

gulp.task 'compile', [
  'browserify'
  'inject'
]

gulp.task 'build', [
  'compile'
  'watch'
]

gulp.task 'default', ['build']
