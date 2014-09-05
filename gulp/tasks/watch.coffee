gulp = require 'gulp'
gutil = require 'gulp-util'
content = require '../util/files'

# Init watch
gulp.task 'watch', ->
  
  #gulp.watch(files.js, ['inject']);
  gulp.watch content.files.coffee, [
    'compile'
  ]
  gulp.watch content.files.test, [
    'compile'
  ]
  gulp.watch content.files.css, [
    'compile'
  ]
  return