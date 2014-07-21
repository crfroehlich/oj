gulp = require 'gulp'
coffeelint = require 'gulp-coffeelint'
content = require '../util/files'
files = content.files

gulp.task 'coffeeLint', ->
  gulp.src files.coffee
    .pipe coffeelint()
    .pipe coffeelint.reporter()