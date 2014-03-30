((OJ) ->
 
  OJ.is.register "bool", (boolean) ->
    'use strict'
    boolean is true or boolean is false

  OJ.is.register "arrayNullOrEmpty", (arr) ->
    'use strict'
    not Array.isArray(arr) or not arr or not arr.length or arr.length is 0 or not arr.push

  OJ.is.register "stringNullOrEmpty", (str) ->
    'use strict'
    str and (not str.length or str.length is 0 or not str.trim or not str.trim())

  OJ.is.register "numberNullOrEmpty", (num) ->
    'use strict'
    not num or isNaN(num) or not num.toPrecision

  OJ.is.register "dateNullOrEmpty", (dt) ->
    'use strict'
    not dt or not dt.getTime

  OJ.is.register "objectNullOrEmpty", (obj) ->
    'use strict'
    not obj or not Object.keys(obj) or Object.keys(obj).length is 0

  OJ.is.register "plainObject", (obj) ->
    'use strict'
    ret = (OJ["?"].isPlainObject(obj))
    ret

  OJ.is.register "date", (dt) ->
    dt instanceof Date

  
  ###
  Determines if a value is an instance of a Number and not NaN*
  ###
  OJ.is.register "number", (num) ->
    typeof num is "number" and false is (OJ.number.isNaN(num) or false is OJ.number.isFinite(num) or OJ.number.MAX_VALUE is num or OJ.number.MIN_VALUE is num)

  
  ###
  Determines if a value is convertable to a Number
  ###
  OJ.is.register "numeric", (num) ->
    ret = OJ.is.number(num)
    unless ret
      nuNum = OJ.to.number(num)
      ret = OJ.is.number(nuNum)
    ret

  OJ.is.register "vendorObject", (obj) ->
    'use strict'
    ret = (obj instanceof OJ["?"])
    ret

  OJ.is.register "elementInDom", (elementId) ->
    false is OJ.is.nullOrEmpty(document.getElementById(elementId))

  OJ.is.register "generic", (obj) ->
    'use strict'
    ret = (false is OJ.is["function"](obj) and false is OJ.hasLength(obj) and false is OJ.is.plainObject(obj))
    ret

  OJ.is.register "array", (obj) ->
    Array.isArray obj

  OJ.is.register "string", (str) ->
    # covers any primitive assignment (e.g. var x = 'x')
    null isnt str and (typeof str is "string" or (typeof str is "object" and str and str.valueOf and typeof str.valueOf() is "string")) #covers any object assignment (e.g. var x = new String('x'))

  OJ.is.register "true", (obj) ->
    'use strict'
    obj is true or obj is "true" or obj is 1 or obj is "1"

  OJ.is.register "false", (obj) ->
    'use strict'
    obj is false or obj is "false" or obj is 0 or obj is "0"

  OJ.is.register "trueOrFalse", (obj) ->
    'use strict'
    OJ.is["true"](obj) or OJ.is["false"](obj)

  OJ.is.register "nullOrEmpty", (obj, checkLength) ->
    'use strict'
    ret = false
    ret = true  if (not obj and not OJ.is.trueOrFalse(obj) and not OJ.is.func(obj)) or (checkLength and obj and (obj.length is 0 or (Object.keys(obj) and Object.keys(obj).length is 0)))
    ret

  OJ.is.register "instanceof", (name, obj) ->
    'use strict'
    obj.type is name or obj instanceof name

  OJ.is.register "func", (obj) ->
    'use strict'
    typeof (obj) is "function"

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
