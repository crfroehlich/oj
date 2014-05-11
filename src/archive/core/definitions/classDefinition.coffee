# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_classDefinitionIIFE = (OJ) ->
  
  ###
  Private constructor to create an object suitable for defining a new class
  @param name {String} The name of this class
  @param extend {String} The ExtJS class to extend/copy
  @param requires {Array} [requires] An array of dependencies
  @param alias {Array} [alias] An array of alternate names for this class
  @param id {String} [id] A unique id for this class
  @param store {OJ.store} [store] A data store for this class
  @param plugins {Array} [plugins] An array of plugins to initialize with new instances of this class
  @param constant {String} [constant] A OJ.constants constant to constrain property additions
  @param namespace {String} A OJ namespace to constrain subscribers
  @param onDefine {Function} [onDefine] A method to call when the class definition is defined on the Ext namespace
  @param debug {Boolean} [debug=false] For development debugging purposes. If true, output log content.
  ###
  ClassDefinition = (name, extend, requires, alias, id, store, plugins, constant, namespace, onDefine, debug) ->
    that = this
    classDef = {}
    
    ###
    Set of properties most Ext classes share
    ###
    OJ.property classDef, "extend", extend  if extend
    OJ.property classDef, "requires", requires  if requires
    OJ.property classDef, "alias", alias  if alias
    OJ.property classDef, "id", id  if id
    OJ.property classDef, "plugins", plugins  if plugins
    OJ.property classDef, "store", store  if store
    
    ###
    initComponents are created when the class is instanced; they are not part of the class definition--except as callbacks
    This is unusual. Most classes do not need this mechanism. See tableGrid for example.
    ###
    initComponents = []
    OJ.property that, "addInitComponent", ((method) ->
      initComponents.push method  if method
      return
    ), false, false, false
    
    ###
    We don't allow subscribers to be defined ad hoc; and if they are defined, they must be defined on the namespace subscriber object
    ###
    if namespace and OJ[namespace]
      subscribers = OJ[namespace].subscribers.subscribers()
      OJ.property that, "subscribers", subscribers
      OJ.property that.subscribers, "exception", ->
        OJ.console.error "An error occurred in " + name + ".", arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]
        return

      
      ###
      Interface to Add to the properties that will become part of the Ext class
      ###
      if OJ[namespace].constants.properties
        OJ.property that, "addProp", ((propName, value) ->
          throw new Error("Property named \"" + propName + "\" has not be defined on OJ." + namespace + ".constants.properties.")  unless OJ[namespace].constants.properties.has(propName)
          OJ.property classDef, propName, value
          return
        ), false, false, false
      
      #Convenience access to the constant properties on the instance
      OJ.property that, "props", OJ[namespace].constants.properties
      
      #Convenience access to the constant subscribeables on the instance
      OJ.property that, "subs", OJ[namespace].constants.subscribers
    
    ###
    init must be manually called when the class is ready to be constructed (e.g. defined on Ext)
    ###
    OJ.property that, "init", ->
      OJ.property classDef, "initComponent", ->
        them = this
        if initComponents.length > 0
          OJ.each initComponents, (func) ->
            func them
            return

        them.callParent arguments

      if subscribers and Object.keys(subscribers).length > 0
        
        ###
        Bit of a hack; but grids are a special case.
        ###
        if namespace is "grids"
          OJ.property classDef, "viewConfig", {}
          OJ.property classDef.viewConfig, "listeners", that.subscribers #Subscribers === listeners in Ext
        else
          OJ.property classDef, "listeners", subscribers
      onDefine classDef, that  if onDefine
      ret = Ext.define(name, classDef)
      ret

    that

  OJ.instanceOf.register "ClassDefinition", ClassDefinition
  
  ###
  Define declares a new class on the ExtJs namespace
  @param def {Object} defintion object with possible properties: def.name def.extend, def.requires, def.alias, def.id, def.store, def.plugins, def.constant, def.onDefine
  @param def.name {String} The name of this class
  @param def.extend {String} The ExtJS class to extend/copy
  @param def.requires {Array} [def.requires] An array of dependencies
  @param def.alias {Array} [def.alias] An array of alternate names for this class
  @param def.id {String} [def.id] A unique id for this class
  @param def.store {OJ.store} [def.store] A data store for this class
  @param def.plugins {Array} [def.plugins] An array of plugins to initialize with new instances of this class
  @param def.constant {String} [def.constant] A OJ.constants constant to constrain property additions
  @param def.namespace [String] A OJ namespace to constrain subscribers
  @param def.onDefine {Function} [def.onDefine] A method to call when the class definition is defined on the Ext namespace
  ###
  OJ.register "classDefinition", (def) ->
    throw new Error("Cannot create a definition without parameters.")  unless def
    if def.id
      def.name = "Ext." + OJ.name + "." + def.id
      def.alias = ["widget." + def.id]
    throw new Error("Cannot define a class without a name")  unless typeof def.name is "string"
    ret = new ClassDefinition(def.name, def.extend, def.requires, def.alias, def.id, def.store, def.plugins, def.constant, def.namespace, def.onDefine)
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
