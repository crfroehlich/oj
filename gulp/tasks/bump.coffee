gulp = require 'gulp'
gutil = require 'gulp-util'
bump = require 'gulp-bump'

###
 Bump the version in bower and package json
###
gulp.task 'bumpVersion', ->
  gulp.src [
    './package.json'
    './bower.json'
  ]
  .pipe bump()
  .pipe gulp.dest './'
  return
  
gulp.task 'bump', [
  'bumpVersion'
  'compile' 
]  