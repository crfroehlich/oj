# browserify task
#   ---------------
#   Bundle javascripty things with browserify!
#
#   If the watch task is running, this uses watchify instead
#   of browserify for faster bundling using caching.
#
browserify = require 'browserify'
bundleLogger = require '../util/bundleLogger'
notify = require '../util/notify'
gulp = require 'gulp'
handleErrors = require '../util/handleErrors'
source = require 'vinyl-source-stream'
pkg = require '../../package.json'
concat = require 'gulp-concat'

runconcat = ->

  bundleLogger.start()

  libs = for module,path of pkg['browser']
    require.resolve('../.'+ path)
    
  gulp.src libs
    .pipe concat 'vendor.js'
    .pipe gulp.dest './dist'
    .pipe notify.message 'Vendor bundle complete.'
    .on 'error', handleErrors
    .on 'end', bundleLogger.end 

runbrowserify = ->
  
  bundler = browserify()

  bundler.transform()

  # exclude 'natural' deps incompatible with browser
  bundler.exclude 'WNdb'
  bundler.exclude 'lapack'
  
  for module,path of pkg['browser']
    bundler.require(require.resolve('../.'+ path))

  # Log when bundling starts
  bundleLogger.start()
    
  bundler
    # Enable source maps!
    .bundle()
    # Report compile errors
    .on 'error', handleErrors
    #.pipe debug verbose: true
    # Use vinyl-source-stream to make the
    # stream gulp compatible. Specify the
    # desired output filename here.
    .pipe source 'vendor.js'
    # Specify the output destination
    .pipe gulp.dest './dist'
    .pipe notify.message 'Finished bundling vendor packages'
    # Log when bundling completes!
    .on 'end', -> bundleLogger.end 'vendor'

  


gulp.task 'vendor', ->
  runconcat()
