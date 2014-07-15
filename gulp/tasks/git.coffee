gulp = require 'gulp'
gutil = require 'gulp-util'
bump = require 'gulp-bump'
git = require 'gulp-git'

header = require '../util/header'
###
 Tag the repo with a version
###
gulp.task 'tag', ->
  v = 'v' + header.package.version
  message = 'Release ' + v
  git.add()
  git.commit message
  git.tag v, message
  git.push 'origin', 'master' #, '--tags'
  return