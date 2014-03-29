((OJ) ->

  # Wrap the execution of a method in a try..catch..finally     
  # ignore errors failing to exec self-executing functions 
  # Return a method wrapped in a try..catch..finally
  OJ.register "tryExec", tryExec = (tryFunc) ->
    'use strict'
    ret = false
    that = this
    try
      ret = tryFunc.apply(that, Array::slice.call(arguments_, 1))  if OJ.is.func(tryFunc)
    catch exception
      if (exception.name is "TypeError" or exception.type is "called_non_callable") and exception.type is "non_object_property_load"
        OJ.console.info "Ignoring exception: ", exception
      else
        OJ.console.error exception
    finally

    ret


  OJ.register "method", method = (tryFunc) ->
    'use strict'
    that = this
    ->
      args = Array::slice.call(arguments_, 0)
      args.unshift tryFunc
      OJ.tryExec.apply that, args

  return
 
 )  (if (typeof global isnt 'undefined' and global) then global else if (typeof window isnt 'undefined') then window else this).OJ
