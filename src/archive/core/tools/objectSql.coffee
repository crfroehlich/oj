# jshint undef: true, unused: true 

# global OJ:true, window:true, Ext:true, $: true 
(_propertyIIFE = (OJ) ->
  select = ->
    query = this
    slice = Array::slice
    args = slice.call(arguments_, 0)
    query.columns = query.columns or []
    OJ.each args, (argumentValue) ->
      query.columns.push argumentValue
      return

    query
  run = ->
    query = this
    ret = []
    if query.columns.length > 0
      results = []
      OJ.each query.columns, (columnName) ->
        OJ.each query.tables, ((tbl) ->
          if Array.isArray(tbl)
            res = {}
            val = tbl._select((val) ->
              val[columnName]
            )
            if val
              res[columnName] = val
              results.push res
          return
        ), true
        return

      returnRows = []
      if results and results.length > 0
        firstResult = results[0]
        OJ.each firstResult, ((val, key) ->
          OJ.each val, ((cell) ->
            row = {}
            row[key] = cell
            OJ.each results.slice(1), ((result) ->
              OJ.each result, ((v, k) ->
                OJ.each v, (c) ->
                  row[k] = c
                  return

                return
              ), true
              return
            ), true
            returnRows.push row
            return
          ), true
          return
        ), true
    returnRows
  from = (array) ->
    query = this
    query.tables.push array
    query
  Object.defineProperties Array::,
    _where:
      value: (func) ->
        OJ.filter func, this

    _select:
      value: (func) ->
        OJ.map func, this

  query = (array) ->
    tables = []
    tables.push array
    _query =
      tables: tables
      from: from
      select: select
      run: run

    _query

  OJ.register "objectSql", query
  return
) ((if typeof global isnt "undefined" and global then global else ((if typeof window isnt "undefined" then window else this)))).OJ
