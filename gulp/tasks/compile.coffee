gulp = require 'gulp'

gulp.task 'compile-src', [ 'browserify', 'inject' ]

gulp.task 'compile', [
  'cson'
  'less'
  #'img'
  'compile-src'
]

gulp.task 'build', [
  'compile'
  'test'
  'watch'
]

gulp.task 'default', ['build']
