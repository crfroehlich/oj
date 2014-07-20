OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
require '../elements/input'

inputName = 'buttoninput'

input = (options, owner = OJ.body) ->

  defaults =
    props:
      type: 'button'
      src: ''
      alt: ''
      height: ''
      width: ''
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = OJ.input defaults, owner
  ret

OJ.inputs.register inputName, input
module.exports = input


