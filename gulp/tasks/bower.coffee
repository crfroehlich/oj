gulp = require 'gulp'
gutil = require 'gulp-util'


# Concat Bower
gulp.task 'bower', ->
  
  bowerFiles()
    .pipe gulpIf /[.]js$/, concat 'bower.js'
    .pipe gulpIf /[.]js$/, gulp.dest paths.release
    #.pipe rename suffix: '.min'
    #.pipe uglify()
    #.pipe gulp.dest paths.release
    #.pipe notify message: 'Bower compilation complete.'
    .on 'error', gutil.log