((OJ) ->

  ###
  Create an HTML Web Component through ThinDom
  ###
  component = (options = OJ.object(), owner, tagName) ->
    if not tagName.startsWith 'x-' then tagName = 'x-' + tagName
    widget = OJ.element tagName #, options.props, options.styles, options.events, options.text
    OJ.nodes.factory widget, owner
    
    rootNodeType = options.rootNodeType or OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] or 'div'
    
    ret = widget.make rootNodeType, options
    ret.add 'componentName', tagName
    ret.add 'remove', widget.remove
    ret
    
  OJ.register 'component', component

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
