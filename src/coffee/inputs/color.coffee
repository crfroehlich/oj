OJ = require '../oj'
obj = require '../core/object'
input = require '../dom/input'

inputName = 'color'

inpt = (options, owner = OJ.body) ->

  defaults =
    props:
      type: inputName
    styles: {}
    events:
      click: OJ.noop

  obj.extend defaults, options, true

  ret = input defaults, owner
  ret

OJ.inputs.register inputName, inpt
module.exports = inpt