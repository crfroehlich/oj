# # component

((OJ) ->

  # Create an HTML Web Component through ThinDom
  # * `options` an object representing the standard options to be passed into the component
  # ** `rootNodeType`: the tag name of the root node to create, default = 'div'
  # ** `props`: an object representing the DOM attributes to append to the root node
  # ** `styles`: an object representing the CSS attributes to append to the root node
  # ** `events`: an object representing the named DOM events (and corresponding callback methods) to bind to the root node 
  # * `owner` the parent to which the component node will be appended
  # * `tagName` the name of of the component, which will always be prefixed with 'x-'
  component = (options = OJ.object(), owner, tagName) ->
  
    if not tagName.startsWith 'x-' then tagName = 'x-' + tagName
    # web components are really just ordinary OJ (element)[element.html]'s with a special name.
    # Until HTML Web Components are fully supported (and OJ is refactored accordingly), the element will be treated as an unknown element.
    # In most cases, the default behavior of the browser is acceptable (see also [HTML Semantics](http://diveintohtml5.info/semantics.html)), but
    # in some cases this is problematic (firstly, because these elements are always rendered inline).
    # In such conditions, the [controls](controls.html) class and name space is better suited to classes which require complete control (e.g. [icon](icon.html)).
    widget = OJ.element tagName #, options.props, options.styles, options.events, options.text
    OJ.nodes.factory widget, owner
    
    # Since the behavior of styling is not well controlled/controllable on unknown elements, it is necessary to create a root node for the component.
    # In most cases, [div](div.html) is perfectly acceptable, but this is configurable at the name space level or at runtime. 
    rootNodeType = options.rootNodeType or OJ['DEFAULT_COMPONENT_ROOT_NODETYPE'] or 'div'
    
    # `ret` is the the instance of the rootNodeType, not the `widget` wrapped in this closure
    ret = widget.make rootNodeType, options
    
    # for convenience and debugging, persist the tagName
    ret.add 'componentName', tagName
    
    # `remove` does, however, behave as expected by removing `widget`
    ret.add 'remove', widget.remove
    ret
    
  OJ.register 'component', component

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
