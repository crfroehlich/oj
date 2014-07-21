OJ = require '../oj'

###
Add a property to an object

###
property = (obj, name, value) ->
  throw new Error 'Cannot define a property without an Object.'  unless obj
  throw new Error 'Cannot create a property without a valid property name.'  unless name
  obj[name] = value
  obj

OJ.register 'property', property
module.exports = property
