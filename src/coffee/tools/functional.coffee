#global OJ:true
do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  'use strict'
  OJ.makeSubNameSpace "fun"
  
  #
  #    * Curry Left method
  #    
  OJ.fun.register "curryLeft", curryLeft = (func) ->
    slice = Array::slice
    args = slice.call(arguments, 1)
    ->
      func.apply this, args.concat(slice.call(arguments, 0))

  
  #
  #    * Fold Left method
  #    
  OJ.fun.register "foldLeft", foldLeft = (func, newArray, oldArray) ->
    accumulation = newArray
    OJ.each oldArray, (val) ->
      accumulation = func(accumulation, val)
      return

    accumulation

  
  #
  #    * Map method
  #    
  OJ.fun.register "map", map = (func, array) ->
    onIteration = (accumulation, val) ->
      accumulation.concat func(val)

    OJ.fun.foldLeft onIteration, [], array

  
  #
  #    * Filter method
  #    
  OJ.fun.register "filter", filter = (func, array) ->
    onIteration = (accumulation, val) ->
      if func(val)
        accumulation.concat val
      else
        accumulation

    OJ.fun.foldLeft onIteration, [], array

  
  #
  #    * Inserts a parameter into the position of the first argument, shifting all other arguments to "the right" by one position
  #    
  OJ.fun.register "shiftRight", shiftRight = (shiftFunc, firstParam, originalArguments, context) ->
    context = context or this
    args = Array::slice.call(originalArguments, 0)
    args.unshift firstParam
    shiftFunc.apply context, args

  
  #
  #    * Executes a method using a new context and arguments
  #    
  OJ.fun.register "apply", apply = (applyFunc, originalArguments, context) ->
    context = context or this
    args = Array::slice.call(originalArguments, 0)
    applyFunc.apply context, args

  return

