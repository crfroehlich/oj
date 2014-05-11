((OJ) ->
  
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

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
