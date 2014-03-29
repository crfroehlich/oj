# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_treelIIFE = (OJ) ->
  
  ###
  Private class representing the construnction of a tree node. It returns a OJ.tree.treeNode instance.
  @param text {String} The text to display
  @param children {Array} [children] An array of tree node children
  @param expanded {Boolean} [expanded=false] If children are provided, true to render the node expanded
  @param leaf {Boolean} [leaf] If true, render the node as a leaf of the tree
  @param allowDrop {Boolean} [allowDrop=false] If true, allow the node to be dropped
  ###
  TreeNode = (text, children, expanded, leaf, allowDrop) ->
    "use strict"
    that = this
    OJ.property that, "text", text  if text
    unless children
      leaf = true
    else
      OJ.property that, "children", children
      expanded = false  if true isnt expanded
      OJ.property that, "expanded", expanded
    OJ.property that, "leaf", true  if true is leaf
    allowDrop = false  if true isnt allowDrop
    OJ.property that, "allowDrop", allowDrop
    that

  OJ.instanceOf.register "TreeNode", TreeNode
  
  ###
  Create a tree node object.
  @param nodeDef.text {String} The text to display
  @param nodeDef.children {Array} [children] An array of tree node children
  @param nodeDef.expanded {Boolean} [expanded=false] If children are provided, true to render the node expanded
  @param nodeDef.leaf {Boolean} [leaf] If true, render the node as a leaf of the tree
  @param nodeDef.allowDrop {Boolean} [allowDrop=false] If true, allow the node to be dropped
  @returns {OJ.trees.treeNode} A tree object. Exposese subscribers and columns collections. Call init when ready to construct the tree.
  ###
  OJ.trees.register "treeNode", treeNode = (nodeDef) ->
    "use strict"
    throw new Error("Cannot instance a tree node without properties")  unless nodeDef
    node = new TreeNode(nodeDef.text, nodeDef.children, nodeDef.expanded, nodeDef.leaf, nodeDef.allowDrop)
    node

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
