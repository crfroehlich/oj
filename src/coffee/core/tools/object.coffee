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
    OJ.property obj, "add", ((name, val, writable, configurable, enumerable) ->
      OJ.property obj, name, val, writable, configurable, enumerable
    ), false, false, false
    obj

  OJ.register "object", object
  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
