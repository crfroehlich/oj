gulp = require 'gulp'
#imagemin = require 'gulp-imagemin'

handleErrors = require '../util/handleErrors'
logger = require '../util/bundleLogger'
notify = require '../util/notify'
content = require '../util/files'
files = content.files

###
Compile images
### 
gulp.task 'img', ->
#  gulp.src files.make 'img',
#    .pipe changed './dist/images'
#    .pipe imagemin optimizationLevel: 5
#    .pipe gulp.dest './dist/images'
#    .on 'error', gutil.log

