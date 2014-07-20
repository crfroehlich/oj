OJ = require '../oj'
require '../tools/is'
require '../tools/console'

func = do ->
  # Wrap the execution of a method in a try..catch..finally
  # ignore errors failing to exec self-executing functions
  # Return a method wrapped in a try..catch..finally
  tryExec: (tryFunc, params...) ->
    try
      ret = tryFunc params... if OJ.is.method tryFunc
    catch exception
      if (exception.name is 'TypeError' or exception.type is 'called_non_callable') and exception.type is 'non_object_property_load'
        OJ.console.info 'Ignoring exception: ', exception
      else
        OJ.console.error exception
    finally

    ret


  method: (tryFunc, params...) ->
    =>
      OJ.tryExec.apply @, params...


 OJ.register 'tryExec', func.tryExec
 OJ.register 'method', func.method
 modules.exports = func