(->

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
    allowed = false
    switch parent.tagName
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
    allowed
  

  controlPostProcessing = (control) ->
    #OJ.composites.factory node, control.tagName if OJ.is.nullOrEmpty(tagName) or tagName is 'div' or tagName is 'span' or tagName is 'p' or tagName is 'form' or tagName is 'jquery' or tagName is 'div' or tagName is 'ol' or tagName is 'ul' or tagName is 'table' or tagName is 'label' or tagName is 'tabDiv'
    return

  # Extends a OJ Control class with basic DOM methods.
  OJ.nodes.register 'factory', (el, parent = OJ.body, count = 0) ->
    
    init = (node) ->
      count += 1
      control = OJ.dom(node, parent)
      id = parent.getId()
      id += control.tagName + count
      control.attr 'id', id
      controlPostProcessing(control)
      control

    ret = init el
    
    ###
    An <a> node
    ###
    if isChildNodeTypeAllowed el, 'a'
      ret.add 'a', (opts) ->
        nu = OJ.nodes.a opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <b> node
    ###
    if isChildNodeTypeAllowed el, 'b'
      ret.add 'b', (opts) ->
        nu = OJ.nodes.b opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <br> node
    ###
    if isChildNodeTypeAllowed el, 'br'
      ret.add 'br', (opts) ->
        nu = OJ.nodes.br opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <button> node
    ###
    if isChildNodeTypeAllowed el, 'button'
      ret.add 'button', (opts) ->
        nu = OJ.nodes.button opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <div> node
    ###
    if isChildNodeTypeAllowed el, 'div'
      ret.add 'div', (opts) ->
        nu = OJ.nodes.div opts, el, true
        OJ.nodes.factory nu, el, count
    
    ###
    A <fieldset> node
    ###
    if isChildNodeTypeAllowed el, 'fieldset'
      ret.add 'fieldset', (opts) ->
        nu = OJ.nodes.fieldset opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <form> node
    ###
    if isChildNodeTypeAllowed el, 'form'
      ret.add 'form', (opts) ->
        nu = OJ.nodes.form opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    An <img> node
    ###
    if isChildNodeTypeAllowed el, 'img'
      ret.add 'img', (opts) ->
        nu = OJ.nodes.img opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    An <input> node
    ###
    if isChildNodeTypeAllowed el, 'input'
      ret.add 'input', (opts) ->
        nu = OJ.nodes.input opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <label> node
    ###
    if isChildNodeTypeAllowed el, 'label'
      ret.add 'label', (opts) ->
        nu = OJ.nodes.label opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <legend> node
    ###
    if isChildNodeTypeAllowed el, 'legend'
      ret.add 'legend', (opts) ->
        nu = OJ.nodes.legend opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <li> node
    ###
    if isChildNodeTypeAllowed el, 'li'
      ret.add 'li', (opts) ->
        nu = OJ.nodes.li opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    An <ol> node
    ###
    if isChildNodeTypeAllowed el, 'ol'
      ret.add 'ol', (opts) ->
        nu = OJ.nodes.ol opts, el, true
        OJ.nodes.factory nu, el, count
        
    ###
    An <option> node
    ###
    if isChildNodeTypeAllowed el, 'option'
      ret.add 'option', (opts) ->
        nu = OJ.nodes.option opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <p> node
    ###
    if isChildNodeTypeAllowed el, 'p'
      ret.add 'p', (opts) ->
        nu = OJ.nodes.p opts, el, true
        OJ.nodes.factory nu, el, count
        
    ###
    A <select> node
    ###
    if isChildNodeTypeAllowed el, 'select'
      ret.add 'select', (opts) ->
        nu = OJ.nodes.select opts, el, true
        OJ.nodes.factory nu, el, count
        
    ###
    A <span> node
    ###
    if isChildNodeTypeAllowed el, 'span'
      ret.add 'span', (opts) ->
        nu = OJ.nodes.span opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <svg> node
    ###
    if isChildNodeTypeAllowed el, 'svg'
      ret.add 'svg', (opts) ->
        nu = OJ.nodes.svg opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <table> node
    ###
    if isChildNodeTypeAllowed el, 'table'
      ret.add 'table', (opts) ->
        nu = OJ.nodes.table opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <textarea> node
    ###
    if isChildNodeTypeAllowed el, 'textarea'
      ret.add 'textarea', (opts) ->
        nu = OJ.nodes.textarea opts, el, true
        OJ.nodes.factory nu, el, count

    ###
    A <ul> node
    ###
    if isChildNodeTypeAllowed el, 'ul'
      ret.add 'ul', (opts) ->
        nu = OJ.nodes.ul opts, el, true
        OJ.nodes.factory nu, el, count

    ret

  return
)()
