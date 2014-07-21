OJ = require '../oj'
isMethod = require '../tools/is'
console = require '../tools/console'

func = do ->
  # Wrap the execution of a method in a try..catch..finally
  # ignore errors failing to exec self-executing functions
  # Return a method wrapped in a try..catch..finally
  tryExec: (tryFunc, params...) ->
    try
      ret = tryFunc params... if isMethod.method tryFunc
    catch exception
      if (exception.name is 'TypeError' or exception.type is 'called_non_callable') and exception.type is 'non_object_property_load'
        console.info 'Ignoring exception: ', exception
      else
        console.error exception
    finally

    ret


  method: (tryFunc, params...) ->
    =>
      func.tryExec.apply @, params...


 OJ.register 'tryExec', func.tryExec
 OJ.register 'method', func.method
 module.exports = func