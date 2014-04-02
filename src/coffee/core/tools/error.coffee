((OJ) ->
  thisGlobal = ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)))
  onError = thisGlobal.onerror
  
  ###
  Log errors to the console
  ###
  thisGlobal.onerror = (msg, url, lineNumber) ->
    console.warn "%s\rurl: %s\rline: %d", msg, url, lineNumber
    onError arguments if onError
    false #true means don't propogate the error

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
