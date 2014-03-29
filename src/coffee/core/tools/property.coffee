((OJ) ->
  
  ###
  Add a property to an object
  @param obj {Object} an Object onto which to add a property
  @param name {String} the property name
  @param value {Object} the value of the property. Can be any type.
  @param writable {Boolean} [writable=true] True if the property can be modified
  @param configurable {Boolean} [configurable=true] True if the property can be removed
  @param enumerable {Boolean} [enumerable=true] True if the property can be enumerated and is listed in Object.keys
  ###
  property = (obj, name, value, writable, configurable, enumerable) ->
    throw new Error("Cannot define a property without an Object.")  unless obj
    throw new Error("Cannot create a property without a valid property name.")  unless typeof name is "string"
    isWritable = (writable isnt false)
    isConfigurable = (configurable isnt false)
    isEnumerable = (enumerable isnt false)
    Object.defineProperty obj, name,
      value: value
      writable: isWritable
      configurable: isConfigurable
      enumerable: isEnumerable

    obj

  OJ.register "property", property
  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
