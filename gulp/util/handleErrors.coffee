notify = require 'gulp-notify'
_ = require 'lodash'

module.exports = (err...)->

  # Send error to notification center with gulp-notify
  onerror = notify.onError(
    title: 'Gulp Task Error'
    message: '<%= error.message %> /n Stack Trace: <%= error.stack %>'
    notifier: (opts, callback) ->
      console.error 'Title: ', opts.title
      console.error 'Message: ', opts.message
  )
  onerror err...

  # Keep gulp from hanging on this task
  @emit 'end'
  return