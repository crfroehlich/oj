gulp = require 'gulp'
pkg = require '../../package.json'
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
    header succint, pkg: pkg

  extended: ->
    header extended, pkg: pkg

  package: pkg