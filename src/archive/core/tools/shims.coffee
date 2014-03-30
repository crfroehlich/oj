#global OJ:true,window:true
((OJ) ->
  "use strict"
  onError = window.onerror
  
  ###
  Log errors to the console
  ###
  window.onerror = (msg, url, lineNumber) ->
    console.warn "%s\rurl: %s\rline: %d", msg, url, lineNumber
    onError arguments_  if onError
    false #true means don't propogate the error

  unless window.setImmediate
    
    ###
    Shim for setImmediate
    ###
    window.setImmediate = (func, args) ->
      window.setTimeout func, 0, args

    window.clearImmediate = window.clearTimeout
  unless Function::inheritsFrom
    Object.defineProperties Function::,
      inheritsFrom:
        
        ###
        Easy inheritance by prototype
        ###
        value: inheritsFrom = (parentClassOrObject) ->
          if parentClassOrObject.constructor is Function
            
            #Normal Inheritance
            @:: = new parentClassOrObject
            @::constructor = this
            @::parent = parentClassOrObject::
          else
            
            #Pure Virtual Inheritance
            @:: = parentClassOrObject
            @::constructor = this
            @::parent = parentClassOrObject
          this

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
