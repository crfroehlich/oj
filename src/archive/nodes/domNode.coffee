#global OJ:true 
((OJ, _$) ->
  
  ###
  Create a temporary DOM node
  ###
  OJ.node.register "makeTemp", (id, el, _$el) ->
    'use strict'
    
    #return Object.create(new OJ.metadata.Node());
    new OJ.metadata.Node(id, el, _$el)

  
  ###
  Cast a DOM node into a namespace Node
  ###
  OJ.node.register "make", (id, el, _$el) ->
    'use strict'
    node = new OJ.metadata.Node(id, el, _$el)
    OJ.node.extendNode node

  
  ###
  Extend a Node with helper methods and properties
  ###
  OJ.node.register "extendNode", (NsNode) ->
    'use strict'
    NsInternal = OJ.object()
    throw new TypeError("Cannot chain DOM methods without a Node.")  unless isNode(NsNode)
    
    ###
    Region DOM Extension Methods
    ###
    
    ###
    These are _THE_ mechanisms for building out the DOM.
    NS may later support *pend methods, but for now it's turtles all the way down.
    ###
    NsNode.add "addChild", addChild = (newNode) ->
      NsInternal.buildChildNode newNode

    
    ###
    These are _THE_ mechanisms for building out the DOM.
    NS may later support *pend methods, but for now it's turtles all the way down.
    ###
    NsNode.add "makeChild", makeChild = (html) ->
      NsNode.append html  if OJ.is.string(html)

    NsInternal.buildChildNode = (node) ->
      throw new TypeError("Argument called with invalid node.")  unless isNode(node)
      if NsNode.rootNode
        node.rootNode = NsNode.rootNode
      else if NsNode.parentNode
        node.rootNode = NsNode.parentNode
      else
        node.rootNode = NsNode
      node.parentNode = NsNode
      NsNode.append node["?"]
      NsNode.childNodes.push node
      
      ###
      To complete the loop, the newly appended node must be extended with the node.methods collectiom;
      which, in turn, will extend the node it receives with the elements factory.
      ###
      OJ.node.extendNode node

    
    ###
    End Region DOM Extension Methods
    ###
    
    ###
    Region Vendor Selector Methods
    ###
    
    ###
    NS doesn't need many vendor selectors,
    but when it does they are sequestered on this property to "try" to avoid confusion.
    ###
    el = OJ.object()
    el.add "children", children = (searchTerm, selector) ->
      ret = []
      if isNodeAlive(NsNode)
        _$children = NsNode["?"].children(OJ.to.string(searchTerm), OJ.to.string(selector))
        if _$children
          _$children.each ->
            el = this
            childNode = OJ.nodes.make(el.id, el, _$(el))
            ret.push childNode
            return

      ret

    el.add "filter", filter = (selector) ->
      ret = []
      if selector and isNodeAlive(NsNode)
        _$children = NsNode["?"].filter(selector)
        _$children.each ->
          el = this
          childNode = OJ.nodes.make(el.id, el, _$(el))
          ret.push childNode
          return

      ret

    el.add "find", find = (selector) ->
      ret = []
      if selector and isNodeAlive(NsNode)
        _$children = NsNode["?"].find(selector)
        if _$children.length > 0
          _$children.each ->
            el = this
            childNode = OJ.nodes.make(el.id, el, _$(el))
            ret.push childNode
            return

      ret

    el.add "first", first = ->
      ret = NsNode.childNodes[0] or NsNode.el.children[0]
      ret

    el.add "parent", parent = ->
      ret = {}
      if isNodeAlive(NsNode)
        _$parent = NsNode["?"].parent()
        ret = OJ.node.make(_$parent[0].id, _$parent[0], _$parent)  if false is OJ.is.vendorObject(_$parent) and _$parent.length > 0
      ret

    
    ###
    End Region Vendor Selector Methods
    ###
    
    ###
    Region DOM Manipulation Methods
    ###
    
    ###
    NS implements these wrappers around jQuery methods to provide better chaining on NS Nodes,
    as well as to make it easy to swap out the DOM framework without having to change the interfaces
    ###
    NsNode.add "addClass", addClass = (name) ->
      NsNode["?"].addClass name  if name and isNodeAlive(NsNode)
      NsNode

    NsNode.add "append", append = (object) ->
      ret = NsNode
      NsNode["?"].append object  if OJ.is.vendorObject(object) or OJ.is.string(object)  if object and isNodeAlive(NsNode)
      
      #                       var tmpNode = OJ.node.makeTemp(object[0].id, object[0], object);
      #                       ret = NsInternal.buildChildNode(tmpNode, object);
      ret

    NsNode.add "attr", attr = (name, value) ->
      ret = null
      if name and isNodeAlive(NsNode)
        ret = NsNode
        if OJ.is.plainObject(name)
          NsNode["?"].attr name
        else if arguments.length is 1
          ret = NsNode["?"].attr(name)
        else
          NsNode["?"].attr name, value
      ret

    NsNode.add "bind", bind = (eventName, event) ->
      NsNode["?"].on eventName, event  if eventName and isNodeAlive(NsNode)
      NsNode

    NsNode.add "on", NsNode.bind
    NsNode.add "clickOnEnter", clickOnEnter = (anNsNode) ->
      NsNode["?"].clickOnEnter anNsNode["?"]  if anNsNode and NsInternal.isNodeAlive()
      NsNode

    NsNode.add "css", css = (param1, param2) ->
      ret = NsNode
      if param1 and NsInternal.isNodeAlive()
        if OJ.is.plainObject(param1)
          NsNode["?"].css param1
        else if arguments.length is 1
          ret = NsNode["?"].css(param1)
        else
          NsNode["?"].css param1, param2
      ret

    NsNode.add "data", data = (prop, val) ->
      ret = ""
      if prop and isNodeAlive(NsNode)
        if OJ.is.plainObject(prop)
          setDataProperties NsNode, NsInternal, prop
        else
          switch arguments.length
            when 1
              ret = getDataProp(NsNode, NsInternal, prop)
            when 2
              setDataProp NsNode, NsInternal, prop, val
              ret = NsNode
      ret

    NsNode.add "disable", disable = ->
      if isNodeAlive(NsNode)
        NsInternal.enabled = false
        NsNode.addClass "NsDisabled"
        NsNode.attr "disabled", "disabled"
      NsNode

    NsNode.add "empty", empty = ->
      if isNodeAlive(NsNode)
        NsNode["?"].empty()
        NsNode.childNodes = []
      NsNode

    NsNode.add "enable", enable = ->
      if isNodeAlive(NsNode)
        NsInternal.enabled = true
        NsNode.removeClass "NsDisabled"
        NsNode.removeAttr "disabled"
      NsNode

    NsNode.add "hide", hide = ->
      if isNodeAlive(NsNode)
        NsNode.addClass "NsHidden"
        NsNode["?"].hide()
      NsNode

    NsNode.add "prop", prop = (name, value) ->
      ret = null
      if name and isNodeAlive(NsNode)
        ret = NsNode
        if OJ.is.plainObject(name)
          NsNode["?"].prop name
        else if arguments.length is 1
          ret = NsNode["?"].prop(name)
        else
          NsNode["?"].prop name, value
      ret

    NsNode.add "remove", remove = ->
      if NsNode and NsNode["?"]
        NsNode["?"].remove()
        NsNode.childNodes = []
        
        #This will update the internal reference to the node,
        #which will allow isNodeAlive() to work as expected;
        #however, it won't delete outstanding references to the Node.
        #But that's OK. The GC will clean-up just fine.
        NsNode = null
      null

    NsNode.add "removeClass", removeClass = (name) ->
      NsNode["?"].removeClass name  if name and isNodeAlive(NsNode)
      NsNode

    NsNode.add "removeProp", removeProp = (name) ->
      NsNode["?"].removeProp name  if name and isNodeAlive(NsNode)
      NsNode

    NsNode.add "removeAttr", removeAttr = (name) ->
      NsNode["?"].removeAttr name  if name and isNodeAlive(NsNode)
      NsNode

    NsNode.add "show", show = ->
      if isNodeAlive(NsNode)
        NsNode.removeClass "NsHidden"
        NsNode["?"].show()
      NsNode

    NsNode.add "text", text = (text) ->
      if text and isNodeAlive(NsNode)
        if arguments.length is 1 and false is OJ.is.nullOrUndefined(text)
          NsNode["?"].text text
          NsNode
        else
          OJ.to.string NsNode["?"].text()

    NsNode.add "toggle", toggle = ->
      NsNode["?"].toggle()  if isNodeAlive(NsNode)
      NsNode

    NsNode.add "toggleEnable", toggleEnable = ->
      if isNodeAlive(NsNode)
        if NsInternal.enabled
          NsNode.disable()
        else
          NsNode.enable()
      NsNode

    NsNode.add "trigger", trigger = (eventName, eventOpts) ->
      NsNode["?"].trigger eventName, eventOpts  if eventName and isNodeAlive(NsNode)
      NsNode

    NsNode.add "unbind", unbind = (eventName, event) ->
      NsNode["?"].off eventName, event  if eventName and isNodeAlive(NsNode)
      NsNode

    NsNode.add "off", NsNode.unbind
    
    ###
    Region DOM Manipulation Methods
    ###
    
    #Finally! Return something.
    OJ.node.factory NsNode

  
  ###
  Private, internal methods
  ###
  isNode = (nodeCandidate) ->
    nodeCandidate and OJ.is["instanceof"](OJ.metadata.Node, nodeCandidate)

  
  #   var addRootToNode = function (NsNode) {
  #       'use strict';
  #       var retNode = null;
  #       if (isNode(NsNode) && !(isNode(NsNode.rootNode))) {
  #
  #           if (NsNode.tagName !== 'BODY') {
  #               if (!NsNode.rootNode || !NsNode.rootNode[0]) {
  #                   if (!NsNode.parentNode || !NsNode.parentNode[0]) {
  #                       //Without valid NS parents, the only logical root node is the body node
  #                       retNode = OJ.node.make('body', document.getElementsByTagName('body')[0], OJ.to.vendorDomObject('body'));
  #                   }
  #                   else {
  #                       var getRoot = function (parent) {
  #                           if (isNode(parent) && isNode(parent.parentNode)) {
  #
  #                               retNode = parent.parentNode;
  #                               if (isNode(retNode.parentNode) && retNode.parentNode.tagName.toLowerCase() !== 'body') {
  #                                   retNode = getRoot(retNode);
  #                               }
  #                           }
  #                           return retNode;
  #                       };
  #                       retNode = getRoot(NsNode);
  #                   }
  #               }
  #           }
  #           NsNode.rootNode = OJ.node.methods(retNode);
  #       }
  #   };
  #
  #   var addParentToNode = function (NsNode) {
  #       'use strict';
  #       if (isNode(NsNode) && NsNode.tagName !== 'body' && !(isNode(NsNode.parentNode))) {
  #           if (NsNode[0].parentNode.tagName.toLowerCase() !== 'body') {
  #               NsNode.parentNode = OJ.node.make(NsNode[0].parentNode.id, NsNode[0].parentNode);
  #           }
  #       }
  #   };
  
  ###
  Whether or no we have removed the node internally.
  This doesn't actually test the DOM,
  only our in-memory representation of the DOM.
  ###
  isNodeAlive = (NsNode) ->
    false is OJ.is.nullOrEmpty(NsNode) and isNode(NsNode)

  
  #Define some internal data methods
  getDataProp = (NsNode, dataObj, propName) ->
    ret = null
    if isNodeAlive(NsNode) and false is OJ.is.stringNullOrEmpty(propName)
      ret = NsNode[0].dataset.propName  if NsNode[0] and NsNode[0].dataset and NsNode[0].dataset[propName]
      ret = dataObj.data[propName] or NsNode["?"].data(propName) or OJ.localStorage.getItem(propName + "_control_data_ " + NsNode.getId())  if OJ.is.stringNullOrEmpty(ret)
    ret

  setDataProp = (NsNode, dataObj, propName, value) ->
    ret = null
    if isNodeAlive() and false is OJ.is.stringNullOrEmpty(propName)
      ret = value
      if NsNode[0] and NsNode[0].dataset
        NsNode[0].dataset[propName] = value
        dataObj.data[propName] = value
      else
        dataObj.data[propName] = value
        NsNode["?"].data propName, value
    ret

  setDataProperties = (NsNode, dataObj, obj) ->
    if obj and Object.keys(obj)
      OJ.each (key, val) ->
        setDataProp NsNode, dataObj, key, val
        return

    return

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ, ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ["?"]
