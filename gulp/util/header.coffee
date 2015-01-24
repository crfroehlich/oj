gulp = require 'gulp'
header = require 'gulp-header'

extended = [
  '/**'
  ' * <%= pkg.name %>: <%= pkg.description %>'
  ' * @version: v<%= pkg.version %>'
  ' * @link: <%= pkg.homepage %>'
  ' * @license: <%= pkg.licenses[0].type %> (<%= pkg.licenses[0].url %>)'
  ' */'
  ''
].join('\n')

succinct = '// <%= pkg.name %>@v<%= pkg.version %>, <%= pkg.licenses[0].type %> licensed (<%= pkg.licenses[0].url %>). <%= pkg.homepage %>\n'


module.exports =
  succinct: ->
    pkg = require '../../package.json'
    header succinct, pkg: pkg
    
  extended: ->
    pkg = require '../../package.json'
    header extended, pkg: pkg  
    
  package: require '../../package.json'