gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
path = require 'path'
wiredep = require 'wiredep'
wiredepStream = wiredep.stream
inject = require 'gulp-inject'

handleErrors = require '../util/handleErrors'
logger = require '../util/bundleLogger'
notify = require '../util/notify'
content = require '../util/files'

src = [
]

injectTask = (path = '', pageName = '', sourceFiles = [], exclude = [], includeDevDependencies = false) ->
  #1. Add the template to a new stream
  gulp.src path + '/' + pageName + '.tmpl'
    #2: Rename the file from .tmpl to .html
    .pipe rename extname: '.html'
    #3: Inject all OJ resources into the file
    .pipe inject(gulp.src(sourceFiles, read: false), # Not necessary to read the files (will speed up things), we're only after their paths
      addRootSlash: false
      addPrefix: '..')
    #4: Inject all Bower resources into the file  
    .pipe wiredepStream
      exclude: exclude
      devDependencies: includeDevDependencies
    #5: write the file to disk  
    .pipe gulp.dest path
    #6: Send Growl notification that task has completed
    .pipe notify.message pageName + '.html includes dynamically injected.'
    #7: Write any errors to the console
    .on 'error', handleErrors


gulp.task 'inject-dev', ->
  injectTask './src', 'dev', src, [/es5-shim/, /es6-shim/, /backbone/, /underscore/, /require/, /jquery.min.js/, /jqueryy-migrate/]

gulp.task 'inject-test', ->
  injectTask './test', 'test', src, [/[.]js$/], true

gulp.task 'inject-release', ->
  injectTask './dist', 'index', src, [/[.]js$/] 

# Inject JS & CSS Files
gulp.task 'inject-all', [
  'inject-dev'
  'inject-test'
  'inject-release'
]