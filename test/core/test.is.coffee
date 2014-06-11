((OJ) ->
  module 'null'
  test 'null is not of any OJ supported type', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(null), false, 'null is not a String'
    deepEqual OJ.is.bool(null), false, 'null is not a Boolean'
    deepEqual OJ.is.number(null), false, 'null is not a Number'
    deepEqual OJ.is.numeric(null), false, 'null is not numeric'
    deepEqual OJ.is.date(null), false, 'null is not a Date'
    deepEqual OJ.is.method(null), false, 'null is not a Function'
    deepEqual OJ.is.array(null), false, 'null is not an Array'
    deepEqual OJ.is.plainObject(null), false, 'null is not an Object'
    return

  
  module 'explicit undefined'
  test 'undefined is not of any OJ supported type', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(`undefined`), false, 'undefined is not a String'
    deepEqual OJ.is.bool(`undefined`), false, 'undefined is not a Boolean'
    deepEqual OJ.is.number(`undefined`), false, 'undefined is not a Number'
    deepEqual OJ.is.numeric(`undefined`), false, 'undefined is not numeric'
    deepEqual OJ.is.date(`undefined`), false, 'undefined is not a Date'
    deepEqual OJ.is.method(`undefined`), false, 'undefined is not a Function'
    deepEqual OJ.is.array(`undefined`), false, 'undefined is not an Array'
    deepEqual OJ.is.plainObject(`undefined`), false, 'undefined is not an Object'
    return

  
  module 'implicit undefined by empty arguments'
  test 'undefined is not of any OJ supported type', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(), false, '(An empty argument) is not a String'
    deepEqual OJ.is.bool(), false, '(An empty argument) is not a Boolean'
    deepEqual OJ.is.number(), false, '(An empty argument) is not a Number'
    deepEqual OJ.is.numeric(), false, '(An empty argument) is not numeric'
    deepEqual OJ.is.date(), false, '(An empty argument) is not a Date'
    deepEqual OJ.is.method(), false, '(An empty argument) is not a Function'
    deepEqual OJ.is.array(), false, '(An empty argument) is not an Array'
    deepEqual OJ.is.plainObject(), false, '(An empty argument) is not an Object'
    return

  
  module 'is...number NaN'
  test 'NaN is a number and only a number', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(NaN), false, 'NaN is not a String'
    deepEqual OJ.is.bool(NaN), false, 'NaN is not a Boolean'
    deepEqual OJ.is.number(NaN), false, 'NaN is not a Number'
    deepEqual OJ.is.numeric(NaN), false, 'NaN is not numeric'
    deepEqual OJ.is.date(NaN), false, 'NaN is not a Date'
    deepEqual OJ.is.method(NaN), false, 'NaN is not a Function'
    deepEqual OJ.is.array(NaN), false, 'NaN is not an Array'
    deepEqual OJ.is.plainObject(NaN), false, 'NaN is not an Object'
    return

  
  module 'is...number -Infinity'
  test '-Infinity is a number and only a number', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(-Infinity), false, '-Infinity is not a String'
    deepEqual OJ.is.bool(-Infinity), false, '-Infinity is not a Boolean'
    deepEqual OJ.is.number(-Infinity), false, '-Infinity is not a Number'
    deepEqual OJ.is.numeric(-Infinity), false, '-Infinity is not numeric'
    deepEqual OJ.is.date(-Infinity), false, '-Infinity is not a Date'
    deepEqual OJ.is.method(-Infinity), false, '-Infinity is not a Function'
    deepEqual OJ.is.array(-Infinity), false, '-Infinity is not an Array'
    deepEqual OJ.is.plainObject(-Infinity), false, '-Infinity is not an Object'
    return

  
  module 'is...string ""'
  test '"" is a string and only a string', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(''), true, '"" is (actually) a String!'
    deepEqual OJ.is.bool(''), false, '"" is not a Boolean'
    deepEqual OJ.is.number(''), false, '"" is not a Number'
    deepEqual OJ.is.numeric(''), true, '"" is numeric'
    deepEqual OJ.is.date(''), false, '"" is not a Date'
    deepEqual OJ.is.method(''), false, '"" is not a Function'
    deepEqual OJ.is.array(''), false, '"" is not an Array'
    deepEqual OJ.is.plainObject(''), false, '"" is not an Object'
    return

  
  module 'is...string "false"'
  test '"false" is a String and only a String', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string('false'), true, '"false" is (actually) a String!'
    deepEqual OJ.is.bool('false'), false, '"false" is not a Boolean'
    deepEqual OJ.is.number('false'), false, '"false" is not a Number'
    deepEqual OJ.is.numeric('false'), true, '"false" is binary 0 is numeric'
    deepEqual OJ.is.date('false'), false, '"false" is not a Date'
    deepEqual OJ.is.method('false'), false, '"false" is not a Function'
    deepEqual OJ.is.array('false'), false, '"false" is not an Array'
    deepEqual OJ.is.plainObject('false'), false, '"false" is not an Object'
    return

  
  module 'is...string "true"'
  test '"true" is a String and only a String', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string('true'), true, '"true" is (actually) a String!'
    deepEqual OJ.is.bool('true'), false, '"true" is not a Boolean'
    deepEqual OJ.is.number('true'), false, '"true" is not a Number'
    deepEqual OJ.is.numeric('true'), true, '"true" is binary 1 and is numeric'
    deepEqual OJ.is.date('true'), false, '"true" is not a Date'
    deepEqual OJ.is.method('true'), false, '"true" is not a Function'
    deepEqual OJ.is.array('true'), false, '"true" is not an Array'
    deepEqual OJ.is.plainObject('true'), false, '"true" is not an Object'
    return

  
  module 'is...boolean false'
  test 'false is a Boolean and only a Boolean', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(false), false, 'false is not a String'
    deepEqual OJ.is.bool(false), true, 'false is (actuall) a Boolean!'
    deepEqual OJ.is.number(false), false, 'false is not a Number'
    deepEqual OJ.is.numeric(false), true, 'false converts to 0 is numeric'
    deepEqual OJ.is.date(false), false, 'false is not a Date'
    deepEqual OJ.is.method(false), false, 'false is not a Function'
    deepEqual OJ.is.array(false), false, 'false is not an Array'
    deepEqual OJ.is.plainObject(false), false, 'false is not an Object'
    return

  
  module 'is...boolean true'
  test 'true is a Boolean and only a Boolean', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(true), false, 'true is not a String'
    deepEqual OJ.is.bool(true), true, 'true is (actuall) a Boolean!'
    deepEqual OJ.is.number(true), false, 'true is not a Number'
    deepEqual OJ.is.numeric(true), true, 'true converts to 1 is numeric'
    deepEqual OJ.is.date(true), false, 'true is not a Date'
    deepEqual OJ.is.method(true), false, 'true is not a Function'
    deepEqual OJ.is.array(true), false, 'true is not an Array'
    deepEqual OJ.is.plainObject(true), false, 'true is not an Object'
    return

  
  module 'is...array'
  test '[] is an Array and not any other type', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string([]), false, '[] is not a String'
    deepEqual OJ.is.bool([]), false, '[] is not a Boolean'
    deepEqual OJ.is.number([]), false, '[] is not a Number'
    deepEqual OJ.is.numeric([]), false, '[] is not numeric'
    deepEqual OJ.is.date([]), false, '[] is not a Date'
    deepEqual OJ.is.method([]), false, '[] is not a Function'
    deepEqual OJ.is.array([]), true, '[] is (actually) an Array!'
    deepEqual OJ.is.plainObject([]), false, '[] is not an Object'
    return

  
  module 'is...object'
  test '{} is an Object and not any other type', ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string({}), false, '{} is not a String'
    deepEqual OJ.is.bool({}), false, '{} is not a Boolean'
    deepEqual OJ.is.number({}), false, '{} is not a Number'
    deepEqual OJ.is.numeric({}), false, '{} is not numeric'
    deepEqual OJ.is.date({}), false, '{} is not a Date'
    deepEqual OJ.is.method({}), false, '{} is not a Function'
    deepEqual OJ.is.array({}), false, '{} is not an Array'
    deepEqual OJ.is.plainObject({}), true, '{} is (actually) an Object!'
    return

  module "is...function"
  test "function() {} is a function and not any other type", ->
    expect 8 #all 8 assertions must pass
    deepEqual OJ.is.string(->
    ), false, "function() {} is not a String"
    deepEqual OJ.is.bool(->
    ), false, "function() {} is not a Boolean"
    deepEqual OJ.is.number(->
    ), false, "function() {} is not a Number"
    deepEqual OJ.is.numeric(->
    ), false, "function() {} is not numeric"
    deepEqual OJ.is.date(->
    ), false, "function() {} is not a Date"
    deepEqual OJ.is.method(->
    ), true, "function() {} is (actually) a Function!"
    deepEqual OJ.is.array(->
    ), false, "function() {} is not an Array"
    deepEqual OJ.is.plainObject(->
    ), false, "function() {} is not an Object"
    return

  
 
  module 'is.string'
  test 'OJ.is.string suite', ->
    expect 12
    deepEqual OJ.is.string('a'), true, '"a" is _a_ string'
    deepEqual OJ.is.string('A'), true, '"A" is _a_ string'
    deepEqual OJ.is.string('[]'), true, '"[]" is a string'
    deepEqual OJ.is.string('{}'), true, '"{}" is a string'
    deepEqual OJ.is.string('NaN'), true, '"NaN" is a string'
    deepEqual OJ.is.string('0'), true, '"0" is a string'
    deepEqual OJ.is.string('null'), true, '"null" is a string'
    deepEqual OJ.is.string('undefined'), true, '"undefined" is a string'
    deepEqual OJ.is.string(' '), true, '" " is a string'
    deepEqual OJ.is.string(0), false, '0 is not a string'
    deepEqual OJ.is.string(new Date()), false, 'new Date() is not a string'
    deepEqual OJ.is.string(String), false, 'String is not a string'
    return

  module 'is.bool'
  test 'OJ.is.bool', ->
    expect 4
    deepEqual OJ.is.bool(0), false, '0 is not a boolean value'
    deepEqual OJ.is.bool('0'), false, '"0" is not a boolean value'
    deepEqual OJ.is.bool(1), false, '1 is not a boolean value'
    deepEqual OJ.is.bool('1'), false, '"1" is not a boolean value'
    return

  ##region OJ.is.number
  module 'is.number'
  test 'OJ.is.number', ->
    deepEqual OJ.is.number(1), true, '1 is a number'
    deepEqual OJ.is.number(-1), true, '-1 is a number'
    deepEqual OJ.is.number(0), true, '0 is a number'
    deepEqual OJ.is.number(-0), true, '-0 is a number'
    deepEqual OJ.is.number(Infinity), false, 'Infinity is not a number'
    deepEqual OJ.is.number(-Infinity), false, '-Infinity is not a number'
    deepEqual OJ.is.number(0.000000000000000000000000001), true, '0.000000000000000000000000001 is a number'
    deepEqual OJ.is.number(-0.000000000000000000000000001), true, '-0.000000000000000000000000001 is a number'
    deepEqual OJ.is.number(1e+20), true, '1e+20 is a number'
    deepEqual OJ.is.number(1e+20), true, '1e+20 is a number'
    deepEqual OJ.is.number(0xA), true, '0xA a number'
    deepEqual OJ.is.number(0xA), true, '0xA a number'
    deepEqual OJ.is.number('-'), false, ''-' is not a number'
    return

##endregion OJ.is.number

  module 'is.nullOrUndefined'
  test 'OJ.is.nullOrUndefined', ->
    deepEqual OJ.is.nullOrUndefined(null), true, 'null is null or undefined'
    deepEqual OJ.is.nullOrUndefined(), true, 'undefined is null or undefined'
    deepEqual OJ.is.nullOrUndefined('i_exist'), false, 'object instance is not null or undefined'
    return

  return
) ((if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this))).OJ
