gulp = require 'gulp'
header = require 'gulp-header'

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


module.exports =
  succint: ->
    pkg = require '../../package.json'
    header succint, pkg: pkg
    
  extended: ->
    pkg = require '../../package.json'
    header extended, pkg: pkg  
    
  package: require '../../package.json'