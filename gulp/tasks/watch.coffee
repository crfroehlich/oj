gulp = require 'gulp'
gutil = require 'gulp-util'
content = require '../util/files'

 
# Init watch
gulp.task 'watch', ->
  
  gulp.watch ['./src/**/*.coffee', './src/**/*.less'], [
    'compile'
  ]
  gulp.watch ['./test/**/*.coffee'], [
    'compile'
  ]
  

gulp.task 'watch-src', ['compile-src'], ->
  
  gulp.watch ['./src/**/*.coffee', './src/**/*.less'], [
    'compile-src'
  ]
  gulp.watch ['./test/**/*.coffee'], [
    'compile-src'
  ]
  