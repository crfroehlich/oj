gulp = require 'gulp'
stripBom = require 'gulp-stripbom'

###
 Bump the version in bower and package json
###
gulp.task 'stripBom', ->
  gulp.src ['./**/*.coffee', './**/*.html', './**/*.js', './**/*.json'], base: './'
    .pipe stripBom()
    .pipe gulp.dest './'