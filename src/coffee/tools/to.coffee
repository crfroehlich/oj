OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'
isMethod = require './is'
obj = require '../core/object'
each = require './each'

# # to
to =
  # ## bool
  # convert any compatible object to a boolean. Incompatible objects are false.
  bool: (str) ->
    retBool = isMethod['true'](str)
    retBool = false  if retBool is false or retBool isnt true
    retBool

  # ## ES5_ToBool
  # (debug) method to explicitly force an `if(obj)` evaluation to flow through the ES5 spec for truthiness
  'ES5_ToBool': (val) ->
    val isnt false and val isnt 0 and val isnt '' and val isnt null and typeof val isnt 'undefined' and (typeof val isnt 'number' or not isNaN(val))

  # ## dateFromTicks
  # take a number representing ticks and convert it into an instance of Date
  dateFromTicks: (tickStr) ->
    ticsDateTime = to.string(tickStr)
    ret = undefined
    ticks = undefined
    offset = undefined
    localOffset = undefined
    arr = undefined
    if false is isMethod.nullOrEmpty(ticsDateTime)
      ticsDateTime = ticsDateTime.replace('/', '')
      ticsDateTime = ticsDateTime.replace('Date', '')
      ticsDateTime = ticsDateTime.replace('(', '')
      ticsDateTime = ticsDateTime.replace(')', '')
      arr = ticsDateTime.split('-')
      if arr.length > 1
        ticks = to.number(arr[0])
        offset = to.number(arr[1])
        localOffset = new Date().getTimezoneOffset()
        ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)))
      else if arr.length is 1
        ticks = to.number(arr[0])
        ret = new Date(ticks)
    ret

  # ## binary
  # convert an object to binary 0 or 1
  binary: (obj) ->
    ret = NaN
    if obj is 0 or obj is '0' or obj is '' or obj is false or to.string(obj).toLowerCase().trim() is 'false'
      ret = 0
    else ret = 1  if obj is 1 or obj is '1' or obj is true or to.string(obj).toLowerCase().trim() is 'true'
    ret


  # ## number
  #
  # Attempts to convert an arbitrary value to a Number.
  # Loose falsy values are converted to 0.
  # Loose truthy values are converted to 1.
  # All other values are parsed as Integers.
  # Failures return as NaN.
  #
  number: (inputNum, defaultNum) ->
    tryGetNumber = (val) ->
      ret = NaN
      # if `val` already (is)[is.html] a Number, return it
      if isMethod.number(val)
        ret = val
      # else if `val` already (is)[is.html] a String or a Boolean, convert it
      else if isMethod.string(val) or isMethod.bool(val)
        tryGet = (value) ->
          num = to.binary(value)
          num = +value  if not isMethod.number(num) and value
          num = _.parseInt(value, 0) if not isMethod.number(num)
          num
        ret = tryGet val
      ret

    retVal = tryGetNumber(inputNum)
    if not isMethod.number(retVal)
      retVal = tryGetNumber(defaultNum)
      retVal = Number.NaN if not isMethod.number(retVal)
    retVal

  # ## string
  # convert an object to string
  string: (inputStr, defaultStr) ->
    tryGetString = (str) ->
      ret = undefined
      if isMethod.string(str)
        ret = str
      else
        ret = ''
        ret = str.toString()  if isMethod.bool(str) or isMethod.number(str) or isMethod.date(str)
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

Object.seal to
Object.freeze to

OJ.register 'to', to
module.exports = to