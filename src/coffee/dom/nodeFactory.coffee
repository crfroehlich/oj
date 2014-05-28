((OJ)->

  closed = 'a abbr acronym address applet article aside audio b bdo big blockquote body button canvas caption center cite code colgroup command datalist dd del details dfn dir div dl dt em embed fieldset figcaption figure font footer form frameset h1 h2 h3 h4 h5 h6 head header hgroup html i iframe ins keygen kbd label legend li map mark menu meter nav noframes noscript object ol optgroup option output p pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr tt u ul var video wbr xmp'.split ' '
  open = 'area base br col command css !DOCTYPE embed hr img input keygen link meta param source track wbr'.split ' '
  
  nestableNodeNames = [
    'div' 
    'span' 
    'h1' 
    'h2' 
    'h3' 
    'h4' 
    'h5' 
    'h6' 
    'p' 
    'fieldset' 
    'select' 
    'ol' 
    'ul' 
    'table'
  ]
      
  #This list is not yet exhaustive, just exclude the obvious
  nonNestableNodes = [
    'li'
    'legend'
    'tr'
    'td'
    'option'
    'body'
    'head'
    'source'
    'tbody'
    'tfoot'
    'thead'
    'link'
    'script'
  ]
  
  ###
  Init the body for chaining the first time it's seen
  ###
  initBody = _.once (body) ->
    body.count = 0
    body.root = null
    OJ.dom body, null
    buildNodeForChaining body, 0
    body.isFullyInit = true
    body

  ###
  Fetch a node from the DOM and return an OJ'fied instance of the element
  ###
  OJ.nodes.register 'get', (id, tagName = 'div') ->
    ret = null
    el = document.getElementById id
    if el
      thinEl = OJ.restoreElement tagName, el
    if thinEl
      ret = OJ.nodes.factory thinEl, null, 0
    
    ret
  
  nodeNames = [
    'a'
    'b'
    'br'
    'button'
    'div'
    'em'
    'fieldset'
    'form'
    'h1'
    'h2'
    'h3'
    'h4'
    'h5'
    'h6'
    'i'
    'img'
    'input'
    'label'
    'legend'
    'li'
    'nav'
    'ol'
    'option'
    'p'
    'select'
    'span'
    'strong'
    'sup'
    'svg'
    'table'
    'tbody'
    'td'
    'textarea'
    'th'
    'thead'
    'tr'
    'ul'
  ]
  
  makeAdd = (tagName, el, count) ->
    (opts) ->
      if OJ.nodes[tagName]
        nu = OJ.nodes[tagName] opts, el, true
      else 
        if OJ.components[tagName]
          nu = OJ.components[tagName] opts, el, true
        else if OJ.controls[tagName]
          nu = OJ.controls[tagName] opts, el, true
        else if OJ.inputs[tagName]
          nu = OJ.inputs[tagName] opts, el, true
        else
          nu = OJ.component tagName, el    
      OJ.nodes.factory nu, el, count
  
  buildNodeForChaining = (el, count) ->
    methods = OJ.object()
    el.make = (tagName, opts) ->
      if not methods[tagName]
        methods[tagName] = makeAdd tagName, el, count
      methods[tagName] opts
    el
    
  ###
  Extends a OJ Control class with all the (permitted) methods on the factory
  ###
  OJ.nodes.register 'factory', (el, parent = OJ.body, count = parent.count or 0) ->
    
    initBody OJ.body
    ret = el
    if not el.isFullyInit
      
      count += 1
      if count <= parent.count then count = parent.count + 1
      parent.count = count
      if el.tagName isnt 'body' 
        ret = OJ.dom el, parent
        if not ret.isInDOM
          if OJ.GENERATE_UNIQUE_IDS
            if not ret.getId()
              id = parent.getId()
              id += ret.tagName + count
              ret.attr 'id', id
          parent.append ret[0]
          #We need to bind events after the node is in the DOM
          ret.bindEvents()
          ret.isInDOM = true
        
        buildNodeForChaining ret, count
        ret.isFullyInit = true     
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

