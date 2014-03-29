((OJ) ->
  
  ###
  Create a new object with constant properties..
  @param props {Object} an object represent the enun members
  ###
  Constant = (props) ->
    that = null
    keys = []
    if props
      that = this
      
      ###
      Assert that the provided key is a member of the enum
      @param key {String} enum property name
      ###
      OJ.property that, "has", (key) ->
        keys.indexOf(key) isnt -1

      OJ.each props, (propVal, propName) ->
        keys.push propVal
        Object.defineProperty that, propName,
          value: propVal

        return

    that

  
  ###
  Create a new enum on the constants namespace.
  Enums are objects consisting of read-only, non-configurable, non-enumerable properties.
  @param name {String} the name of the enum
  @param props {Object} the properties of the enum
  ###
  OJ.register "constant", (OJ, name, props) ->
    ret = new Constant(props)
    OJ = OJ or OJ
    if ret and OJ.constants and OJ.constants.register and name
      OJ.constants.register name, ret
      Object.seal ret
      Object.freeze ret
    ret

  return
)  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
