((OJ) ->

  ###
  Create an HTML Element through ThinDom
  ###
  control = (options = OJ.object(), owner, tagName) ->
    if not tagName.startsWith 'y-' then tagName = 'y-' + tagName
    
    rootNodeType = options.rootNodeType or OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] or 'div'
    
    ret = OJ.element rootNodeType, options.props, options.styles, options.events, options.text
    OJ.nodes.factory ret, owner
    
    ret.add 'controlName', tagName
    ret.add 'remove', widget.remove
    
    ret
    
  OJ.register 'control', control

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
