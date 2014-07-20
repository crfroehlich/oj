OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
require '../elements/input'

inputName = 'imageinput'

input = (options, owner = OJ.body) ->

  defaults =
    props:
      type: 'image'
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