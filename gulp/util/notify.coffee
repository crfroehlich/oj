notify = require 'gulp-notify'
module.exports =
  message: (message, title = 'Gulp Task') ->
    notify message, title
      #notifier: (opts, callback) ->
      #  console.error 'Title: ', opts.title
      #  console.error 'Message: ', opts.message    