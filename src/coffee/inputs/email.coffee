OJ = require '../oj'
require '../core/object'
require '../dom/nodeFactory'
input = require '../dom/input'

inputName = 'email'

inpt = (options, owner = require('../dom/body')) ->

  defaults =
    props:
      type: inputName
      multiple: ''
    styles: {}
    events:
      click: OJ.noop

  OJ.extend defaults, options, true

  ret = input defaults, owner
  ret

OJ.inputs.register inputName, inpt
module.exports = inpt
