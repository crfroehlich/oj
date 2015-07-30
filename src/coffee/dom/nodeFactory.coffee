OJ = require '../oj'
_ = require 'lodash'
ThinDOM = require 'thindom'
Node = require './node'

#closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split ' '
#open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split ' '
#
#nestableNodeNames = [
#  'div'
#  'span'
#  'h1'
#  'h2'
#  'h3'
#  'h4'
#  'h5'
#  'h6'
#  'p'
#  'fieldset'
#  'select'
#  'ol'
#  'ul'
#  'table'
#]
#
##This list is not yet exhaustive, just exclude the obvious
#nonNestableNodes = [
#  'li'
#  'legend'
#  'tr'
#  'td'
#  'option'
#  'body'
#  'head'
#  'source'
#  'tbody'
#  'tfoot'
#  'thead'
#  'link'
#  'script'
#]
#
#nodeNames = [
#  'a'
#  'b'
#  'br'
#  'button'
#  'div'
#  'em'
#  'fieldset'
#  'form'
#  'h1'
#  'h2'
#  'h3'
#  'h4'
#  'h5'
#  'h6'
#  'i'
#  'img'
#  'input'
#  'label'
#  'legend'
#  'li'
#  'nav'
#  'ol'
#  'option'
#  'p'
#  'select'
#  'span'
#  'strong'
#  'sup'
#  'svg'
#  'table'
#  'tbody'
#  'td'
#  'textarea'
#  'th'
#  'thead'
#  'tr'
#  'ul'
#]

class NodeFactory
  
  ojNode: null
  
  @get: (id, tagName = 'div') ->
    ret = null
    el = document.getElementById id
    if el
      thinEl = OJ.restoreElement el, tagName
    if thinEl
      ret = new NodeFactory null, null, null, false, thinEl

    ret
  
  _makeAdd: (tagName, count) ->
    (opts) =>
      method = OJ.nodes[tagName] or OJ.components[tagName] or OJ.controls[tagName] or OJ.inputs[tagName]
      if method
        nu = method opts, @ojNode
      else
        nu = OJ.component null, @ojNode, tagName
      #ret = new NodeFactory nu, @thinNode, count
      nu
  
  _makeUniqueId: (count) ->
    if OJ.GENERATE_UNIQUE_IDS
      count += 1
      if count <= @owner.count then count = @owner.count + 1
      @owner.count = count

      if not @ojNode.getId()
        id = @owner.getId() or ''
        id += @ojNode.tagName + count
        @ojNode.attr 'id', id
    return
  
  _bindEvents: ->
    if @ojNode then _.forOwn @options.events, (val, key) =>
      isMethod = require '../tools/is'
      if isMethod.method val
        callback = (event...) -> val event...
        @ojNode.$.on key, callback
        @ojNode.add key, callback
        null
  
  constructor: (@tag, @options, @owner, @thinNode = null) ->
    if @tag and not @thinNode
      @thinNode = new ThinDOM @tag, @options.props
      @thinNode.add 'tagName', @tag
      @thinNode.css @options.styles
      if @options.text then @thinNode.text @options.text
    
    if @owner
      @make()
  
  addMakeMethod: (count) ->
    methods = OJ.object()
    @ojNode.make = (tagName, opts) =>
      method = methods[tagName]
      if not method
        method = @_makeAdd tagName, @ojNode, count
        methods[tagName] = method
      method opts
    @ojNode

  make: ->

    @ojNode = null

    if @thinNode?.isFullyInit then @ojNode = @thinNode
  
    # 2: If the element has never been initialized, continue
    else
      # 3: As long as the element isn't the body node, continue
      # if el.tagName isnt 'body'
      # 4: Extend the element with standard jQuery API methods
      @ojNode = new Node @thinNode, @owner
      count = (@owner.count + 1) || 1
      # 5: If the node isn't in the DOM, append it to the parent
      # This also accommodates document fragments, which are not in the DOM but are presumed to be sound until ready for manual insertion
      if @thinNode.tagName isnt 'body' and not @thinNode.isInDOM and not @ojNode.isInDOM
        @_makeUniqueId count
        @owner.append @ojNode[0]
        # 6: Bind any defined events after the node is in the DOM
        @_bindEvents()
        
      @thinNode.isInDOM = true
      @ojNode.isInDOM = true

      # 7: Create the all important 'make' method
      @addMakeMethod count

      # 8: Prevent duplicate factory extension by setting is init = true
      @ojNode.isFullyInit = true

      # 9: if the node supports it, call finalize
      finalize = _.once @ojNode.finalize or OJ.noop
      @ojNode.finalize = finalize
      finalize @ojNode
    # 10: Return the extended element
    @ojNode

getNodeFromFactory = (tag, options, owner, isCalledFromFactory, node) ->
  new Node(createElement owner.element, tag or 'div', options)


OJ.register 'nodeFactory', getNodeFromFactory

module.exports = getNodeFromFactory
