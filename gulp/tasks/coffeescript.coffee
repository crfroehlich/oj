gulp = require 'gulp'
sourceMaps = require 'gulp-sourcemaps'
coffee = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
uglify = require 'gulp-uglify'
concat = require 'gulp-concat'
rename = require 'gulp-rename'

header = require '../util/header'
handleErrors = require '../util/handleErrors'
logger = require '../util/bundleLogger'
notify = require '../util/notify'
content = require '../util/files'


compileInPlace = (files) ->
  #1: compile all coffee files in-place to support debugging
  gulp.src files, base: './'
    .pipe sourceMaps.init()
    .pipe coffee map: true, m: true
    .pipe sourceMaps.write './'
    .pipe gulp.dest './'
    
### 
Compile and Minify CoffeeScript to JS
###
gulp.task 'coffee', ->
  logger.start()

  compileInPlace content.files.coffee
  compileInPlace './test/**/*.coffee'
  
  #2: compile dist files
  gulp.src content.files.coffee
    .pipe coffee map: true
    .pipe concat 'OJ.js'
    .pipe header.extended()
    .pipe gulp.dest content.paths.release
    .pipe rename suffix: '.min'
    .pipe uglify outSourceMap: true
    .pipe header.succint()
    .pipe gulp.dest content.paths.release
    .pipe notify.message 'CoffeeScript to JS compilation complete.'
    .on 'error', handleErrors
    .on 'end', logger.end
  return