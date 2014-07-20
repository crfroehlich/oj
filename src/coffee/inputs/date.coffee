OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
require '../elements/input'

inputName = 'date'

input = (options, owner = OJ.body) ->

  defaults =
    props:
      type: inputName
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = OJ.input defaults, owner
  ret

OJ.inputs.register inputName, input
module.exports = input