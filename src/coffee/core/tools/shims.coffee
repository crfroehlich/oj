((OJ) ->
  thisGlobal = ((if typeof global isnt 'undefined' and global then global else (if typeof thisGlobal isnt 'undefined' then thisGlobal else this)))
  onError = thisGlobal.onerror
  
  ###
  Log errors to the console
  ###
  thisGlobal.onerror = (msg, url, lineNumber) ->
    console.warn "%s\rurl: %s\rline: %d", msg, url, lineNumber
    onError arguments_  if onError
    false #true means don't propogate the error

  unless thisGlobal.setImmediate
    
    ###
    Shim for setImmediate
    ###
    thisGlobal.setImmediate = (func, args) ->
      thisGlobal.setTimeout func, 0, args

    thisGlobal.clearImmediate = thisGlobal.clearTimeout
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
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
