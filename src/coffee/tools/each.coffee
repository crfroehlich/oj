# # each

((OJ) ->

  # ## canEach
  canEach = (obj) ->
    # Return true if the object [is](is.html) truly iterable (e.g. an instance of Object or Array)
    OJ.is.plainObject(obj) or OJ.is.object(obj) or OJ.is.array obj

  # ## [OJ](oj.html).each

  # Iterate all of the members of an object (or an array) with optional callback and recursion.

  # - `obj`: the object to iterate,
  # - `onEach`: a callback to execute for each iteration,
  # - `recursive`: if true, recursively iterate all valid child objects.
  each = (obj, onEach, recursive) ->
    if canEach obj
      # Using [Lo-Dash](http://lodash.com/docs#forown)'s `forOwn` method to ensure that only the actual properties of the object are enumerated.

      # - `onEach` callback will receive 2 parameters:
      # - `val` and `key`.
      # - `val` is always the value of the property.
      # - `key` is either the name of the property or the current index of the array.
      _.forOwn obj, (val, key) ->
        if onEach and (val or key)
          quit = onEach val, key
          return false  if false is quit
        each val, onEach, true  if true is recursive
        return

    return

  # ## register

  # register the `each` method on the [OJ](OJ.html) namespace
  OJ.register 'each', each
  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
