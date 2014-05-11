#global OJ:true
((OJ) ->
  OJ.register "delimitedString", (string, opts) ->
    nsInternal =
      newLineToDelimiter: true
      spaceToDelimiter: true
      removeDuplicates: true
      delimiter: ","
      initString: OJ.to.string(string)

    nsRet =
      array: []
      delimited: ->
        nsRet.array.join nsInternal.delimiter

      string: (delimiter) ->
        delimiter = delimiter or nsInternal.delimiter
        ret = ""
        OJ.each nsRet.array, (val) ->
          ret += delimiter  if ret.length > 0
          ret += val
          return

        ret

      toString: ->
        nsRet.string()

      add: (str) ->
        nsRet.array.push nsInternal.parse(str)
        nsInternal.deleteDuplicates()
        nsRet

      remove: (str) ->
        remove = (array) ->
          array.filter (item) ->
            true  if item isnt str


        nsRet.array = remove(nsRet.array)
        nsRet

      count: ->
        nsRet.array.length

      contains: (str, caseSensitive) ->
        isCaseSensitive = OJ.to.bool(caseSensitive)
        str = OJ.string(str).trim()
        str = str.toLowerCase()  if false is isCaseSensitive
        match = nsRet.array.filter((matStr) ->
          (isCaseSensitive and OJ.to.string(matStr).trim() is str) or OJ.to.string(matStr).trim().toLowerCase() is str
        )
        match.length > 0

      each: (callBack) ->
        nsRet.array.forEach callBack

    nsInternal.parse = (str) ->
      ret = OJ.to.string(str)
      ret = ret.replace(/\n/g, nsInternal.delimiter)  while ret.indexOf("\n") isnt -1  if nsInternal.newLineToDelimiter
      ret = ret.replace(RegExp(" ", "g"), nsInternal.delimiter)  while ret.indexOf(" ") isnt -1  if nsInternal.spaceToDelimiter
      ret = ret.replace(/,,/g, nsInternal.delimiter)  while ret.indexOf(",,") isnt -1
      ret

    nsInternal.deleteDuplicates = ->
      if nsInternal.removeDuplicates
        (->
          unique = (array) ->
            seen = new Set()
            array.filter (item) ->
              if false is seen.has(item)
                seen.add item
                true


          nsRet.array = unique(nsRet.array)
          return
        )()
      return

    ((a) ->
      if a.length > 1 and false is OJ.is.plainObject(opts)
        OJ.each a, (val) ->
          nsRet.array.push val  if false is OJ.is.nullOrEmpty(val)
          return

      else if string and string.length > 0
        OJ.extend nsInternal, opts
        delimitedString = nsInternal.parse(string)
        nsInternal.initString = delimitedString
        nsRet.array = delimitedString.split(nsInternal.delimiter)
      nsInternal.deleteDuplicates()
      return
    ) arguments
    nsRet

  return
) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
