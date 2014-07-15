do (OJ = (if typeof global isnt 'undefined' and global then global else (if typeof window isnt 'undefined' then window else this)).OJ) ->
  OJ.register "delimitedString", (string, opts) ->
    defaults =
      newLineToDelimiter: true
      spaceToDelimiter: true
      removeDuplicates: true
      delimiter: ","
      initString: OJ.to.string string

    retObj =
      array: []
      delimited: ->
        retObj.array.join defaults.delimiter

      string: (delimiter = defaults.delimiter) ->
        ret = ''
        OJ.each retObj.array, (val) ->
          ret += delimiter  if ret.length > 0
          ret += val
          return

        ret

      toString: ->
        retObj.string()

      add: (str) ->
        retObj.array.push defaults.parse(str)
        defaults.deleteDuplicates()
        retObj

      remove: (str) ->
        remove = (array) ->
          array.filter (item) ->
            true  if item isnt str


        retObj.array = remove(retObj.array)
        retObj

      count: ->
        retObj.array.length

      contains: (str, caseSensitive) ->
        isCaseSensitive = OJ.to.bool(caseSensitive)
        str = OJ.to.string(str).trim()
        str = str.toLowerCase()  if false is isCaseSensitive
        match = retObj.array.filter((matStr) ->
          (isCaseSensitive and OJ.to.string(matStr).trim() is str) or OJ.to.string(matStr).trim().toLowerCase() is str
        )
        match.length > 0

      each: (callBack) ->
        retObj.array.forEach callBack

    defaults.parse = (str) ->
      ret = OJ.to.string(str)
      ret = ret.replace(/\n/g, defaults.delimiter)  while ret.indexOf("\n") isnt -1  if defaults.newLineToDelimiter
      ret = ret.replace(RegExp(" ", "g"), defaults.delimiter)  while ret.indexOf(" ") isnt -1  if defaults.spaceToDelimiter
      ret = ret.replace(/,,/g, defaults.delimiter)  while ret.indexOf(",,") isnt -1
      ret

    defaults.deleteDuplicates = ->
      if defaults.removeDuplicates
        (->
          unique = (array) ->
            seen = new Set()
            array.filter (item) ->
              if false is seen.has(item)
                seen.add item
                true


          retObj.array = unique(retObj.array)
          return
        )()
      return

    ((a) ->
      if a.length > 1 and false is OJ.is.plainObject(opts)
        OJ.each a, (val) ->
          retObj.array.push val  if false is OJ.is.nullOrEmpty(val)
          return

      else if string and string.length > 0
        OJ.extend defaults, opts
        delimitedString = defaults.parse(string)
        defaults.initString = delimitedString
        retObj.array = delimitedString.split(defaults.delimiter)
      defaults.deleteDuplicates()
      return
    ) arguments
    retObj

  return

