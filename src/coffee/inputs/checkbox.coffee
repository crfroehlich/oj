OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
require '../elements/input'

inputName = 'checkbox'

input = (options, owner = OJ.body) ->

  defaults =
    checked: false
    indeterminate: false
    props:
      type: inputName
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = OJ.input defaults, owner
  if defaults.checked
    ret.attr 'checked', true
  else if defaults.indeterminate
    ret.attr 'indeterminate', true

  ret

OJ.inputs.register inputName, input
module.exports = input