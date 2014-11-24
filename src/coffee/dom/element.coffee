OJ = require '../oj'
$ = require 'jquery'
_ = require 'lodash'

require 'thindom'

# # element

element = 
  ###
    Bind all event handlers
  ###
  bindEvents: (el, events) ->
    if el then _.forOwn events, (val, key) ->
      isMethod = require '../tools/is'
      if isMethod.method val
        callback = (event...) -> val event...
        el.$.on key, callback
        el.add key, callback
        null

  ###
  Finalize the ThimDOM node
  ###
  finalize: (ret, tag, props, styles, events, text) ->
    ret.add 'tagName', tag
    ret.css styles
    if text then ret.text text
    ret.add '$', $(ret.get())
    ret.add '0', ret.get()

    ret.add 'bindEvents', _.once () -> element.bindEvents ret, events
    ret

  # ## restoreElement
  ###
  Restore an HTML Element through ThinDom
  ###
  restoreElement: (el, tag = el.nodeName) ->
    nodeFactory = require './nodeFactory'
    ret = new ThinDOM null, null, el
    element.finalize ret, tag
    ret.add 'isInDOM', true
    nodeFactory.make ret
    ret

  # ## element
  ###
  Create an HTML Element through ThinDom
  ###
  element: (tag, options, owner, isCalledFromFactory = false) ->
    ret = new ThinDOM tag, options.props
    element.finalize ret, tag, options.props, options.styles, options.events, options.text
    if owner and false is isCalledFromFactory
      nodeFactory = require './nodeFactory'
      nodeFactory.make ret, owner
    ret

OJ.register 'restoreElement', element.restoreElement
OJ.register 'element', element.element

module.exports = element