((OJ) ->

  ###
  Create an HTML Element through ThinDom
  ###
  component = (tag, owner, opt) ->
    if not tag.startsWith 'x-' then tag = 'x-' + tag
    ret = OJ.element tag, opt.props, opt.styles
    OJ.nodeFactory ret, owner
    
  OJ.register 'component', component

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
