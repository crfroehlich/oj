OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'

class IS

  @bool: (boolean) ->
    _.isBoolean boolean

  @arrayNullOrEmpty: (arr) ->
    _.isEmpty arr

  @stringNullOrEmpty: (str) ->
    str and (not str.length or str.length is 0 or not str.trim or not str.trim())

  @numberNullOrEmpty: (num) ->
    not num or isNaN(num) or not num.toPrecision

  @dateNullOrEmpty: (dt) ->
    not dt or not dt.getTime

  @objectNullOrEmpty: (obj) ->
    _.isEmpty obj or not Object.keys(obj) or Object.keys(obj).length is 0

  @plainObject: (obj) ->
    _.isPlainObject obj

  @object: (obj) ->
    _.isObject obj

  @date: (dt) ->
    _.isDate dt


  ###
  Determines if a value is an instance of a Number and not NaN*
  ###
  @number: (num) ->
    number = require '../core/number'
    typeof num is 'number' and false is (number.isNaN(num) or false is number.isFinite(num) or number.MAX_VALUE is num or number.MIN_VALUE is num)

  ###
  Determines if a value is convertible to a Number
  ###
  @numeric: (num) ->
    ret = @number(num)
    unless ret
      to = require './to'
      nuNum = to.number(num)
      ret = @number(nuNum)
    ret

  @elementInDom: (elementId) ->
    false is @nullOrEmpty(document.getElementById(elementId))

  @array: (obj) ->
    _.isArray obj

  @string: (str) ->
    _.isString str

  @true: (obj) ->
    obj is true or obj is 'true' or obj is 1 or obj is '1'

  @false: (obj) ->
    obj is false or obj is 'false' or obj is 0 or obj is '0'

  @trueOrFalse: (obj) ->
    @true obj or @false obj

  @nullOrEmpty: (obj, checkLength) ->
    _.isEmpty(obj) or _.isUndefined(obj) or _.isNull(obj) or _.isNaN(obj)

  @nullOrUndefined: (obj, checkLength) ->
    _.isUndefined(obj) or _.isNull(obj) or _.isNaN(obj)

  @instanceof: (name, obj) ->
    obj.type is name or obj instanceof name

  @method: (obj) ->
    obj isnt OJ.noop and _.isFunction obj

  ###
  Deprecated. Left for backwards compatibility. Use is.method instead.
  ###
  @func = @method



OJ.register 'is', IS
module.exports = IS

