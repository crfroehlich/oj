#global nameSpaceName:true, jQuery: true, window: true 

###
@fileOverview Name Space file
@author me
@version: 0.1.1
###

###
jQuery definition to anchor JsDoc comments.

@see http://jquery.com/
@name jQuery
@namespace jQuery Library
###

###
OJ IIFE definition to anchor JsDoc comments.

@namespace internalNameSpace
@internal
@param {string} nameSpaceName
@param {jQuery} domVendor
###
thisGlobal = this;
domVendor = thisGlobal.jQuery
nameSpaceName = "OJ"

###
boot strap name method into Object prototype
@function
@return {string} Name of the Object
@memberOf {object}
###
Object.defineProperties Object::,
  getInstanceName:
    value: ->
      funcNameRegex = /function (.{1,})\(/
      results = (funcNameRegex).exec(@constructor.toString())
      (if (results and results.length > 1) then results[1] else "")


###
An internal representation of the namespace tree
@internal
@memberOf internalNameSpace
###
NsTree = {}
makeTheJuice = ->
  
  ###
  Internal nameSpaceName method to create new "sub" namespaces on arbitrary child objects.
  @internal
  @param spacename {string} the namespace name
  @param tree {object} the internal tree representation of the current level of the namespace
  @extends OJ
  @memberOf internalNameSpace
  ###
  makeNameSpace = (spacename, tree) ->
    ###
    The derived instance to be constructed
    @constructor
    @internal
    @memberOf makeNameSpace
    @return {object}
    ###
    Base = (nsName) ->
      proto = this
      tree[nsName] = tree[nsName] or {}
      nsTree = tree[nsName]
      
      ###
      Register (e.g. "Lift") an Object into the prototype of the namespace.
      This Object will be readable/executable but is otherwise immutable.
      @name register
      @param {string} name The name of the object to lift
      @param {object} obj Any, arbitrary Object to use as the value.
      @return {object} The value of the new property.
      @memberOf OJ
      ###
      Object.defineProperty this, "register",
        value: (name, obj, enumerable) ->
          "use strict"
          throw new Error("Cannot lift a new property without a valid name.")  if (typeof name isnt "string") or name is ""
          throw new Error("Cannot lift a new property without a valid property instance.")  unless obj
          throw new Error("Property named " + name + " is already defined on " + spacename + ".")  if proto[name]
          
          #Guard against obliterating the tree as the tree is recursively extended
          nsTree[name] = nsTree[name] or
            name: name
            type: typeof obj
            instance: (if obj.getInstanceName then obj.getInstanceName() else "unknown")

          Object.defineProperty proto, name,
            value: obj
            enumerable: false isnt enumerable

          nsInternal.alertDependents nsName + "." + spacename + "." + name
          obj

      
      ###
      Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...)
      @name makeSubNameSpace
      @param {string} subNameSpace The name of the new namespace.
      @return {object} The new namespace.
      @memberOf OJ
      ###
      proto.register "makeSubNameSpace", ((subNameSpace) ->
        "use strict"
        throw new Error("Cannot create a new sub namespace without a valid name.")  if (typeof subNameSpace isnt "string") or subNameSpace is ""
        throw new Error("Sub namespace named " + subNameSpace + " is already defined on " + spacename + ".")  if proto.subNameSpace
        nsInternal.alertDependents nsName + "." + subNameSpace
        newNameSpace = makeNameSpace(subNameSpace, nsTree)
        newNameSpace.register "constants", makeNameSpace("constants", nsTree), false  if subNameSpace isnt "constants"
        proto.register subNameSpace, newNameSpace, false
        newNameSpace
      ), false
      return
    
    ###
    An internal mechanism to represent the instance of this namespace
    @constructor
    @internal
    @memberOf makeNameSpace
    ###
    Class = new Function("return function " + spacename + "(){}")()
    Class:: = new Base(spacename)
    
    #Class.prototype.parent = Base.prototype;
    new Class(spacename)
  
  ###
  "Depend" an Object upon another member of this namespace, upon another namespace,
  or upon a member of another namespace
  @param (array) array of dependencies for this method
  @param (function) obj Any, arbitrary Object to use as the value
  @memberOf OJ
  ###
  dependsOn = (dependencies, callBack, imports) ->
    "use strict"
    ret = false
    nsMembers = nsInternal.getNsMembers()
    if dependencies and dependencies.length > 0 and callBack
      missing = dependencies.filter((depen) ->
        nsMembers.indexOf(depen) is -1 and (not imports or imports isnt depen)
      )
      if missing.length is 0
        ret = true
        callBack()
      else
        nsInternal.dependents.push (imports) ->
          dependsOn missing, callBack, imports

    ret
  nsInternal = dependents: []
  
  ###
  Fetches the registered properties and methods on the namespace and its child namespaces
  @interal
  @return {Array} An array of members defined as strings (e.g. 'namespace.constants.astringcnst')
  @memberOf internalNameSpace
  ###
  Object.defineProperty nsInternal, "getNsMembers",
    value: ->
      recurseTree = (key, lastKey) ->
        members.push lastKey + "." + key  if typeof (key) is "string"
        if domVendor.isPlainObject(key)
          Object.keys(key).forEach (k) ->
            members.push lastKey + "." + k  if typeof (k) is "string"
            recurseTree key[k], lastKey + "." + k  if domVendor.isPlainObject(key[k])
            return

        return
      members = []
      Object.keys(NsTree[nameSpaceName]).forEach (key) ->
        recurseTree NsTree[nameSpaceName][key], nameSpaceName  if domVendor.isPlainObject(NsTree[nameSpaceName][key])
        return

      members

  ###
  To support dependency management, when a property is lifted onto the namespace, notify dependents to initialize
  @internal
  @memberOf internalNameSpace
  ###
  Object.defineProperty nsInternal, "alertDependents",
    value: (imports) ->
      deps = nsInternal.dependents.filter((depOn) ->
        false is depOn(imports)
      )
      nsInternal.dependents = deps  if Array.isArray(deps)
      return

  #Create the root of the tree as the current namespace
  NsTree[nameSpaceName] = {}
  #Define the core namespace and the return of this class
  NsOut = makeNameSpace(nameSpaceName, NsTree[nameSpaceName])
  Object.defineProperties thisGlobal,
    $nameSpace$:
      value: NsOut

  #Cache a handle on the vendor (probably jQuery) on the root namespace
  ###
  Cache a handle on the vendor (probably jQuery) on the root namespace
  @name '?'
  @return {jQuery}
  @memberOf OJ
  ###
  NsOut.register "?", domVendor, false
  #Cache the tree (useful for documentation/visualization/debugging)
  ###
  Cache the tree (useful for documentation/visualization/debugging)
  @name 'tree'
  @return {NsTree}
  @memberOf OJ
  ###
  NsOut.register "tree", NsTree[nameSpaceName], false
  #Cache the name space name
  ###
  Cache the name space name
  @name 'name'
  @return {nameSpaceName}
  @memberOf OJ
  ###
  NsOut.register "name", nameSpaceName, false
  NsOut.register "dependsOn", dependsOn, false
  NsOut


###
OJ NameSpace

@namespace OJ
###
Object.defineProperty thisGlobal, nameSpaceName,
  value: makeTheJuice()
