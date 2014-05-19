gulp = require 'gulp'
less = require 'gulp-less'
autoprefixer = require 'gulp-autoprefixer'
minifyCss = require 'gulp-minify-css'
jshint = require 'gulp-jshint'
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
gulpBowerFiles = require 'gulp-bower-files'
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
plumber = require 'gulp-plumber'
js2coffee = require 'gulp-js2coffee'
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
  gulp.src files.devIndex
    .pipe inject(gulp.src([
      files.js
      files.css
    ],
      read: false), # Not necessary to read the files (will speed up things), we're only after their paths
   
      addRootSlash: false
      addPrefix: '..')
    .pipe wiredepStream
      exclude: [/backbone/, /underscore/, /require/] #these will break Lo-Dash
    .pipe gulp.dest paths.src
    .pipe notify message: 'dev.html includes dynamically injected.'
    .on 'error', gutil.log
  
  gulp.src files.testIndex
    .pipe(inject(gulp.src([
      files.js
      './test/**/*.js*/'
      files.css
    ],
      read: false # Not necessary to read the files (will speed up things), we're only after their paths
    ),
      addRootSlash: false
      addPrefix: '..'
    ))
    .pipe wiredepStream
      exclude: [/backbone/, /underscore/, /require/] #these will break Lo-Dash
      devDependencies: true
    .pipe gulp.dest paths.test
    .pipe notify message: 'test.html includes dynamically injected.'
    .on 'error', gutil.log
  
  gulp.src(files.index)
    .pipe(inject(gulp.src(['./dist/**/*.min*'],
      read: false
    ),
      addRootSlash: false
      addPrefix: '..'
    ))
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

gulp.task 'default', ['build']

gulp.task 'bump', [
  'bumpVersion'
  'compile' 
]