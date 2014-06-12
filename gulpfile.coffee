gulp = require 'gulp'
autoprefixer = require 'gulp-autoprefixer'
minifyCss = require 'gulp-minify-css'
uglify = require 'gulp-uglify'
gutil = require 'gulp-util'
imagemin = require 'gulp-imagemin'
rename = require 'gulp-rename'
clean = require 'gulp-clean'
concat = require 'gulp-concat'
notify = require 'gulp-notify'
cache = require 'gulp-cache'
livereload = require 'gulp-livereload'
lr = require 'tiny-lr'
plugins = require 'gulp-load-plugins' 
path = require 'path'
wiredep = require 'wiredep'
wiredepStream = wiredep.stream
coffee = require 'gulp-coffee'
coffeelint = require 'gulp-coffeelint'
debug = require 'gulp-debug'
inject = require 'gulp-inject'
git = require 'gulp-git'
bump = require 'gulp-bump'
qunit = require 'gulp-qunit'
header = require 'gulp-header'
watch = require 'gulp-watch'
server = lr()

pkg = require './package.json'

extended = [
  '/**'
  ' * <%= pkg.name %> - <%= pkg.description %>'
  ' * @version v<%= pkg.version %>'
  ' * @link <%= pkg.homepage %>'
  ' * @license <%= pkg.license %>'
  ' */'
  ''
].join('\n')

succint = '// <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.license %> licensed. <%= pkg.homepage %>\n'

paths =
  css: './src/css'
  js: './src/coffee'
  release: './dist'
  lib: './bower_components'
  coffee: './src/coffee'
  src: './src'
  test: './test'

files =
  index: './dist/release.html'
  devIndex: './src/dev.html'
  testIndex: './test/test.html'
  testIndexCoffee: './test/test.coffee.html'
  css: './src/css/**/*.css'
  js: './src/coffee/**/*.js'
  coffee: './src/coffee/**/*.coffee'
  test: './test/**/*.coffee*/'

# Inject JS & CSS Files
gulp.task 'inject', ->
  
  #Inject into dev.html
  #1. Add the template to a new stream
  gulp.src './src/dev.tmpl'
    #2: Rename the file from .tmpl to .html
    .pipe rename extname: '.html'
    #3: Inject all OJ resources into the file
    .pipe inject(gulp.src([
      files.js
      files.css
    ],
      read: false), # Not necessary to read the files (will speed up things), we're only after their paths
   
      addRootSlash: false
      addPrefix: '..')
    #4: Inject all Bower resources into the file  
    .pipe wiredepStream
      exclude: [/backbone/, /underscore/, /require/] #these will break Lo-Dash
    #5: write the file to disk  
    .pipe gulp.dest paths.src
    #6: Send Growl notification that task has completed
    .pipe notify message: 'dev.html includes dynamically injected.'
    #7: Write any errors to the console
    .on 'error', gutil.log
  
  # Repeat for Unit Tests HTML page
  gulp.src './test/test.tmpl'
    .pipe rename extname: '.html'
    .pipe inject(gulp.src([
      files.js
      './test/**/*.js*/'
      files.css
    ],
      read: false), # Not necessary to read the files (will speed up things), we're only after their paths
    
      addRootSlash: false
      addPrefix: '..')
      
    .pipe wiredepStream
      exclude: [/backbone/, /underscore/, /require/] #these will break Lo-Dash
      devDependencies: true
    .pipe gulp.dest paths.test
    .pipe notify message: 'test.html includes dynamically injected.'
    .on 'error', gutil.log
  
  # Repeat for Release HTML page
  gulp.src './dist/release.tmpl'
    .pipe rename extname: '.html'
    .pipe inject(gulp.src(['./dist/**/*.min*'],
      read: false),
      addRootSlash: false
      addPrefix: '..')
    .pipe wiredepStream
      exclude: [/backbone/, /underscore/, /require/] #these will break Lo-Dash
    .pipe gulp.dest paths.release
    .pipe notify message: 'release.html includes dynamically injected.'
    .on 'error', gutil.log
  return


### 
Compile and Minify CoffeeScript to JS
###
gulp.task 'coffee', ->
  #1: compile all coffee files in-place to support debugging
  gulp.src files.coffee, base: './'
    .pipe coffee map: true, m: true
    .pipe gulp.dest './'
  
  #2: compile dist files
  gulp.src files.coffee
    .pipe coffee map: true
    .pipe concat 'OJ.js'
    .pipe header extended, pkg: pkg
    .pipe gulp.dest paths.release
    .pipe rename suffix: '.min'
    .pipe uglify outSourceMap: true
    .pipe header succint, pkg: pkg
    .pipe gulp.dest paths.release
    .pipe notify message: 'CoffeeScript to JS compilation complete.'
    .on 'error', gutil.log
  return
  
###
 Bump the version in bower and package json
###
gulp.task 'bumpVersion', ->
  gulp.src [
    './package.json'
    './bower.json'
  ]
  .pipe bump()
  .pipe gulp.dest './'
  return


###
 Tag the repo with a version
###
gulp.task 'tag', ->
  v = 'v' + pkg.version
  message = 'Release ' + v
  git.add()
  git.commit message
  git.tag v, message
  git.push 'origin', 'master' #, '--tags'
  return

# Publish to npm
gulp.task 'npm', (done) ->
  require 'child_process' 
    .spawn 'npm', ['publish'], stdio: 'inherit'
    .on 'close', done
    .on 'error', gutil.log
  return


# Init watch
gulp.task 'watch', ->
  
  #gulp.watch(files.js, ['inject']);
  gulp.watch files.coffee, [
    'compile'
  ]
  gulp.watch files.test, [
    'compile'
  ]
  gulp.watch files.css, [
    'compile'
  ]
  return

gulp.task 'test', ->
  gulp.src './test/test.html'
    .pipe qunit()

gulp.task 'compile', [
  'coffee'
  'inject'
]

gulp.task 'build', [
  'compile'
  'watch'
]

gulp.task 'docco', ->
  gulp.src './src/coffee/**/*.coffee'
   .pipe docco()
   .pipe gulp.dest './docs'

gulp.task 'default', ['build']

gulp.task 'bump', [
  'bumpVersion'
  'compile' 
]