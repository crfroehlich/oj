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
  
  isChildNodeTypeAllowedHashtable = {}
  
  OJ.nodes.register 'childNodeTypeHashtable', isChildNodeTypeAllowedHashtable            
                                      
  isChildNodeTypeAllowed = (parent, tagName) ->
    if not isChildNodeTypeAllowedHashtable[parent.tagName]
      isChildNodeTypeAllowedHashtable[parent.tagName] = {}
    
    if true is isChildNodeTypeAllowedHashtable[parent.tagName][tagName] or false is isChildNodeTypeAllowedHashtable[parent.tagName][tagName]
      allowed = isChildNodeTypeAllowedHashtable[parent.tagName][tagName]
    else
      if -1 isnt ['a','div','form','label', 'li', 'td', 'span', 'p', 'nav', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].indexOf parent.tagName
        isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = false is _.contains nonNestableNodes, tagName
      else   
        switch parent.tagName
          when 'body'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = (tagName.startsWith 'x-') or _.contains nestableNodeNames, tagName
          when 'fieldset'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'legend' or false is _.contains nonNestableNodes, tagName
          when 'legend'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = false
          when 'ol'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'li'
          when 'option'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = false
          when 'select'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'option'
          when 'table'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'tr' or tagName is 'tbody' or tagName is 'thead'
          when 'thead'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'tr'
          when 'tbody'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'tr'  
          when 'tr'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'td' or tagName is 'th'
          when 'ul'
            isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = tagName is 'li'
          else
            if parent.tagName.startsWith 'x-'
              isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = false is _.contains nonNestableNodes, tagName
            else
              isChildNodeTypeAllowedHashtable[parent.tagName][tagName] = false 
      allowed = isChildNodeTypeAllowedHashtable[parent.tagName][tagName]
    allowed
  
  ###
  Pre-calculate permitted childNode relationships
  ###
  _.each closed, (closedNode) ->
    _.each open, (openNode) ->
      _.each OJ.components.members, (component, componentKey) ->
        isChildNodeTypeAllowed { tagName: closedNode }, openNode    
        isChildNodeTypeAllowed { tagName: openNode }, closedNode    
        isChildNodeTypeAllowed { tagName: openNode }, componentKey    
        isChildNodeTypeAllowed { tagName: closedNode }, componentKey
        return
     return    
  
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

  nodesPermittedToHouseComponents = ['div','span','td','p','body','form', 'li', 'a']
  OJ.nodes.register 'permittedToHouseComponents', nodesPermittedToHouseComponents
  
  ###
  Determine which components to add to chain, if any
  ###
  controlPostProcessing = (parent, count) ->
    if _.contains nodesPermittedToHouseComponents, parent.tagName
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
    body.root = null
    OJ.dom body, null
    controlPostProcessing body, 0
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
  
  
  buildNodeForChaining = (el, count) ->
    extendChain 'a', el, count
    extendChain 'b', el, count
    extendChain 'br', el, count
    extendChain 'button', el, count
    extendChain 'div', el, count
    extendChain 'em', el, count
    extendChain 'fieldset', el, count
    extendChain 'form', el, count
    extendChain 'h1', el, count
    extendChain 'h2', el, count
    extendChain 'h3', el, count
    extendChain 'h4', el, count
    extendChain 'h5', el, count
    extendChain 'h6', el, count
    extendChain 'i', el, count
    extendChain 'img', el, count
    extendChain 'input', el, count
    extendChain 'label', el, count
    extendChain 'legend', el, count
    extendChain 'li', el, count
    extendChain 'nav', el, count
    extendChain 'ol', el, count
    extendChain 'option', el, count
    extendChain 'p', el, count
    extendChain 'select', el, count
    extendChain 'span', el, count
    extendChain 'strong', el, count
    extendChain 'sup', el, count
    extendChain 'svg', el, count
    extendChain 'table', el, count
    extendChain 'tbody', el, count
    extendChain 'td', el, count
    extendChain 'textarea', el, count
    extendChain 'th', el, count
    extendChain 'thead', el, count
    extendChain 'tr', el, count
    extendChain 'ul', el, count
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
          ret.isInDOM = true
        
        controlPostProcessing ret, count
        buildNodeForChaining ret, count
        ret.isFullyInit = true     
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

