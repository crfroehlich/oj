gulp = require 'gulp'
gutil = require 'gulp-util'
gcson = require 'gulp-cson'

###
Compile CSON to JSON
###
gulp.task 'cson', ->
  gulp.src ['./{src,test}/**/*.cson','./config.cson']
    .pipe gcson()
    .pipe gulp.dest './'