# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_proxyClassIIFE = (OJ) ->
  
  ###
  Internal class to define a Proxy. This class cannot be directly instanced.
  ###
  Proxy = (type) ->
    that = this
    OJ.property that, "type", type
    that

  OJ.instanceOf.register "Proxy", Proxy
  
  ###
  Instance a new Proxy. Proxies are the mechanisms by which Stores are populated with data.
  Currently, only Proxy types of 'memory' are supported.
  @param type {String} The type of proxy
  ###
  OJ.stores.register "proxy", (type) ->
    throw new Error("Only proxy types of \"memory\" are supported.")  if type isnt "memory"
    ret = new Proxy(type)
    ret

  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
