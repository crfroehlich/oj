gulp = require 'gulp'
gutil = require 'gulp-util'

# Publish to npm
gulp.task 'npm', (done) ->
  require 'child_process' 
    .spawn 'npm', ['publish'], stdio: 'inherit'
    .on 'close', done
    .on 'error', gutil.log
  return