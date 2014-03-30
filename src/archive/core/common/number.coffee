#global OJ:true
((OJ) ->
  validateFloatMinValue = (value, minvalue, excludeRangeLimits) ->
    nValue = parseFloat(value)
    nMinValue = parseFloat(minvalue)
    isValid = true
    excludeRangeLimits = false  if excludeRangeLimits is `undefined`
    isValid = false  if (if nValue is `undefined` or excludeRangeLimits then nValue <= nMinValue else nValue < nMinValue)  if nMinValue isnt `undefined`
    isValid
  validateFloatMaxValue = (value, maxvalue, excludeRangeLimits) ->
    nValue = parseFloat(value)
    nMaxValue = parseFloat(maxvalue)
    isValid = true
    excludeRangeLimits = false  if excludeRangeLimits is `undefined`
    isValid = false  if (if nValue is `undefined` or excludeRangeLimits then nValue >= nMaxValue else nValue > nMaxValue)  if nMaxValue isnt `undefined`
    isValid
  validateFloatPrecision = (value, precision) ->
    isValid = true
    regex = undefined
    if precision > 0
      
      # Allow any valid number -- we'll round later 
      regex = /^\-?\d*(\.\d+)?$/g #Case 28696 - changed regex to NOT accept a '.'
    else
      
      # Integers Only 
      regex = /^\-?\d*$/g
    isValid = false  if isValid and not regex.test(value)
    isValid
  validateInteger = (value) ->
    regex = /^\-?\d+$/g
    regex.test(value) or value is null
  validateGreaterThanZero = (value) ->
    regex = /^(\d*(\.|)\d*)$/g
    (regex.test(value) and number(value) > 0) or value is null
  getMaxValueForPrecision = (precision, maxPrecision) ->
    i = undefined
    ret = ""
    precisionMax = maxPrecision or 6
    if precision > 0 and precision <= precisionMax
      ret += "."
      i = 0
      while i < precision
        ret += "9"
        i += 1
    ret
  
  #Validates the character length of the string-ified number
  validateMaxLength = (value, maxLength) ->
    value.length <= maxLength
  number = Object.create(null)
  Object.defineProperty number, "isNaN",
    value: (->
      return Number.isNaN  if Number and Number.isNaN
      isNaN
    ())

  Object.defineProperty number, "isFinite",
    value: (->
      return Number.isFinite  if Number and Number.isFinite
      isFinite
    ())

  Object.defineProperty number, "MAX_VALUE",
    value: (->
      return Number.MAX_VALUE  if Number and Number.MAX_VALUE
      1.7976931348623157e+308
    ())

  Object.defineProperty number, "MIN_VALUE",
    value: (->
      return Number.MIN_VALUE  if Number and Number.MIN_VALUE
      5e-324
    ())

  OJ.register "number", number
  OJ.register "validateFloatMinValue", validateFloatMinValue
  OJ.register "validateFloatMaxValue", validateFloatMaxValue
  OJ.register "validateFloatPrecision", validateFloatPrecision
  OJ.register "validateInteger", validateInteger
  OJ.register "validateGreaterThanZero", validateGreaterThanZero
  OJ.register "getMaxValueForPrecision", getMaxValueForPrecision
  OJ.register "validateMaxLength", validateMaxLength
  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
