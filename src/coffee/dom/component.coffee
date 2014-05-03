((OJ) ->

  ###
  Create an HTML Element through ThinDom
  ###
  component = (options = OJ.object(), owner, tagName) ->
    if not tagName.startsWith 'x-' then tagName = 'x-' + tagName
    widget = OJ.element tagName #, options.props, options.styles, options.events, options.text
    OJ.nodes.factory widget, owner
    ret = widget.div options
    ret.add 'componentName', tagName
    ret
    
  OJ.register 'component', component

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
