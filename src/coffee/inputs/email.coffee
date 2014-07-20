OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
require '../elements/input'

inputName = 'email'

input = (options, owner = OJ.body) ->

  defaults =
    props:
      type: inputName
      multiple: ''
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = OJ.input defaults, owner
  ret

OJ.inputs.register inputName, input
module.exports = input