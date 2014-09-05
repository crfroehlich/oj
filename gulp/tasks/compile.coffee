gulp = require 'gulp'

gulp.task 'compile', [
  'coffee'
  'inject'
]

gulp.task 'build', [
  'compile'
  'watch'
]

gulp.task 'default', ['build']
