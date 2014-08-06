# includes
fs = require 'fs'
onlyScripts = require './util/scriptFilter'

# logic
tasks = fs.readdirSync('./gulp/tasks/').filter(onlyScripts)
tasks.forEach (task) ->
  require './tasks/' + task
  return