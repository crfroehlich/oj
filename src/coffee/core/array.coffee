(->
  makeSequentialArray = (start, end) ->
    ret = array()
    i = undefined
    end = +end
    if OJ.isNumber(start) and OJ.isNumber(end)
      i = +start
      while i <= end
        ret.push i
        i += 1
    ret
  OJ.register "makeSequentialArray", makeSequentialArray
  return
)()
