((OJ) ->
  
  OJ.is.register 'bool', (boolean) ->
    'use strict'
    _.isBoolean boolean

  OJ.is.register 'arrayNullOrEmpty', (arr) ->
    'use strict'
    _.isEmpty arr

  OJ.is.register 'stringNullOrEmpty', (str) ->
    'use strict'
    str and (not str.length or str.length is 0 or not str.trim or not str.trim())

  OJ.is.register 'numberNullOrEmpty', (num) ->
    'use strict'
    not num or isNaN(num) or not num.toPrecision

  OJ.is.register 'dateNullOrEmpty', (dt) ->
    'use strict'
    not dt or not dt.getTime

  OJ.is.register 'objectNullOrEmpty', (obj) ->
    'use strict'
    _.isEmpty obj or not Object.keys(obj) or Object.keys(obj).length is 0

  OJ.is.register 'plainObject', (obj) ->
    'use strict'
    _.isPlainObject obj

  OJ.is.register 'date', (dt) ->
    _.isDate dt

  
  ###
  Determines if a value is an instance of a Number and not NaN*
  ###
  OJ.is.register 'number', (num) ->
    typeof num is 'number' and false is (OJ.number.isNaN(num) or false is OJ.number.isFinite(num) or OJ.number.MAX_VALUE is num or OJ.number.MIN_VALUE is num)

  ###
  Determines if a value is convertable to a Number
  ###
  OJ.is.register 'numeric', (num) ->
    ret = OJ.is.number(num)
    unless ret
      nuNum = OJ.to.number(num)
      ret = OJ.is.number(nuNum)
    ret

  OJ.is.register 'vendorObject', (obj) ->
    'use strict'
    ret = (obj instanceof OJ['?'])
    ret

  OJ.is.register 'elementInDom', (elementId) ->
    false is OJ.is.nullOrEmpty(document.getElementById(elementId))

  OJ.is.register 'generic', (obj) ->
    'use strict'
    ret = (false is OJ.is.method(obj) and false is OJ.hasLength(obj) and false is OJ.is.plainObject(obj))
    ret

  OJ.is.register 'array', (obj) ->
    _.isArray obj

  OJ.is.register 'string', (str) ->
    _.isString str
    
  OJ.is.register 'true', (obj) ->
    'use strict'
    obj is true or obj is 'true' or obj is 1 or obj is '1'

  OJ.is.register 'false', (obj) ->
    'use strict'
    obj is false or obj is 'false' or obj is 0 or obj is '0'

  OJ.is.register 'trueOrFalse', (obj) ->
    'use strict'
    OJ.is.true obj or OJ.is.false obj

  OJ.is.register 'nullOrEmpty', (obj, checkLength) ->
    'use strict'
    _.isEmpty obj or _.isUndefined obj or _.isNull obj or _.isNaN obj

  OJ.is.register 'instanceof', (name, obj) ->
    'use strict'
    obj.type is name or obj instanceof name

  OJ.is.register 'method', (obj) ->
    'use strict'
    obj isnt OJ.noop and _.isFunction obj

  ###
  Deprecated. Left for backwards compatibility. Use is.method instead.
  ###
  OJ.is.register 'func', OJ.is.method
  
  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
