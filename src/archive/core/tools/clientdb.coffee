(->
  "use strict"
  
  #/ <summary>
  #/   Client db class to encapsulate get/set/update and delete methods against the localStorage object.
  #/ </summary>
  #/ <returns type="OJClientDb">Instance of itself. Must instance with 'new' keyword.</returns>
  ojInternal =
    keys: []
    deserialize: $.parseJSON
    serializer: JSON
    hasLocalStorage: (window.Modernizr.localstorage)
    hasSessionStorage: (window.Modernizr.sessionstorage)

  ojInternal.serialize = ojInternal.serializer.stringify
  ojInternal.closureStorage = (->
    storage = {}
    keys = []
    length = 0
    clientDbP = {}
    clientDbP.getItem = (sKey) ->
      ret = null
      ret = storage[sKey]  if sKey and storage.hasOwnProperty(sKey)
      ret

    clientDbP.key = (nKeyId) ->
      ret = null
      ret = keys[nKeyId]  if keys.hasOwnProperty(nKeyId)
      ret

    clientDbP.setItem = (sKey, sValue) ->
      ret = null
      if sKey
        if false is storage.hasOwnProperty(sKey)
          keys.push sKey
          length += 1
        storage[sKey] = sValue
      ret

    clientDbP.length = length
    clientDbP.removeItem = (sKey) ->
      ret = false
      if sKey and storage.hasOwnProperty(sKey)
        keys.splice sKey, 1
        length -= 1
        delete storage[sKey]

        ret = true
      ret

    clientDbP.clear = ->
      storage = {}
      keys = []
      length = 0
      true

    clientDbP.hasOwnProperty = (sKey) ->
      storage.hasOwnProperty sKey

    clientDbP
  ())
  OJ.register "hasWebStorage", ->
    ret = (window.Modernizr.localstorage or window.Modernizr.sessionstorage)
    ret

  OJ.clientDb.register "clear", (clearAll) ->
    if OJ.bool(clearAll)
      
      #nuke the entire storage collection
      window.localStorage.clear()  if ojInternal.hasLocalStorage
      window.sessionStorage.clear()  if ojInternal.hasSessionStorage
      ojInternal.closureStorage.clear()
    else
      ojInternal.keys.forEach (key) ->
        OJ.clientDb.removeItem key
        return

    OJ.clientDb

  OJ.clientDb.register "getItem", (key) ->
    ret = ""
    if false is OJ.isNullOrEmpty(key)
      value = OJ.string(window.localStorage.getItem(key))
      value = OJ.string(window.sessionStorage.getItem(key))  if OJ.isNullOrEmpty(value) or value is "undefined"
      value = OJ.string(ojInternal.closureStorage.getItem(key))  if OJ.isNullOrEmpty(value) or value is "undefined"
      if not OJ.isNullOrEmpty(value) and value isnt "undefined"
        try
          ret = ojInternal.deserialize(value)
        catch e
          ret = value
    ret

  OJ.clientDb.register "getKeys", ->
    locKey = undefined
    sesKey = undefined
    memKey = undefined
    if OJ.isNullOrEmpty(ojInternal.keys) and window.localStorage.length > 0
      for locKey of window.localStorage
        ojInternal.keys.push locKey
      if window.sessionStorage.length > 0
        for sesKey of window.sessionStorage
          ojInternal.keys.push sesKey
      if ojInternal.closureStorage.length > 0
        for memKey of ojInternal.closureStorage.keys
          ojInternal.keys.push memKey
    ojInternal.keys

  OJ.clientDb.register "hasKey", (key) ->
    ret = OJ.contains(@getKeys(), key)
    ret

  OJ.clientDb.register "removeItem", (key) ->
    window.localStorage.removeItem key
    window.sessionStorage.removeItem key
    ojInternal.closureStorage.removeItem key
    delete ojInternal.keys[key]

    return

  OJ.clientDb.register "setItem", (key, value) ->
    
    #/ <summary>
    #/   Stores a key/value pair in localStorage. 
    #/   If localStorage is full, use sessionStorage. 
    #/   if sessionStorage is full, store in memory.
    #/ </summary>
    #/ <param name="key" type="String">The property name to store.</param>
    #/ <param name="value" type="String">The property value to store. If not a string, serializer will be called.</param>
    #/ <returns type="Boolean">True if successful</returns>
    ret = true
    if false is OJ.isNullOrEmpty(key)
      ojInternal.keys.push key  if false is @hasKey(key)
      val = (if (typeof value is "object") then ojInternal.serialize(value) else value)
      
      # if localStorage is full, we should fail gracefully into sessionStorage, then memory
      try
        window.localStorage.setItem key, val
      catch locErr
        try
          window.localStorage.removeItem key
          window.sessionStorage.setItem key, val
        catch ssnErr
          try
            window.sessionStorage.removeItem key
            ojInternal.closureStorage.setItem key, value
          catch memErr
            ret = false
    ret

  return
)()
