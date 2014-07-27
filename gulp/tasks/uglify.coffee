gulp = require 'gulp'
uglify = require 'gulp-uglify'
rename = require 'gulp-rename'

header = require '../util/header'
handleErrors = require '../util/handleErrors'
logger = require '../util/bundleLogger'
notify = require '../util/notify'


    
### 
Compile and Minify Bundle to JS
###
gulp.task 'uglify', ->
  logger.start()

  #2: compile dist files
  gulp.src './dist/OJ.js'
    .pipe header.extended()
    .pipe gulp.dest './dist'
    .pipe rename suffix: '.min'
    .pipe uglify outSourceMap: true
    .pipe header.succinct()
    .pipe gulp.dest './dist'
    .pipe notify.message 'Bundle to JS compilation complete.'
    .on 'error', handleErrors
    .on 'end', logger.end
  return