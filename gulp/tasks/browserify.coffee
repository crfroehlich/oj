# browserify task
#   ---------------
#   Bundle javascripty things with browserify!
#
#   If the watch task is running, this uses watchify instead
#   of browserify for faster bundling using caching.
#
browserify = require 'browserify'
watchify = require 'watchify'
bundleLogger = require '../util/bundleLogger'
gulp = require 'gulp'
handleErrors = require '../util/handleErrors'
source = require 'vinyl-source-stream'
glob = require 'glob'

# FIXME: tests can import modules from main but must do so via ../../src/coffee/..

config =
  main:
    entries: glob.sync('./src/coffee/**/*.coffee')
    export:
      glob: './src/coffee/**/*.coffee'
      cwd: './src/coffee'
    #paths: ['./']
    filename: 'OJ.js'
    dest: './dist'
  test:
    entries: ['./src/coffee/entrypoint.coffee', glob.sync('./test/**/*.coffee')]
    dest: './test'
    #paths: ['./', './src/coffee/']
    filename: 'test.js'
    external:
      glob: './src/coffee/**/*.coffee'
      cwd: './src/coffee'

runbrowserify = (name) ->
  cfg = config[name]

  bundleMethod = (if global.isWatching then watchify else browserify)
  bundleCfg =
    # Specify the entry point of your app
    entries: cfg.entries
    #paths: cfg.paths
    fullPaths: true
    # Add file extentions to make optional in your requires
    extensions: [ '.coffee' ]

  #if cfg.paths? then bundleCfg.paths = cfg.paths

  bundler = bundleMethod(bundleCfg)

  bundle = ->

    # Log when bundling starts
    bundleLogger.start()

    bundler
      # Enable source maps!
      .bundle debug: true
      # Report compile errors
      .on 'error', handleErrors
      # Use vinyl-source-stream to make the
      # stream gulp compatible. Specify the
      # desired output filename here.
      .pipe source cfg.filename
      # Specify the output destination
      .pipe gulp.dest cfg.dest
      # Log when bundling completes!
      .on 'end', bundleLogger.end

  # Rebundle with watchify on changes.
  bundler.on 'update', bundle  if global.isWatching
  bundle()

gulp.task 'browserify', ->
  runbrowserify 'main'
  #runbrowserify 'test'
