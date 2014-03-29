(->
  'use strict'
  OJ.register "getDateFromDnJson", (dnDate) ->
    
    # Transforms a .NET JSON date into a JavaScript date.
    # name="obj"  Object to test
    # type="Boolean" />
    #
    #       var milli = OJ.number(DnDate.replace(/\/Date\((\d+)\-?(\d+)\)\//, '$1'));
    #       var offset = OJ.number(DnDate.replace(/\/Date\(\d+([\+\-]?\d+)\)\//, '$1'));
    #       var localOffset = new Date().getTimezoneOffset();
    #       return new Date((milli - ((localOffset + (offset / 100 * 60)) * 1000)));
    #       
    
    # Dn Date will look like /Date(1335758400000-0400)/  
    dnDateStr = OJ.string(dnDate)
    ret = undefined
    ticks = undefined
    offset = undefined
    localOffset = undefined
    arr = undefined
    ret = OJ.dateTimeMinValue
    if false is OJ.isNullOrEmpty(dnDateStr)
      dnDateStr = dnDateStr.replace("/", "")
      dnDateStr = dnDateStr.replace("Date", "")
      dnDateStr = dnDateStr.replace("(", "")
      dnDateStr = dnDateStr.replace(")", "")
      arr = dnDateStr.split("-")
      if arr.length > 1
        ticks = OJ.number(arr[0])
        offset = OJ.number(arr[1])
        localOffset = new Date().getTimezoneOffset()
        ret = new Date((ticks - ((localOffset + (offset / 100 * 60)) * 1000)))
      else if arr.length is 1
        ticks = OJ.number(arr[0])
        ret = new Date(ticks)
    ret

  return
)()
