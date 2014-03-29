((OJ) ->
  
  ###
  True if the Object has an Array-like length property
  ###
  OJ.register "hasLength", hasLength = (obj) ->
    'use strict'
    ret = (OJ.is.array(obj) or OJ.is.jQuery(obj))
    ret

  
  #
  #        * True if the Object has a property by name, excluding the properties on the Object's prototype
  #       
  OJ.register "contains", contains = (object, index) ->
    'use strict'
    ret = false
    if false is OJ.is.nullOrUndefined(object)
      ret = object.indexOf(index) isnt -1  if OJ.is.array(object)
      ret = true  if false is ret and object.hasOwnProperty(index)
    ret

  
  ###
  Convert an Object to a String to an Object to get a dereferenced copy.
  ###
  OJ.register "clone", (data) ->
    'use strict'
    OJ.deserialize OJ.serialize(data)

  
  ###
  Convert an Object to a String
  ###
  OJ.register "serialize", serialize = (data) ->
    'use strict'
    ret = ""
    OJ.tryExec ->
      ret = JSON.stringify(data)
      return

    ret

  
  ###
  Convert a string into an Object
  ###
  OJ.register "deserialize", deserialize = (data) ->
    'use strict'
    ret = {}
    OJ.tryExec ->
      ret = OJ["?"].parseJSON(data)
      return

    ret = {}  if OJ.is.nullOrEmpty(ret)
    ret

  
  ###
  Convert an Object into a serialized parameter string
  ###
  OJ.register "params", params = (data, delimiter) ->
    'use strict'
    ret = ""
    delimiter = delimiter or "&"
    if delimiter is "&"
      OJ.tryExec ->
        ret = OJ["?"].param(data)
        return

    else
      OJ.each data, (val, key) ->
        ret += delimiter  if ret.length > 0
        ret += key + "=" + val
        return

    OJ.string ret

  
  ###
  Extend the properties of one object with the properties of another. Deep copy to recurse and preserve references.
  ###
  OJ.register "extend", extend = (destObj, srcObj, deepCopy) ->
    'use strict'
    ret = destObj or {}
    if arguments_.length is 3
      ret = window.$.extend(OJ.bool(deepCopy), ret, srcObj)
    else
      ret = window.$.extend(ret, srcObj)
    ret

  
  ###
  Take an arguments object and convert it into an Array
  ###
  OJ.register "getArguments", (args, sliceAt) ->
    'use strict'
    slice = Array::slice
    sliceAt = sliceAt or 0
    ret = slice.call(args, sliceAt)
    ret

  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
