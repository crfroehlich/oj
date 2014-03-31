((OJ)->

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
        allowed = _.contains nestableNodeNames, tagName
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
  

  controlPostProcessing = (parent, child, count) ->
    if _.contains ['div','span','td','p','body','form'], parent.tagName
    OJ.each OJ.components.members, (val) ->
      extendChain val, parent, child, count
    return

  ###
  Extend the chain, if permitted
  ###
  extendChain = (tagName, parent, child, count) ->
    if isChildNodeTypeAllowed parent, tagName
      child.add tagName, (opts) ->
        if OJ.nodes[tagName]
          nu = OJ.nodes[tagName] opts, parent, true
        else
          nu = OJ.custom tagName, parent
        #parent.append child  
        OJ.nodes.factory nu, parent, count

  # Extends a OJ Control class with basic DOM methods.
  OJ.nodes.register 'factory', (el, parent = OJ.body, count = parent.count or 0) ->
    
    init = (node) ->
      count += 1
      if el.tagName is 'body'
        el.count = count
        parent = null
        el.root = null
        control = OJ.dom node, parent
      else
        parent.count = count
        control = OJ.dom node, parent
        unless node.id
          id = parent.getId()
          id += control.tagName + count
          control.attr 'id', id
        parent.append control[0]  
      
      controlPostProcessing el, ret, count
      control

    ret = init el
    
    extendChain 'a', el, ret, count
    extendChain 'b', el, ret, count
    extendChain 'br', el, ret, count
    extendChain 'button', el, ret, count
    extendChain 'div', el, ret, count
    extendChain 'fieldset', el, ret, count
    extendChain 'form', el, ret, count
    extendChain 'img', el, ret, count
    extendChain 'input', el, ret, count
    extendChain 'label', el, ret, count
    extendChain 'legend', el, ret, count
    extendChain 'li', el, ret, count
    extendChain 'ol', el, ret, count
    extendChain 'option', el, ret, count
    extendChain 'p', el, ret, count
    extendChain 'select', el, ret, count
    extendChain 'span', el, ret, count
    extendChain 'svg', el, ret, count
    extendChain 'table', el, ret, count
    extendChain 'textarea', el, ret, count
    extendChain 'ul', el, ret, count
    
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

