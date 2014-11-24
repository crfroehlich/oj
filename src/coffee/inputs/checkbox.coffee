OJ = require '../oj'
obj = require '../core/object'
input = require '../dom/input'

inputName = 'checkbox'

inpt = (options, owner = OJ.body) ->

  defaults =
    checked: false
    indeterminate: false
    props:
      type: inputName
    styles: {}
    events:
      click: OJ.noop

  obj.extend defaults, options, true

  ret = input defaults, owner
  if defaults.checked
    ret.attr 'checked', true
  else if defaults.indeterminate
    ret.attr 'indeterminate', true

  ret

OJ.inputs.register inputName, inpt
module.exports = inpt