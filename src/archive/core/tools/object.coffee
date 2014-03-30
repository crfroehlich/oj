# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_propertyIIFE = (OJ) ->
  
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
    OJ.property obj, "add", ((name, val, writable, configurable, enumerable) ->
      OJ.property obj, name, val, writable, configurable, enumerable
    ), false, false, false
    obj

  OJ.register "object", object
  OJ.register "isInstanceOf", (name, obj) ->
    "use strict"
    OJ.contains(name, obj) and OJ.bool(obj[name])

  OJ.register "contains", (object, index) ->
    
    #/ <summary>Determines whether an object or an array contains a property or index. Null-safe.</summary>
    #/ <param name="object" type="Object"> An object to evaluate </param>
    #/ <param name="index" type="String"> An index or property to find </param>
    #/ <returns type="Boolean" />
    "use strict"
    ret = false
    if false is OJ.isNullOrUndefined(object)
      ret = object.indexOf(index) isnt -1  if OJ.isArray(object)
      ret = true  if false is ret and object.hasOwnProperty(index)
    ret

  
  ###
  Compares two objects, serialized to strings, stripped of whitespace
  ###
  compare = (obj1, obj2) ->
    string1 = ""
    string2 = ""
    string1 = OJ.serialize(obj1).trim().replace(" ", "")  if obj1
    string2 = OJ.serialize(obj2).trim().replace(" ", "")  if obj2
    string1 is string2

  OJ.register "compare", compare
  OJ.register "clone", (data) ->
    
    #/ <summary>Get a dereferenced copy of an object</summary>
    #/ <param name="data" type="Object"> An object </param>
    #/ <returns type="Object"> An identical copy of the object. </returns>
    "use strict"
    JSON.parse JSON.stringify(data)

  OJ.register "serialize", (data) ->
    
    #/ <summary>Convert an object to a string</summary>
    #/ <param name="data" type="Object"> An object </param>
    #/ <returns type="String"> A string representation of the object. </returns>
    "use strict"
    ret = ""
    OJ.tryExec ->
      ret = JSON.stringify(data)
      return

    ret or ""

  OJ.register "deserialize", (data) ->
    
    #/ <summary>Convert a string to a native JS Object</summary>
    #/ <param name="data" type="String"> A string representation of an object </param>
    #/ <returns type="Object"> An object. </returns>
    "use strict"
    ret = {}
    if data
      OJ.tryExec ->
        ret = window.$.parseJSON(data)
        return

      ret = {}  if OJ.isNullOrEmpty(ret)
    ret

  OJ.register "params", (data, delimiter) ->
    
    #/ <summary>Convert an object to delimited list of parameters (x='1'&y='2')</summary>
    #/ <param name="data" type="Object"> An object </param>
    #/ <returns type="String"> A parameter string. </returns>
    ret = ""
    delimiter = delimiter or "&"
    if delimiter is "&"
      OJ.tryExec ->
        ret = $.param(data)
        return

    else
      OJ.each data, (val, key) ->
        ret += delimiter  if ret.length > 0
        ret += key + "=" + val
        return

    OJ.string ret

  OJ.register "extend", (destObj, srcObj, deepCopy) ->
    
    #/ <summary>Copy one object to another</summary>
    #/ <returns type="Object"> An object. </returns>
    "use strict"
    ret = destObj or {}
    if arguments_.length is 3
      ret = window.$.extend(OJ.bool(deepCopy), ret, srcObj)
    else
      ret = window.$.extend(ret, srcObj)
    ret

  OJ.register "count", (obj) ->
    
    #/ <summary>Determines the number of elements in the object</summary>
    #/ <returns type="Number">Count</returns>
    "use strict"
    count = 0
    for prop of obj
      count++  if obj.hasOwnProperty(prop)
    count

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
