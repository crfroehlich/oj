((OJ) ->
  
  ###
  True if the object is a true Object or Array
  @param obj {Object}
  ###
  canEach = (obj) ->
    obj and (typeof obj is "object" or Array.isArray(obj))

  
  ###
  Iterate an object with optional callBack and recursion
  @param obj {Object} an Object to iterate
  @param onEach {Function} [onEach=undefined] call back to exec
  @param recursive {Boolean} if true, recurse the object
  ###
  each = (obj, onEach, recursive) ->
    if canEach(obj)
      _.forEach obj, (val, key) ->
        if onEach and key
          quit = onEach(val, key)
          return false  if false is quit
        each val, onEach, true  if true is recursive
        return

    return

  OJ.register "each", each
  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
