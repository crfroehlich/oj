OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
input = require '../dom/input'

inputName = 'imageinput'

inpt = (options, owner = require('../dom/body')) ->

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

  ret = input defaults, owner
  ret

OJ.inputs.register inputName, inpt
module.exports = inpt
