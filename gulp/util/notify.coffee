notify = require 'gulp-notify'
module.exports =
  message: (msg, title = '') ->
    notify title: title, message: msg