gulp = require 'gulp'
less = require 'gulp-less' 
minifyCss = require 'gulp-minify-css' 
concat = require 'gulp-concat'
rename = require 'gulp-rename'

header = require '../util/header'
handleErrors = require '../util/handleErrors'
logger = require '../util/bundleLogger'
notify = require '../util/notify'
content = require '../util/files'
files = content.files

###
Compile LESS
###
gulp.task 'less', ->
  #1: copy variables files to destination folder first
  gulp.src ['./src/less/variables.less', './src/less/mixins.less']
    .pipe gulp.dest './dist'
  
  #2: compile all files in place (for Dev/Test pages)
  gulp.src files.less, base: './'
    .pipe less sourceMap: true
    .pipe gulp.dest('./')
  
  #3: compile distribution files
  gulp.src files.less 
    .pipe concat 'DocData.less'
    .pipe header.extended()
    .pipe gulp.dest './dist'
    .pipe less sourceMap: true
    .pipe header.succinct()
    .pipe gulp.dest './dist'
    .pipe rename suffix: '.min'
    .pipe minifyCss processImport: false
    .pipe gulp.dest './dist'
    .pipe notify.message 'LESS to CSS conversion complete'
    .on 'error', handleErrors
    .on 'end', logger.end

