gulp = require 'gulp'
gutil = require 'gulp-util'
content = require '../util/files'
qunit = require 'gulp-qunit'

gulp.task 'test', ->
  gulp.src './test/test.html'
    .pipe qunit()