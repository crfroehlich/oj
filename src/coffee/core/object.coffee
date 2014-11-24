OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'
isMethod = require '../tools/is'
property = require './property'

func = require './function'

# # object

retObj = 

  # ## [OJ](oj.html).object
  # create an object with helper `add` and `each` methods.
  object: (obj = {}) ->
    
    ###
    Add a property to the object and return it
    ###
    obj.add = (name, val) ->
      property obj, name, val
      obj

    obj.add 'each', (callback) ->
      each = require '../tools/each'
      each obj, (val, key) ->
        if key isnt 'each' and key isnt 'add'
          callback val, key

    obj


  # ## [OJ](oj.html).isInstanceOf
  # determines is a thing is an instance of a Thing, assuming the things were all created in OJ
  isInstanceOf: (name, obj) ->
    to = require '../tools/to'
    retObj.contains(name, obj) and to.bool(obj[name])

  # ## [OJ](oj.html).contains
  # true if the `object` contains the value
  contains: (object, index) ->
    ret = false
    if object
      ret = _.contains object, index
    ret

  # ## [OJ](oj.html).compare
  # compare two objects/arrays/values for strict equality
  compare: (obj1, obj2) ->
    _.isEqual obj1, obj2

  # ## [OJ](oj.html).clone
  # copy all of the values (recursively) from one object to another.
  clone: (data) ->
    _.cloneDeep data true

  # ## [OJ](oj.html).serialize
  # Convert an object to a JSON representation of the object
  serialize: (data) ->
    ret = ''
    func.tryExec ->
      ret = JSON.stringify(data)
      return
    ret or ''

  # ## [OJ](oj.html).deserialize
  # Convert a JSON string to an object
  deserialize: (data) ->
    ret = {}
    if data
      func.tryExec ->
        ret = $.parseJSON(data)
        return

      ret = {}  if isMethod.nullOrEmpty(ret)
    ret

  # ## [OJ](oj.html).params
  # Convert an object to a delimited list of parameters (normally query-string parameters)
  params: (data, delimiter = '&') ->
    ret = ''
    if delimiter is '&'
      func.tryExec ->
        ret = $.param(data)
        return

    else
      each = require '../tools/each'
      each data, (val, key) ->
        ret += delimiter  if ret.length > 0
        ret += key + '=' + val
        return

    to.string ret

  # ## [OJ](oj.html).extend
  # copy the properties of one object to another object
  extend: (destObj, srcObj, deepCopy = false) ->
    ret = destObj or {}
    if deepCopy is true
      ret = $.extend(deepCopy, ret, srcObj)
    else
      ret = $.extend(ret, srcObj)
    ret


OJ.register 'object', retObj.object
OJ.register 'isInstanceOf', retObj.isInstanceOf
OJ.register 'contains', retObj.contains
OJ.register 'compare', retObj.compare
OJ.register 'clone', retObj.clone
OJ.register 'serialize', retObj.serialize
OJ.register 'deserialize', retObj.deserialize
OJ.register 'params', retObj.params
OJ.register 'extend', retObj.extend

module.exports = retObj