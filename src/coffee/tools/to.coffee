# # to

((OJ) ->
  OJ.to.register 'bool', (str) ->
    retBool = OJ.is['true'](str)
    retBool = false  if retBool is false or retBool isnt true
    retBool

  OJ.to.register 'ES5_ToBool', (val) ->
    val isnt false and val isnt 0 and val isnt '' and val isnt null and val isnt `undefined` and (typeof val isnt 'number' or not isNaN(val))

  OJ.to.register 'dateFromTicks', (tickStr) ->
    ticsDateTime = OJ.to.string(tickStr)
    ret = undefined
    ticks = undefined
    offset = undefined
    localOffset = undefined
    arr = undefined
    if false is OJ.is.nullOrEmpty(ticsDateTime)
      ticsDateTime = ticsDateTime.replace('/', '')
      ticsDateTime = ticsDateTime.replace('Date', '')
      ticsDateTime = ticsDateTime.replace('(', '')
      ticsDateTime = ticsDateTime.replace(')', '')
      arr = ticsDateTime.split('-')
      if arr.length > 1
        ticks = OJ.to.number(arr[0])
        offset = OJ.to.number(arr[1])
        localOffset = new Date().getTimezoneOffset()
        ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)))
      else if arr.length is 1
        ticks = OJ.to.number(arr[0])
        ret = new Date(ticks)
    ret

  OJ.to.register 'binary', (obj) ->
    ret = NaN
    if obj is 0 or obj is '0' or obj is '' or obj is false or OJ.to.string(obj).toLowerCase().trim() is 'false'
      ret = 0
    else ret = 1  if obj is 1 or obj is '1' or obj is true or OJ.to.string(obj).toLowerCase().trim() is 'true'
    ret

  
  ###
  Attempts to converts an arbitrary value to a Number.
  Loose falsy values are converted to 0.
  Loose truthy values are converted to 1.
  All other values are parsed as Integers.
  Failures return as NaN.
  ###
  OJ.to.register 'number', (inputNum, defaultNum) ->
    tryGetNumber = (val) ->
      ret = NaN
      if OJ.is.number(val)
        ret = val
      else if OJ.is.string(val) or OJ.is.bool(val)
        tryGet = (value) ->
          num = OJ.to.binary(value)
          num = +value  if not OJ.is.number(num) and value
          num = _.parseInt(value, 0) if not OJ.is.number(num)
          num
        ret = tryGet val
      ret
      
    retVal = tryGetNumber(inputNum)
    if not OJ.is.number(retVal)
      retVal = tryGetNumber(defaultNum)
      retVal = Number.NaN if not OJ.is.number(retVal)
    retVal

  OJ.to.register 'string', (inputStr, defaultStr) ->
    tryGetString = (str) ->
      ret = undefined
      if OJ.is.string(str)
        ret = str
      else
        ret = ''
        ret = str.toString()  if OJ.is.bool(str) or OJ.is.number(str) or OJ.is.date(str)
      ret
    ret1 = tryGetString(inputStr)
    ret2 = tryGetString(defaultStr)
    retVal = ''
    if ret1.length isnt 0
      retVal = ret1
    else if ret1 is ret2 or ret2.length is 0
      retVal = ret1
    else
      retVal = ret2
    retVal

  return
)  ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
