gulp = require 'gulp'
config = null
fs.createFile 'config.cson', (err) -> 
  if err then fs.copy 'config.tmpl', 'config.cson'
  config = require './config.cson'

module.exports = config