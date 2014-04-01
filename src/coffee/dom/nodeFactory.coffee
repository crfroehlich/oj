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
  

  controlPostProcessing = (parent, count) ->
    if _.contains ['div','span','td','p','body','form'], parent.tagName
      OJ.each OJ.components.members, (val) ->
        extendChain val, parent, count
    return

  ###
  Extend the chain, if permitted
  ###
  extendChain = (tagName, parent, count) ->
    if isChildNodeTypeAllowed parent, tagName
      parent.add tagName, (opts) ->
        if OJ.nodes[tagName]
          nu = OJ.nodes[tagName] opts, parent, true
        else
          nu = OJ.custom tagName, parent
        #parent.append child  
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
      unless el.id
        id = parent.getId()
        id += ret.tagName + count
        ret.attr 'id', id
      parent.append ret[0]
      controlPostProcessing ret, count  
    
    extendChain 'a', ret, count
    extendChain 'b', ret, count
    extendChain 'br', ret, count
    extendChain 'button', ret, count
    extendChain 'div', ret, count
    extendChain 'fieldset', ret, count
    extendChain 'form', ret, count
    extendChain 'img', ret, count
    extendChain 'input', ret, count
    extendChain 'label', ret, count
    extendChain 'legend', ret, count
    extendChain 'li', ret, count
    extendChain 'ol', ret, count
    extendChain 'option', ret, count
    extendChain 'p', ret, count
    extendChain 'select', ret, count
    extendChain 'span', ret, count
    extendChain 'svg', ret, count
    extendChain 'table', ret, count
    extendChain 'textarea', ret, count
    extendChain 'ul', ret, count
    
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ

