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
notify = require '../util/notify'
gulp = require 'gulp'
handleErrors = require '../util/handleErrors'
source = require 'vinyl-source-stream'
glob = require 'glob'
debug = require 'gulp-debug'
basename = require('path').basename
pkg = require '../../package.json'
minifyify = require 'minifyify'

# FIXME: tests can import modules from dev but must do so via ../../src/coffee/..
transforms = [
  
]

config =
  dev:
    entries: './src/coffee/entrypoint.coffee'
    export:
      glob: './src/coffee/**/*.coffee'
      cwd: './src/coffee'
    #paths: ['./']
    filename: 'OJ.js'
    dest: './dist'
    transforms: transforms
    debug: true
    fullPaths: true
  release:
    entries: './src/coffee/entrypoint.coffee'
    export:
      glob: './src/coffee/**/*.coffee'
      cwd: './src/coffee'
    #paths: ['./']
    filename: 'OJ.min.js'
    transforms: transforms.concat 'minifyify'
    debug: true
    dest: './dist'
    fullPaths: false
  test:
    entries: [ './src/coffee/entrypoint.coffee', glob.sync('./test/**/*.coffee')]
    dest: './test'
    #paths: ['./', './src/coffee/']
    filename: 'test.js'
    external:
      glob: './src/coffee/**/*.coffee'
      cwd: './src/coffee'
    transforms: transforms
    debug: true  
    fullPaths: true

runbrowserify = (name) ->
  cfg = config[name]

  bundleMethod = (if global.isWatching then watchify else browserify)
  bundleCfg =
    # Specify the entry point of your app
    entries: cfg.entries
    fullPaths: false
    # Add file extentions to make optional in your requires
    extensions: [ '.coffee' ]
    debug: true
    bundleExternal: false
    
    
  #if cfg.paths? then bundleCfg.paths = cfg.paths

  bundler = bundleMethod(bundleCfg)

  for transform in cfg.transforms
    switch transform 
      when 'uglifyify'
        bundler.transform global: true, transform
      when 'minifyify'
        bundler.plugin transform, map: 'OJ.min.js.map', output: cfg.dest + '/' + cfg.filename
      else
        bundler.transform transform  
  
  # exclude deps incompatible with browser
  # bundler.exclude {packName}
  
  for module of pkg['browser']
    bundler.external module
  
  bundle = ->
    
    # Log when bundling starts
    bundleLogger.start()
    
    bundler
      .bundle()
      # Report compile errors
      .on 'error', handleErrors
      # Use vinyl-source-stream to make the
      # stream gulp compatible. Specify the
      # desired output filename here.
      .pipe source cfg.filename
      # Specify the output destination
      .pipe gulp.dest cfg.dest
      .pipe notify.message 'Finished bundling ' + name
      # Log when bundling completes!
      .on 'end', -> bundleLogger.end name

  # Rebundle with watchify on changes.
  bundler.on 'update', bundle if global.isWatching
  bundle()

gulp.task 'browserify', ['browserify-dev','browserify-test', 'browserify-release']

gulp.task 'browserify-dev', ->
  runbrowserify 'dev'

gulp.task 'browserify-release', ->
  runbrowserify 'release'

gulp.task 'browserify-test', ['browserify-dev'], ->
  runbrowserify 'test'

gulp.task 'watchify', ->