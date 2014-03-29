((OJ) ->
  
  ###
  Create an instance of Object
  @param properties {Object} [properties={}] properties to define on the Object
  @param inheritsFromPrototype {Prototype} [inheritsFromPrototype=null] The prototype to inherit from
  ###
  object = (properties, inheritsFromPrototype) ->
    inheritsFromPrototype = null  unless inheritsFromPrototype
    properties = {}  unless properties
    obj = Object.create(inheritsFromPrototype, properties)
    
    ###
    Add a property to the object and return it
    ###
    OJ.property obj, 'add', ((name, val, writable, configurable, enumerable) ->
      OJ.property obj, name, val, writable, configurable, enumerable
    ), false, false, false
    obj

  OJ.register 'object', object
  
  OJ.register 'isInstanceOf', (name, obj) ->
    OJ.contains(name, obj) and OJ.bool(obj[name])

  OJ.register 'contains', (object, index) ->
    ret = false
    if false is OJ.isNullOrUndefined(object)
      ret = object.indexOf(index) isnt -1  if OJ.isArray(object)
      ret = true  if false is ret and object.hasOwnProperty(index)
    ret

  OJ.register 'compare', (obj1, obj2) ->
    _.isEqual obj1 obj2
    
  OJ.register 'clone', (data) ->
    _.cloneDeep data true

  OJ.register 'serialize', (data) ->
    ret = ''
    OJ.tryExec ->
      ret = JSON.stringify(data)
      return
    ret or ''

  OJ.register 'deserialize', (data) ->
    ret = {}
    if data
      OJ.tryExec ->
        ret = window.$.parseJSON(data)
        return

      ret = {}  if OJ.isNullOrEmpty(ret)
    ret

  OJ.register 'params', (data, delimiter) ->
    ret = ''
    delimiter = delimiter or '&'
    if delimiter is '&'
      OJ.tryExec ->
        ret = $.param(data)
        return

    else
      OJ.each data, (val, key) ->
        ret += delimiter  if ret.length > 0
        ret += key + '=' + val
        return

    OJ.string ret

  OJ.register 'extend', (destObj, srcObj, deepCopy) ->
    ret = destObj or {}
    if arguments_.length is 3
      ret = $.extend(OJ.bool(deepCopy), ret, srcObj)
    else
      ret = $.extend(ret, srcObj)
    ret
  
  
  
  
  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
