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
  test: './test/**/*.coffee'
  testJs: './test/**/*.js'

module.exports =
  paths: paths
  files: files