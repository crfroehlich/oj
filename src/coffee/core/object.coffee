((OJ) ->
  
  ###
  Create an instance of Object
  ###
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
  
  OJ.register 'isInstanceOf', (name, obj) ->
    OJ.contains(name, obj) and OJ.to.bool(obj[name])

  OJ.register 'contains', (object, index) ->
    ret = false
    if object
      ret = _.contains object index
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

      ret = {}  if OJ.is.nullOrEmpty(ret)
    ret

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

  OJ.register 'extend', (destObj, srcObj, deepCopy = false) ->
    ret = destObj or {}
    if arguments.length is 3
      ret = $.extend(OJ.to.bool(deepCopy), ret, srcObj)
    else
      ret = $.extend(ret, srcObj)
    ret
  
  
  
  
  return
)  ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
