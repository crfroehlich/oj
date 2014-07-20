OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
require '../elements/input'

inputName = 'radio'

input = (options, owner = OJ.body) ->

  defaults =
    props:
      type: inputName
      name: ''
      value: ''
      checked: ''
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = OJ.input defaults, owner
  ret

OJ.inputs.register inputName, input
module.exports = input