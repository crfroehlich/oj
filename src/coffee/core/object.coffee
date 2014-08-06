# # object

do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  
  # ## [OJ](oj.html).object
  # create an object with helper `add` and `each` methods.
  object = ->
    obj = {}
    
    ###
    Add a property to the object and return it
    ###
    obj.add = (name, val) -> 
      OJ.property obj, name, val
      obj
    
    obj.add 'each', (callback) ->
      OJ.each obj, (val, key) ->
        if key isnt 'each' and key isnt 'add'
          callback val, key
        
    obj

  OJ.register 'object', object
  
  # ## [OJ](oj.html).isInstanceOf
  # determines is a thing is an instance of a Thing, assuming the things were all created in OJ
  OJ.register 'isInstanceOf', (name, obj) ->
    OJ.contains(name, obj) and OJ.to.bool(obj[name])
   
  # ## [OJ](oj.html).contains
  # true if the `object` contains the value   
  OJ.register 'contains', (object, index) ->
    ret = false
    if object
      ret = _.contains object, index
    ret

  # ## [OJ](oj.html).compare
  # compare two objects/arrays/values for strict equality
  OJ.register 'compare', (obj1, obj2) ->
    _.isEqual obj1, obj2
    
  # ## [OJ](oj.html).clone
  # copy all of the values (recursively) from one object to another.  
  OJ.register 'clone', (data) ->
    _.cloneDeep data true

  # ## [OJ](oj.html).serialize
  # Convert an object to a JSON representation of the object
  OJ.register 'serialize', (data) ->
    ret = ''
    OJ.tryExec ->
      ret = JSON.stringify(data)
      return
    ret or ''

  # ## [OJ](oj.html).deserialize
  # Convert a JSON string to an object
  OJ.register 'deserialize', (data) ->
    ret = {}
    if data
      OJ.tryExec ->
        ret = window.$.parseJSON(data)
        return

      ret = {}  if OJ.is.nullOrEmpty(ret)
    ret

  # ## [OJ](oj.html).params
  # Convert an object to a delimited list of parameters (normally query-string parameters)
  OJ.register 'params', (data, delimiter = '&') ->
    ret = ''
    if delimiter is '&'
      OJ.tryExec ->
        ret = $.param(data)
        return

    else
      OJ.each data, (val, key) ->
        ret += delimiter  if ret.length > 0
        ret += key + '=' + val
        return

    OJ.to.string ret

  # ## [OJ](oj.html).extend
  # copy the properties of one object to another object
  OJ.register 'extend', (destObj, srcObj, deepCopy = false) ->
    ret = destObj or {}
    if deepCopy is true
      ret = $.extend(deepCopy, ret, srcObj)
    else
      ret = $.extend(ret, srcObj)
    ret
  
  
  
  
  return

