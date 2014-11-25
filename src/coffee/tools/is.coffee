OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'

isMethod = {}

isMethod.bool = (boolean) ->
  _.isBoolean boolean

isMethod.arrayNullOrEmpty = (arr) ->
  _.isEmpty arr

isMethod.stringNullOrEmpty = (str) ->
  str and (not str.length or str.length is 0 or not str.trim or not str.trim())

isMethod.numberNullOrEmpty = (num) ->
  not num or isNaN(num) or not num.toPrecision

isMethod.dateNullOrEmpty = (dt) ->
  not dt or not dt.getTime

isMethod.objectNullOrEmpty = (obj) ->
  _.isEmpty obj or not Object.keys(obj) or Object.keys(obj).length is 0

isMethod.plainObject = (obj) ->
  _.isPlainObject obj

isMethod.object = (obj) ->
  _.isObject obj

isMethod.date = (dt) ->
  _.isDate dt


###
Determines if a value is an instance of a Number and not NaN*
###
isMethod.number = (num) ->
  number = require '../core/number'
  typeof num is 'number' and false is (number.isNaN(num) or false is number.isFinite(num) or number.MAX_VALUE is num or number.MIN_VALUE is num)

###
Determines if a value is convertible to a Number
###
isMethod.numeric = (num) ->
  ret = isMethod.number(num)
  unless ret
    to = require './to'
    nuNum = to.number(num)
    ret = isMethod.number(nuNum)
  ret

isMethod.vendorObject = (obj) ->
  ret = (obj instanceof OJ['?'])
  ret

isMethod.elementInDom = (elementId) ->
  false is isMethod.nullOrEmpty(document.getElementById(elementId))

isMethod.array = (obj) ->
  _.isArray obj

isMethod.string = (str) ->
  _.isString str

isMethod.true = (obj) ->
  obj is true or obj is 'true' or obj is 1 or obj is '1'

isMethod.false = (obj) ->
  obj is false or obj is 'false' or obj is 0 or obj is '0'

isMethod.trueOrFalse = (obj) ->
  isMethod.true obj or isMethod.false obj

isMethod.nullOrEmpty = (obj, checkLength) ->
  _.isEmpty(obj) or _.isUndefined(obj) or _.isNull(obj) or _.isNaN(obj)

isMethod.nullOrUndefined = (obj, checkLength) ->
  _.isUndefined(obj) or _.isNull(obj) or _.isNaN(obj)

isMethod.instanceof = (name, obj) ->
  obj.type is name or obj instanceof name

isMethod.method = (obj) ->
  obj isnt OJ.noop and _.isFunction obj

###
Deprecated. Left for backwards compatibility. Use is.method instead.
###
isMethod.func = isMethod.method

Object.seal isMethod
Object.freeze isMethod

OJ.register 'is', isMethod
module.exports = isMethod

