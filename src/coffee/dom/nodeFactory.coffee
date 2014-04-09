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
    
  isChildNodeTypeAllowed = (parent, tagName) ->
    switch parent.tagName
      when 'a'
        allowed = false is _.contains nonNestableNodes, tagName
      when 'body'
        allowed = (tagName.startsWith 'x-') or _.contains nestableNodeNames, tagName
      when 'div'
        allowed =  false is _.contains nonNestableNodes, tagName
      when 'form'
        allowed = false is _.contains nonNestableNodes, tagName
      when 'label'
        allowed = false is _.contains nonNestableNodes, tagName
      when 'legend'
        allowed = false
      when 'fieldset'
        allowed = tagName is 'legend' or false is _.contains nonNestableNodes, tagName
      when 'ol'
        allowed = tagName is 'li'
      when 'ul'
        allowed = tagName is 'li'
      when 'li'
        allowed = false is _.contains nonNestableNodes, tagName
      when 'table'
        allowed = tagName is 'td' or tagName is 'tr' or tagName is 'tbody'
      when 'td'
        allowed = false is _.contains nonNestableNodes, tagName
      when 'select'
        allowed = tagName is 'option'
      when 'option'
        allowed = false
      when 'span'
        allowed = false is _.contains nonNestableNodes, tagName  
      when 'p'
        allowed = false is _.contains nonNestableNodes, tagName 
      else
        if parent.tagName.startsWith 'x-'
          allowed = false is _.contains nonNestableNodes, tagName
        else
          allowed = false 
    allowed
  
  ###
  Add components to the chain, if permitted
  @tagName is the web component compatible node name (e.g. x-widget)
  @className is the internal, developer friendly name (e.g widget)
  ###
  addComponents = (tagName, parent, count, className) ->
    if isChildNodeTypeAllowed parent, tagName
      parent.add className, (opts) ->
        if OJ.components[className]
          nu = OJ.components[className] opts, parent, true
        else 
          nu = OJ.component className, parent
        nu

  ###
  Determine which components to add to chain, if any
  ###
  controlPostProcessing = (parent, count) ->
    if _.contains ['div','span','td','p','body','form', 'li'], parent.tagName
      OJ.each OJ.components.members, (className, tagName) ->
        addComponents tagName, parent, count, className
    return

  ###
  Extend the chain, if permitted
  ###
  extendChain = (tagName, parent, count) ->
    if isChildNodeTypeAllowed parent, tagName
      parent.add tagName, (opts) ->
        if OJ.nodes[tagName]
          nu = OJ.nodes[tagName] opts, parent, true
        else if (_.contains closed, tagName) or _.contains open, tagName
          nu = OJ.element tagName, parent
        OJ.nodes.factory nu, parent, count

  ###
  Init the body for chaining the first time it's seen
  ###
  initBody = _.once (body) ->
    body.count = 0
    OJ.nodes.factory body, null, 0
  
  isBodyDefined = false

  # Extends a OJ Control class with basic DOM methods.
  OJ.nodes.register 'factory', (el, parent = OJ.body, count = parent.count or 0) ->
    
    if not el.isFullyInit
      initBody OJ.body
    
      count += 1
      if el.tagName is 'body' and not isBodyDefined
        parent = null
        el.root = null
        ret = OJ.dom el, null
        controlPostProcessing ret, 0
        isBodyDefined = true 
      else
        parent.count = count
        ret = OJ.dom el, parent
        if not ret.isInDOM
          if OJ.GENERATE_UNIQUE_IDS
            unless ret.getId()
              id = parent.getId()
              id += ret.tagName + count
              ret.attr 'id', id
          parent.append ret[0]
          ret.isInDOM = true
        controlPostProcessing ret, count
      
      ret.isFullyInit = true      
    
      extendChain 'a', ret, count
      extendChain 'b', ret, count
      extendChain 'br', ret, count
      extendChain 'button', ret, count
      extendChain 'div', ret, count
      extendChain 'em', ret, count
      extendChain 'fieldset', ret, count
      extendChain 'form', ret, count
      extendChain 'h1', ret, count
      extendChain 'h2', ret, count
      extendChain 'h3', ret, count
      extendChain 'h4', ret, count
      extendChain 'h5', ret, count
      extendChain 'h6', ret, count
      extendChain 'i', ret, count
      extendChain 'img', ret, count
      extendChain 'input', ret, count
      extendChain 'label', ret, count
      extendChain 'legend', ret, count
      extendChain 'li', ret, count
      extendChain 'nav', ret, count
      extendChain 'ol', ret, count
      extendChain 'option', ret, count
      extendChain 'p', ret, count
      extendChain 'select', ret, count
      extendChain 'span', ret, count
      extendChain 'strong', ret, count
      extendChain 'sup', ret, count
      extendChain 'svg', ret, count
      extendChain 'table', ret, count
      extendChain 'tbody', ret, count
      extendChain 'td', ret, count
      extendChain 'textarea', ret, count
      extendChain 'thead', ret, count
      extendChain 'tr', ret, count
      extendChain 'ul', ret, count
    
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

