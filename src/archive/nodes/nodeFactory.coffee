#global OJ:true
((OJ) ->
  OJ.makeSubNameSpace "elements"
  OJ.node.register "factory", (NsNode) ->
    'use strict'
    #|| !NsNode.isValid()) {
    throw new Error("Cannot make an OJ factory without an OJ Node!")  unless NsNode
    NsInternal = count: 0
    
    nestableNodeNames = [
      "div" 
      "span" 
      "h1" 
      "h2" 
      "h3" 
      "h4" 
      "h5" 
      "h6" 
      "p" 
      "fieldset" 
      "select" 
      "ol" 
      "ul" 
      "table"
    ]
      
    #This list is not yet exhaustive, just exclude the obvious
    nonNestableNodes = [
      "li"
      "legend"
      "tr"
      "td"
      "option"
      "body"
      "head"
      "source"
      "tbody"
      "tfoot"
      "thead"
      "link"
      "script"
    ]
    
    isChildNodeTypeAllowed = (->
      (tagName) ->
        allowed = false
        switch NsNode.tagName
          when "body"
            allowed = _.contains nestableNodeNames tagName
          when "div"
            allowed =  false is _.contains nonNestableNodes tagName
          when "form"
            allowed = false is _.contains nonNestableNodes tagName
          when "label"
            allowed = false is _.contains nonNestableNodes tagName
          when "legend"
            allowed = NsNode.parent.tagName is "fieldset"
          when "fieldset"
            allowed = tagName is "legend" or false is _.contains nonNestableNodes tagName
          when "ol"
            allowed = tagName is "li"
          when "ul"
            allowed = tagName is "li"
          when "li"
            allowed = (NsNode.parent.tagName is "ol" or NsNode.parent.tagName is "ul") and false is _.contains nonNestableNodes tagName
          when "table"
            allowed = tagName is "td" or tagName is "tr" or tagName is "tbody"
          when "td"
            allowed = false is _.contains nonNestableNodes tagName
        allowed
    )()
    
    prepId = (options, childTagName) ->
      options = options or Object.create(null)
      NsInternal.count += 1
      id = NsNode.id
      id += options.name  if options.name
      id += NsNode.tagName + OJ.to.string(childTagName) + NsInternal.count
      Object.defineProperty options, "id",
        value: id

      options

    if isChildNodeTypeAllowed("a")
      Object.defineProperty NsNode, "a",
        value: (opts) ->
          childNode = OJ.elements.a(NsNode, prepId(opts, "a"))
          childNode

    if isChildNodeTypeAllowed("b")
      Object.defineProperty NsNode, "b",
        value: (opts) ->
          childNode = OJ.elements.b(NsNode, prepId(opts))
          childNode

    if isChildNodeTypeAllowed("br")
      Object.defineProperty NsNode, "br",
        value: (opts) ->
          childNode = OJ.elements.br(NsNode, prepId(opts))
          childNode

    if isChildNodeTypeAllowed("button")
      Object.defineProperty NsNode, "button",
        value: (opts) ->
          childNode = OJ.elements.button(NsNode, prepId(opts, "button"))
          childNode

    if isChildNodeTypeAllowed("div")
      Object.defineProperty NsNode, "div",
        value: (opts) ->
          childNode = OJ.elements.div(NsNode, prepId(opts, "div"))
          childNode

    if isChildNodeTypeAllowed("fieldSet")
      Object.defineProperty NsNode, "fieldSet",
        value: (opts) ->
          childNode = OJ.elements.fieldSet(NsNode, prepId(opts, "fieldSet"))
          childNode

    if isChildNodeTypeAllowed("form")
      Object.defineProperty NsNode, "form",
        value: (opts) ->
          childNode = OJ.elements.form(NsNode, prepId(opts, "form"))
          childNode

    if isChildNodeTypeAllowed("img")
      Object.defineProperty NsNode, "img",
        value: (opts) ->
          childNode = OJ.elements.img(NsNode, prepId(opts, "img"))
          childNode

    if isChildNodeTypeAllowed("input")
      Object.defineProperty NsNode, "input",
        value: (opts) ->
          childNode = OJ.elements.input(NsNode, prepId(opts, "input"))
          childNode

    if isChildNodeTypeAllowed("label")
      Object.defineProperty NsNode, "label",
        value: (opts) ->
          childNode = OJ.elements.label(NsNode, prepId(opts, "label"))
          childNode

    if isChildNodeTypeAllowed("li")
      Object.defineProperty NsNode, "li",
        value: (opts) ->
          childNode = OJ.elements.li(NsNode, prepId(opts, "li"))
          childNode

    if isChildNodeTypeAllowed("ol")
      Object.defineProperty NsNode, "ol",
        value: (opts) ->
          childNode = OJ.elements.ol(NsNode, prepId(opts, "ol"))
          childNode

    if isChildNodeTypeAllowed("option")
      Object.defineProperty NsNode, "option",
        value: (opts) ->
          childNode = OJ.elements.option(NsNode, prepId(opts, "option"))
          childNode

    if isChildNodeTypeAllowed("p")
      Object.defineProperty NsNode, "p",
        value: (opts) ->
          childNode = OJ.elements.p(NsNode, prepId(opts, "p"))
          childNode

    if isChildNodeTypeAllowed("select")
      Object.defineProperty NsNode, "select",
        value: (opts) ->
          childNode = OJ.elements.select(NsNode, prepId(opts, "select"))
          childNode

    if isChildNodeTypeAllowed("span")
      Object.defineProperty NsNode, "span",
        value: (opts) ->
          childNode = OJ.elements.span(NsNode, prepId(opts, "span"))
          childNode

    if isChildNodeTypeAllowed("table")
      Object.defineProperty NsNode, "table",
        value: (opts) ->
          childNode = OJ.elements.table(NsNode, prepId(opts, "table"))
          childNode

    if isChildNodeTypeAllowed("textArea")
      Object.defineProperty NsNode, "textArea",
        value: (opts) ->
          childNode = OJ.elements.textArea(NsNode, prepId(opts, "textArea"))
          childNode

    if isChildNodeTypeAllowed("ul")
      Object.defineProperty NsNode, "ul",
        value: (opts) ->
          childNode = OJ.elements.ul(NsNode, prepId(opts, "ul"))
          childNode

    NsNode

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
