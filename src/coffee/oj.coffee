# # OJ

# Persist a reference to the global object
thisGlobal = if (typeof global isnt 'undefined' and global) then global else (if (typeof self isnt 'undefined' and self) then self else (if (typeof window isnt 'undefined' and window) then window else this))
utilLib = thisGlobal.jQuery
nameSpaceName = 'OJ'

###
boot strap name method into Object prototype
###
Object.defineProperties Object::,
  getInstanceName:
    value: ->
      funcNameRegex = /function (.{1,})\(/
      results = (funcNameRegex).exec(@constructor.toString())
      (if (results and results.length > 1) then results[1] else '')


###
An internal representation of the namespace tree
###
NsTree = {}
makeTheJuice = ->
  
  ###
  Internal nameSpaceName method to create new 'sub' namespaces on arbitrary child objects.
  ###
  makeNameSpace = (spacename, tree) ->
    ###
    The derived instance to be constructed
    ###
    Base = (nsName) ->
      proto = this
      tree[nsName] = tree[nsName] or {}
      nsTree = tree[nsName]
      members = {}
      
      Object.defineProperty this, 'members', value: members
      
      ###
      Register (e.g. 'Lift') an Object into the prototype of the namespace.
      This Object will be readable/executable but is otherwise immutable.
      ###
      Object.defineProperty this, 'register',
        value: (name, obj, enumerable) ->
          'use strict'
          throw new Error('Cannot lift a new property without a valid name.')  if (typeof name isnt 'string') or name is ''
          throw new Error('Cannot lift a new property without a valid property instance.')  unless obj
          throw new Error('Property named ' + name + ' is already defined on ' + spacename + '.')  if proto[name]
          
          members[name] = members[name] or name
          
          #Guard against obliterating the tree as the tree is recursively extended
          nsTree[name] = nsTree[name] or
            name: name
            type: typeof obj
            instance: (if obj.getInstanceName then obj.getInstanceName() else 'unknown')

          Object.defineProperty proto, name,
            value: obj
            enumerable: false isnt enumerable

          nsInternal.alertDependents nsName + '.' + spacename + '.' + name
          obj

      
      ###
      Create a new, static namespace on the current parent (e.g. nsName.to... || nsName.is...)
      ###
      proto.register 'makeSubNameSpace', ((subNameSpace) ->
        'use strict'
        throw new Error('Cannot create a new sub namespace without a valid name.')  if (typeof subNameSpace isnt 'string') or subNameSpace is ''
        throw new Error('Sub namespace named ' + subNameSpace + ' is already defined on ' + spacename + '.')  if proto.subNameSpace
        nsInternal.alertDependents nsName + '.' + subNameSpace
        newNameSpace = makeNameSpace(subNameSpace, nsTree)
        newNameSpace.register 'constants', makeNameSpace('constants', nsTree), false  if subNameSpace isnt 'constants'
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
    Class = new Function('return function ' + spacename + '(){}')()
    Class:: = new Base(spacename)
    
    #Class.prototype.parent = Base.prototype;
    new Class(spacename)
  
  ###
  'Depend' an Object upon another member of this namespace, upon another namespace,
  or upon a member of another namespace
  ###
  dependsOn = (dependencies, callBack, imports) ->
    'use strict'
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
  ###
  Object.defineProperty nsInternal, 'getNsMembers',
    value: ->
      recurseTree = (key, lastKey) ->
        members.push lastKey + '.' + key  if typeof (key) is 'string'
        if utilLib.isPlainObject(key)
          Object.keys(key).forEach (k) ->
            members.push lastKey + '.' + k  if typeof (k) is 'string'
            recurseTree key[k], lastKey + '.' + k  if utilLib.isPlainObject(key[k])
            return

        return
      members = []
      Object.keys(NsTree[nameSpaceName]).forEach (key) ->
        recurseTree NsTree[nameSpaceName][key], nameSpaceName  if utilLib.isPlainObject(NsTree[nameSpaceName][key])
        return

      members

  ###
  To support dependency management, when a property is lifted onto the namespace, notify dependents to initialize
  ###
  Object.defineProperty nsInternal, 'alertDependents',
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
  
  ###
  Cache a handle on the vendor (probably jQuery) on the root namespace
  ###
  NsOut.register '?', utilLib, false

  ###
  Cache the tree (useful for documentation/visualization/debugging)
  ###
  NsOut.register 'tree', NsTree[nameSpaceName], false
  
  ###
  Cache the name space name
  ###
  NsOut.register 'name', nameSpaceName, false
  NsOut.register 'dependsOn', dependsOn, false
  NsOut


###
Actually define the OJ NameSpace
###
Object.defineProperty thisGlobal, nameSpaceName,
  value: makeTheJuice()

OJ.register 'global', thisGlobal

thisDocument = {}
if typeof document isnt 'undefined'
  thisDocument = document
  
OJ.register 'document', thisDocument

OJ.register 'noop', ->