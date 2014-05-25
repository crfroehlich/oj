((OJ) ->
  
  ###
  Add a property to an object
  
  ###
  property = (obj, name, value, writable, configurable, enumerable) ->
    throw new Error "Cannot define a property without an Object."  unless obj
    throw new Error "Cannot create a property without a valid property name."  unless name
    obj[name] = value
    obj

  OJ.register "property", property
  return
)  ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
