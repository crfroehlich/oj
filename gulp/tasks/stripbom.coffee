gulp = require 'gulp'
stripBom = require 'gulp-stripbom'

###
 Bump the version in bower and package json
###
gulp.task 'stripBom', ->
  gulp.src ['./src/**/*.coffee', './src/**/*.html', './src/**/*.js', './src/**/*.json'], base: './'
    .pipe stripBom()
    .pipe gulp.dest './'