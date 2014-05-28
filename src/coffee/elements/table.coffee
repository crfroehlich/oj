((OJ)->
  'use strict'
  
  nodeName = 'table'
  
  OJ.nodes.register nodeName, (options, owner = OJ.body, calledFromFactory = false) ->
    
    defaults =
      props: 
        cellpadding: 0
        cellspacing: 0
        align: ''
        width: ''
        cellalign: 'left'
        cellvalign: 'top'
        class: ''
      styles: {}
      events:
        click: OJ.noop
      cells:
        class: ''
        align: ''
        'vertical-align': ''
        cellpadding: ''
        margin: ''

      firstAlignRight: false
      oddAlignRight: false
    
    rows = []
    cells = OJ.array2D()
    columnCount = 0
    
    OJ.extend defaults, options, true
    ret = OJ.element nodeName, defaults.props, defaults.styles, defaults.events, defaults.text
    if false is calledFromFactory then OJ.nodes.factory ret, owner
    
    tbody = null
    thead = null
    theadRow = null
    ret.add 'init', _.once ->  
      thead = ret.make 'thead'
      theadRow = thead.make 'tr'
      tbody = ret.make 'tbody'
      rows.push tbody.make 'tr'
      ret
    
    fillMissing = () ->
      cells.each (rowNo, colNo, val) ->
        if not val
          row = ret.row rowNo
          row.cell colNo, {} 
    
    ###
    Adds a column name to the table head
    ###
    ret.add 'column', (colNo, colName) ->
      ret.init()
      columnCount += 1
      th = null
      i = 0
      while thead[0].rows[0].cells.length < colNo
        nativeTh = thead[0].rows[0].cells[i]
        if not nativeTh
          th = theadRow.make 'th', {}  
        else 
          th = OJ.restoreElement 'th', nativeTh  
        i += 1
      if not th
        nativeTh = thead[0].rows[0].cells[colNo-1]
        th = OJ.restoreElement 'th', nativeTh
      th.text colName
      th
    
    ###
    Adds a new row (tr) to the table body
    ###
    ret.add 'row', (rowNo, opts) ->              
      ret.init()
      row = rows[rowNo-1]
      
      if not row
        while rows.length < rowNo
          row = tbody.make 'tr', {}
          rows.push row  
      
      if not row.cell
        row.add 'cell', (colNo, opts) ->
          cell = OJ.nodes.td opts, row
          cells.set rowNo, colNo, cell
          cell
      
      row
                                                                                                                                              
    ###
    Adds a cell (tr/td) to the table body
    ###              
    ret.add 'cell', (rowNo, colNo, opts) ->
      ret.init()
      if rowNo < 1 then rowNo = 1
      if colNo < 1 then colNo = 1
      if columnCount > 0 and colNo-1 > columnCount then throw new Error 'A column name has not been defined for this position {' + rowNo + 'x' + colNo + '}.'    
          
      row = ret.row rowNo
      
      cell = cells.get rowNo, colNo
      
      if not cell
        i = 0
        while i < colNo
          i += 1
          tryCell = cells.get rowNo, i
          if not tryCell
            if i is colNo
              nuOpts = OJ.extend {props: defaults.cells}, opts
              cell = row.cell colNo, nuOpts
            else  
              row.cell i, props: defaults.cells
      cell  

    ret

  return

) ((if typeof global isnt 'undefined' and global then global else ((if typeof window isnt 'undefined' then window else this)))).OJ
