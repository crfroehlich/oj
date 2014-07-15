do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  module 'to.string'
  test 'to.string(null)', ->
    expect 16
    deepEqual OJ.to.string(null) is '', true, '.to.string converts null to string empty.'
    deepEqual OJ.to.string(null, 'a') is 'a', true, 'to.string converts null to "a".'
    deepEqual OJ.to.string(`undefined`) is '', true, 'to.string converts undefined to string empty.'
    deepEqual OJ.to.string(`undefined`, 'a') is 'a', true, 'to.string converts undefined to "a".'
    deepEqual OJ.to.string(NaN) is '', true, 'to.string converts NaN to "".'
    deepEqual OJ.to.string(Infinity) is '', true, 'to.string converts Infinity to "".'
    deepEqual OJ.to.string({}) is '', true, 'to.string converts {} to string empty.'
    deepEqual OJ.to.string(
      a: 'a'
      1: '1'
      x: false
      y: []
    ) is '', true, 'to.string converts {a: "a", 1: "1", x: false, y: []} to string empty.'
    deepEqual OJ.to.string({}, 'a') is 'a', true, 'to.string converts {} to "a".'
    deepEqual OJ.to.string([]) is '', true, 'to.string converts [] to string empty.'
    deepEqual OJ.to.string([
      1
      '1'
      false
      {}
      []
    ]) is '', true, 'to.string converts [1, "1", false, {}, []] to string empty.'
    deepEqual OJ.to.string([], 'a') is 'a', true, 'to.string converts [] to "a".'
    deepEqual OJ.to.string(1, 'a') is '1', true, 'to.string converts 1 to "1".'
    deepEqual OJ.to.string(0, 'a') is '0', true, 'to.string converts 0 to "0".'
    deepEqual OJ.to.string(true, 'a') is 'true', true, 'to.string converts true to "true".'
    deepEqual OJ.to.string(false, 'a') is 'false', true, 'to.string converts false to "false".'
    return

  module 'to.bool'
  test 'to.bool(null)', ->
    expect 17
    deepEqual OJ.to.bool(null), false, 'to.bool converts null to false.'
    deepEqual OJ.to.bool(`undefined`), false, 'to.bool converts undefined to false.'
    deepEqual OJ.to.bool(NaN), false, 'to.bool converts NaN to false.'
    deepEqual OJ.to.bool(Infinity), false, 'to.bool converts Infinity to false.'
    deepEqual OJ.to.bool(-Infinity), false, 'to.bool converts -Infinity to false.'
    deepEqual OJ.to.bool({}), false, 'to.bool converts {} to false.'
    deepEqual OJ.to.bool([]), false, 'to.bool converts [] to false.'
    deepEqual OJ.to.bool(new Date()), false, 'to.bool converts new Date() to false.'
    deepEqual OJ.to.bool(5), false, 'to.bool converts 5 to false.'
    deepEqual OJ.to.bool(0), false, 'to.bool converts 0 to false.'
    deepEqual OJ.to.bool('0'), false, 'to.bool converts "0" to false.'
    deepEqual OJ.to.bool('false'), false, 'to.bool converts "false" to false.'
    deepEqual OJ.to.bool(false), false, 'to.bool converts false to false.'
    deepEqual OJ.to.bool(1), true, 'to.bool converts 1 to true.'
    deepEqual OJ.to.bool('1'), true, 'to.bool converts "1" to true.'
    deepEqual OJ.to.bool('true'), true, 'to.bool converts "true" to true.'
    deepEqual OJ.to.bool(true), true, 'to.bool converts true to true.'
    return

  module '.number.isNaN'
  test '.number.isNaN', ->
    expect 8
    deepEqual OJ.number.isNaN(OJ.to.number(null)), true, 'to.number converts null to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number(`undefined`)), true, 'to.number converts undefined to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number(NaN)), true, 'to.number converts NaN to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number(Infinity)), true, 'to.number converts Infinity to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number(-Infinity)), true, 'to.number converts -Infinity to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number({})), true, 'to.number converts {} to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number([])), true, 'to.number converts [] to NaN.'
    deepEqual OJ.number.isNaN(OJ.to.number(new Date())), true, 'to.number converts new Date() to NaN.'
    return

  module 'to.number'
  test 'to.number(null)', ->
    expect 10
    deepEqual OJ.to.number(0) is 0, true, 'to.number converts 0 to 0.'
    deepEqual OJ.to.number('0') is 0, true, 'to.number converts "0" to 0.'
    deepEqual OJ.to.number('false') is 0, true, 'to.number converts "false" to 0.'
    deepEqual OJ.to.number(false) is 0, true, 'to.number converts false to 0.'
    deepEqual OJ.to.number(1) is 1, true, 'to.number converts 1 to 1.'
    deepEqual OJ.to.number('1') is 1, true, 'to.number converts "1" to 1.'
    deepEqual OJ.to.number('true') is 1, true, 'to.number converts "true" to 1.'
    deepEqual OJ.to.number(true) is 1, true, 'to.bool converts true to 1.'
    deepEqual OJ.to.number('42') is 42, true, 'to.number converts "42" to 42.'
    deepEqual OJ.to.number('-42') is -42, true, 'to.number converts "-42" to -42.'
    return

  

