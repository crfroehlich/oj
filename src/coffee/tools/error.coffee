OJ = require '../oj'
require '../ojInit'
require '../tools/console'

if OJ.TRACK_ON_ERROR
  onError = OJ.global.onerror

  ###
  Log errors to the console
  ###
  OJ.global.onerror = (msg, url, lineNumber) ->
    ret = false
    OJ.console.warn "%s\r url: %s\r line: %d", msg, url, lineNumber
    ret = onError msg, url, lineNumber if onError
    ret #true means don't propagate the error

 module.exports = OJ.global.onerror