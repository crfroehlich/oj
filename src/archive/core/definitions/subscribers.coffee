# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_listenerIIFE = (OJ) ->
  
  ###
  The private constructor for a Subscribers object.
  @param listenerType {String} The name of the subscriber to create
  @param namespace {String} The NameSpace to which the subscriber belongs
  ###
  Subscribers = (listenerType, namespace) ->
    throw new Error("No subscriber class \"" + namespace + "\" has been defined.")  unless OJ[namespace]
    throw new Error("No subscribers have been defined.")  unless OJ[namespace].constants.subscribers
    that = this
    subscribers = []
    
    ###
    For a known subscriber name, apply the appropriate arguments as defined by Ext to a method wrapper to be assigned as the subscriber.
    @param name {OJ.constants.listenerType} Name of the subscriber
    @param method {Function} callback method
    ###
    OJ.property that, "add", ((name, method) ->
      throw new Error("SubscriberType type " + name + " is not supported.")  unless OJ[namespace].constants.subscribers.has(name)
      throw new Error(namespace + " already containts a listenere for " + name + ".")  if -1 isnt subscribers.indexOf(name)
      subscribers.push name
      subscriber = OJ[namespace].subscribers[name](method)
      OJ.property that, name, subscriber
      that
    ), false, false, false
    that

  OJ.instanceOf.register "Subscribers", Subscribers
  
  ###
  Create a new subscribers collection. This returns a subscribers object with an add method.
  @param listenerType {String} The name of the subscriber to create
  @param namespace {String} The NameSpace to which the subscriber belongs
  ###
  OJ.register "makeSubscribers", (listenerType, namespace) ->
    ret = new Subscribers(listenerType, namespace)
    ret

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
